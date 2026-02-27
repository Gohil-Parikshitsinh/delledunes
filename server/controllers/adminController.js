import Order from "../models/Orders.js";
import Product from "../models/Product.js";
import ProductVariant from "../models/ProductVariant.js";

export const getDashboardStats = async (req, res) => {
  try {
    const orders = await Order.find();

    const totalSales = orders.length;

    // Only PAID + DELIVERED orders
    const completedOrders = orders.filter(
      (order) =>
        order.orderStatus === "delivered" && order.paymentStatus === "paid"
    );

    // Total Income
    const totalIncome = completedOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Total Profit
    const totalProfit = completedOrders.reduce(
      (sum, order) => sum + (order.totalAmount - order.totalCost),
      0
    );

    // Status Counts
    const newOrders = orders.filter(
      (o) => o.orderStatus === "processing"
    ).length;
    const pendingOrders = orders.filter(
      (o) => o.orderStatus === "shipped"
    ).length;
    const cancelOrders = orders.filter(
      (o) => o.orderStatus === "cancelled"
    ).length;
    const deliveredOrders = orders.filter(
      (o) => o.orderStatus === "delivered"
    ).length;
       
    res.json({
      success: true,
      data: {
        totalIncome,
        totalSales,
        totalProfit,
        newOrders,
        pendingOrders,
        cancelOrders,
        deliveredOrders
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardChartData = async (req, res) => {
  try {

    const monthlyData = await Order.aggregate([
      {
        $match: {
          orderStatus: "delivered",
          paymentStatus: "paid"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalIncome: { $sum: "$totalAmount" },
          totalCost: { $sum: "$totalCost" },
          totalSales: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalIncome: 1,
          totalSales: 1,
          totalProfit: {
            $subtract: ["$totalIncome", "$totalCost"]
          }
        }
      },
      {
        $sort: { year: 1, month: 1 }
      }
    ]);

    res.json({
      success: true,
      data: monthlyData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getInventoryStats = async (req, res) => {
  try {

    const [productCount, variantCount] = await Promise.all([
      Product.countDocuments(),
      ProductVariant.countDocuments()
    ]);

    // If no products exist
    if (productCount === 0) {
      return res.json({
        success: true,
        data: {
          totalProducts: 0,
          totalVariants: 0,
          totalStock: 0,
          outOfStockProducts: 0,
          lowStockProducts: 0,
          totalInventoryValue: 0,
          potentialRevenueValue: 0
        }
      });
    }

    const inventoryStats = await ProductVariant.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData"
        }
      },
      { $unwind: "$productData" },
      {
        $group: {
          _id: null,
          totalStock: { $sum: { $max: ["$stock", 0] } }, // prevent negative stock
          totalInventoryValue: {
            $sum: {
              $multiply: [
                { $max: ["$stock", 0] },
                "$productData.costPrice"
              ]
            }
          },
          potentialRevenueValue: {
            $sum: {
              $multiply: [
                { $max: ["$stock", 0] },
                "$productData.offerPrice"
              ]
            }
          }
        }
      }
    ]);

    const stockData = inventoryStats[0] || {
      totalStock: 0,
      totalInventoryValue: 0,
      potentialRevenueValue: 0
    };

    // Out of stock products (all variants stock = 0)
    const outOfStockProducts = await Product.aggregate([
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product",
          as: "variants"
        }
      },
      {
        $match: {
          variants: { $ne: [] }
        }
      },
      {
        $project: {
          allZero: {
            $allElementsTrue: {
              $map: {
                input: "$variants",
                as: "v",
                in: { $lte: ["$$v.stock", 0] }
              }
            }
          }
        }
      },
      {
        $match: { allZero: true }
      },
      { $count: "count" }
    ]);

    // Low stock products (default threshold = 5)
    const lowStockThreshold = 5;

    const lowStockProducts = await ProductVariant.countDocuments({
      stock: { $gt: 0, $lte: lowStockThreshold }
    });

    res.json({
      success: true,
      data: {
        totalProducts: productCount,
        totalVariants: variantCount,
        totalStock: stockData.totalStock,
        outOfStockProducts: outOfStockProducts[0]?.count || 0,
        lowStockProducts,
        totalInventoryValue: stockData.totalInventoryValue,
        potentialRevenueValue: stockData.potentialRevenueValue
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const getLowStockProducts = async (req, res) => {
  try {

    let { threshold } = req.query;

    threshold = parseInt(threshold);

    if (isNaN(threshold) || threshold <= 0) {
      threshold = 5; // default
    }

    const lowStockVariants = await ProductVariant.find({
      stock: { $gt: 0, $lte: threshold }
    })
      .populate({
        path: "product",
        select: "name slug brand category offerPrice costPrice"
      })
      .sort({ stock: 1 });

    if (!lowStockVariants.length) {
      return res.json({
        success: true,
        message: "No low stock products found",
        data: []
      });
    }

    res.json({
      success: true,
      threshold,
      count: lowStockVariants.length,
      data: lowStockVariants
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const buildDateFilter = (startDate, endDate) => {
  const filter = {};

  if (startDate || endDate) {
    filter.createdAt = {};
  }

  if (startDate) {
    const start = new Date(startDate);
    if (!isNaN(start)) {
      filter.createdAt.$gte = start;
    }
  }

  if (endDate) {
    const end = new Date(endDate);
    if (!isNaN(end)) {
      filter.createdAt.$lte = end;
    }
  }

  return filter;
};

export const getReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = buildDateFilter(startDate, endDate);

    const report = await Order.aggregate([
      {
        $match: {
          ...dateFilter,
          orderStatus: "delivered",
          paymentStatus: "paid"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalIncome: { $sum: "$totalAmount" },
          totalCost: { $sum: "$totalCost" },
          totalSales: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalIncome: 1,
          totalSales: 1,
          totalProfit: {
            $subtract: ["$totalIncome", "$totalCost"]
          }
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    res.json({
      success: true,
      data: report || []
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSalesReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = buildDateFilter(startDate, endDate);

    const sales = await Order.aggregate([
      {
        $match: {
          ...dateFilter,
          paymentStatus: "paid"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          day: "$_id.day",
          totalOrders: 1
        }
      },
      { $sort: { year: 1, month: 1, day: 1 } }
    ]);

    res.json({
      success: true,
      data: sales || []
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getUserReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = buildDateFilter(startDate, endDate);

    const users = await User.aggregate([
      {
        $match: {
          ...dateFilter
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          newUsers: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          newUsers: 1
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    res.json({
      success: true,
      data: users || []
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getTopProducts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = buildDateFilter(startDate, endDate);

    const topProducts = await Order.aggregate([
      {
        $match: {
          ...dateFilter,
          orderStatus: "delivered",
          paymentStatus: "paid"
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      {
        $sort: { totalSold: -1 }
      },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productData"
        }
      },
      { $unwind: "$productData" },
      {
        $project: {
          _id: 0,
          productId: "$productData._id",
          name: "$productData.name",
          totalSold: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: topProducts || []
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRevenueAnalytics = async (req, res) => {
  try {

    const { startDate, endDate } = req.query;
    const dateFilter = buildDateFilter(startDate, endDate);

    const baseMatch = {
      ...dateFilter,
      orderStatus: "delivered",
      paymentStatus: "paid"
    };

    const revenueData = await Order.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalCost: { $sum: "$totalCost" },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    const data = revenueData[0] || {
      totalRevenue: 0,
      totalCost: 0,
      totalOrders: 0
    };

    const totalProfit = data.totalRevenue - data.totalCost;

    const averageOrderValue =
      data.totalOrders > 0
        ? data.totalRevenue / data.totalOrders
        : 0;

    const profitMargin =
      data.totalRevenue > 0
        ? (totalProfit / data.totalRevenue) * 100
        : 0;

    res.json({
      success: true,
      data: {
        totalRevenue: data.totalRevenue,
        totalOrders: data.totalOrders,
        totalCost: data.totalCost,
        totalProfit,
        averageOrderValue: Number(averageOrderValue.toFixed(2)),
        profitMargin: Number(profitMargin.toFixed(2))
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const getMonthlyRevenue = async (req, res) => {
  try {

    const { year } = req.query;

    const selectedYear = parseInt(year) || new Date().getFullYear();

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: "delivered",
          paymentStatus: "paid",
          $expr: { $eq: [{ $year: "$createdAt" }, selectedYear] }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$totalAmount" },
          totalCost: { $sum: "$totalCost" },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalRevenue: 1,
          totalOrders: 1,
          totalProfit: {
            $subtract: ["$totalRevenue", "$totalCost"]
          },
          averageOrderValue: {
            $cond: [
              { $gt: ["$totalOrders", 0] },
              { $divide: ["$totalRevenue", "$totalOrders"] },
              0
            ]
          }
        }
      },
      { $sort: { month: 1 } }
    ]);

    res.json({
      success: true,
      year: selectedYear,
      data: monthlyRevenue || []
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getPredictionOverview = async (req, res) => {};
export const getSalesPrediction = async (req, res) => {};
export const getDemandPrediction = async (req, res) => {};
export const getUserChurnPrediction = async (req, res) => {};

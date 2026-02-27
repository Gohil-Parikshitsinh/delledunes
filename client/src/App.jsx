import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";

// Storefront pages
import Home from "./pages/Home/index.jsx";
import Shop from "./pages/Shop/index.jsx";
import ProductDetail from "./pages/ProductDetail/index.jsx";
import Cart from "./pages/Cart/index.jsx";
import Checkout from "./pages/Checkout/index.jsx";
import Orders from "./pages/Orders/index.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";

// Admin pages
import Dashboard from "./pages/Admin/Dashboard/index.jsx";
import AdminProducts from "./pages/Admin/Products/index.jsx";
import AdminOrders from "./pages/Admin/Orders/index.jsx";
import Inventory from "./pages/Admin/Inventory/index.jsx";
import AdminCustomers from "./pages/Admin/Customers/index.jsx";
import Reports from "./pages/Admin/Reports/index.jsx";
import CreateProduct from "./pages/Admin/Products/Create.jsx";
import EditProduct from "./pages/Admin/Products/Edit.jsx";

const App = () => {
  return (
    <Routes>
      {/* ── PUBLIC STOREFRONT ───────────────────────────────── */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── PROTECTED USER ROUTES ─────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Route>

      {/* ── PROTECTED ADMIN ROUTES ────────────────────────────── */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Route>

      {/* ── FALLBACK ──────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

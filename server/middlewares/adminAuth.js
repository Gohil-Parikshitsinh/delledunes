const adminAuth = (req, res, next) => {
    if (req.userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin only access"
      });
    }
  
    next();
  };
  
  export default adminAuth;
  
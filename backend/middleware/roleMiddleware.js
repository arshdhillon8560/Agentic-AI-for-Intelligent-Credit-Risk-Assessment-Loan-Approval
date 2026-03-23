module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: "Access denied: insufficient permissions"
        });
      }

      next();

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
};
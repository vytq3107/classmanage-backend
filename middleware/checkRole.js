const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user || {};

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({
        error: 'Permission denied'
      });
    }

    next();
  };
};

module.exports = checkRole;

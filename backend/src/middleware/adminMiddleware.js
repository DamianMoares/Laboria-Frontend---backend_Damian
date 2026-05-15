const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      const error = new Error('Acceso denegado - Requiere rol ADMIN');
      error.statusCode = 403;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = adminMiddleware;

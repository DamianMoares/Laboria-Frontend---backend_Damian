const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    const error = new Error('Acceso denegado - Requiere rol ADMIN');
    error.statusCode = 403;
    throw error;
  }
  next();
};

module.exports = adminMiddleware;

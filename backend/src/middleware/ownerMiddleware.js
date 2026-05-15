const ownerMiddleware = (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      const error = new Error('No autorizado - Solo puedes acceder a tu propio perfil');
      error.statusCode = 403;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = ownerMiddleware;
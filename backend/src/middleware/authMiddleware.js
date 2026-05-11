const { verifyToken } = require('../utils/jwt');
const prisma = require('../config/database');

const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('No autorizado - Token no proporcionado');
      error.statusCode = 401;
      throw error;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = verifyToken(token);
    if (!decoded) {
      const error = new Error('No autorizado - Token inválido');
      error.statusCode = 401;
      throw error;
    }
    
    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true }
    });
    
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    // Agregar usuario al request para usarlo en controllers
    req.user = user;
    next();
    
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;

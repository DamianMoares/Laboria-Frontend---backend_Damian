const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const prisma = require('../config/database');

// ==========================================
// RUTAS PÚBLICAS (no requieren autenticación)
// ==========================================

// POST /api/users/register
router.post('/register', userController.register);

// POST /api/users/login
router.post('/login', userController.login);

// ==========================================
// RUTAS PROTEGIDAS (requieren JWT)
// ==========================================

// GET /api/users/profile/me - Perfil del usuario autenticado
router.get('/profile/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

// PUT /api/users/profile/me - Actualizar mi perfil
router.put('/profile/me', authMiddleware, userController.updateProfile);

// DELETE /api/users/account - Eliminar mi cuenta
router.delete('/account', authMiddleware, userController.deleteAccount);

// ==========================================
// RUTAS DE ADMIN (requieren JWT + rol ADMIN)
// ==========================================

// GET /api/users - Listar todos los usuarios (solo admins)
router.get('/', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Rutas por ID (mantener compatibilidad, protegidas)
router.get('/:id', authMiddleware, userController.getProfile);
router.put('/:id', authMiddleware, userController.updateProfile);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteAccount);

module.exports = router;
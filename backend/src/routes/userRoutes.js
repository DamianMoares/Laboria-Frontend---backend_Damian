const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const ownerMiddleware = require('../middleware/ownerMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

// ==========================================
// RUTAS PÚBLICAS (no requieren autenticación)
// ==========================================

// POST /api/users/register (con rate limiting)
router.post('/register', authLimiter, userController.register);

// POST /api/users/login (con rate limiting)
router.post('/login', authLimiter, userController.login);

// ==========================================
// RUTAS PROTEGIDAS (requieren JWT)
// ==========================================

// GET /api/users/profile/me - Perfil del usuario autenticado
router.get('/profile/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

// PUT /api/users/profile/me - Actualizar mi perfil
router.put('/profile/me', authMiddleware, (req, res, next) => {
  req.params.id = req.user.id;
  userController.updateProfile(req, res, next);
});

// DELETE /api/users/account - Eliminar mi cuenta
router.delete('/account', authMiddleware, (req, res, next) => {
  req.params.id = req.user.id;
  userController.deleteAccount(req, res, next);
});

// ==========================================
// RUTAS POR ID (solo propio usuario o admin)
// ==========================================
router.get('/:id', authMiddleware, ownerMiddleware, userController.getProfile);
router.put('/:id', authMiddleware, ownerMiddleware, userController.updateProfile);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteAccount);

module.exports = router;
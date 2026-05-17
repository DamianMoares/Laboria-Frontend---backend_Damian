const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const ownerMiddleware = require('../middleware/ownerMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const { registerRules, loginRules, updateProfileRules, forgotPasswordRules, resetPasswordRules, changePasswordRules } = require('../middleware/validate');

// ==========================================
// RUTAS PÚBLICAS (no requieren autenticación)
// ==========================================

// POST /api/users/register (con rate limiting + validación)
router.post('/register', authLimiter, registerRules, userController.register);

// POST /api/users/login (con rate limiting + validación)
router.post('/login', authLimiter, loginRules, userController.login);

// POST /api/users/forgot-password - Solicitar restablecimiento (con rate limiting + validación)
router.post('/forgot-password', authLimiter, forgotPasswordRules, userController.forgotPassword);

// POST /api/users/reset-password - Restablecer contraseña (con rate limiting + validación)
router.post('/reset-password', authLimiter, resetPasswordRules, userController.resetPassword);

// ==========================================
// RUTAS PROTEGIDAS (requieren JWT)
// ==========================================

// GET /api/users/profile/me - Perfil del usuario autenticado
router.get('/profile/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

// PUT /api/users/profile/me - Actualizar mi perfil
router.put('/profile/me', authMiddleware, updateProfileRules, (req, res, next) => {
  req.params.id = req.user.id;
  userController.updateProfile(req, res, next);
});

// POST /api/users/logout - Cerrar sesión
router.post('/logout', authMiddleware, userController.logout);

// GET /api/users/session-stats - Estadísticas de sesiones
router.get('/session-stats', authMiddleware, userController.sessionStats);

// POST /api/users/change-password - Cambiar contraseña (con validación)
router.post('/change-password', authMiddleware, changePasswordRules, userController.changePassword);

// GET /api/users/curriculum - Obtener curriculum
router.get('/curriculum', authMiddleware, userController.getCurriculum);

// PUT /api/users/curriculum - Guardar curriculum
router.put('/curriculum', authMiddleware, userController.saveCurriculum);

// DELETE /api/users/account - Eliminar mi cuenta
router.delete('/account', authMiddleware, (req, res, next) => {
  req.params.id = req.user.id;
  userController.deleteAccount(req, res, next);
});

// ==========================================
// RUTAS POR ID (solo propio usuario o admin)
// ==========================================
router.get('/:id', authMiddleware, ownerMiddleware, userController.getProfile);
router.put('/:id', authMiddleware, ownerMiddleware, updateProfileRules, userController.updateProfile);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteAccount);

module.exports = router;
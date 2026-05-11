const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Todas las rutas requieren autenticación y rol de admin
router.use(authMiddleware, adminMiddleware);

// ==========================================
// DASHBOARD - Estadísticas
// ==========================================
router.get('/dashboard', adminController.getDashboardStats);

// ==========================================
// GESTIÓN DE USUARIOS
// ==========================================
// Listar todos los usuarios (con filtros y paginación)
router.get('/users', adminController.getAllUsers);

// Obtener detalles de un usuario específico
router.get('/users/:id', adminController.getUserDetails);

// Actualizar rol de usuario
router.put('/users/:id/role', adminController.updateUserRole);

// Eliminar usuario
router.delete('/users/:id', adminController.deleteUserAsAdmin);

// ==========================================
// GESTIÓN DE EMPLEOS
// ==========================================
// Listar todos los empleos
router.get('/jobs', adminController.getAllJobs);

// Actualizar cualquier empleo
router.put('/jobs/:id', adminController.updateJobAsAdmin);

// Eliminar cualquier empleo
router.delete('/jobs/:id', adminController.deleteJobAsAdmin);

// ==========================================
// GESTIÓN DE CURSOS
// ==========================================
// Listar todos los cursos
router.get('/courses', adminController.getAllCourses);

// Actualizar cualquier curso
router.put('/courses/:id', adminController.updateCourseAsAdmin);

// Eliminar cualquier curso
router.delete('/courses/:id', adminController.deleteCourseAsAdmin);

// ==========================================
// GESTIÓN DE APLICACIONES
// ==========================================
// Listar todas las aplicaciones
router.get('/applications', adminController.getAllApplications);

// Actualizar estado de aplicación
router.put('/applications/:id/status', adminController.updateApplicationStatusAsAdmin);

module.exports = router;

const express = require('express');
const router = express.Router();
const scraperController = require('../controllers/scraperController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// GET /api/scraper/sources - Listar fuentes disponibles
router.get('/sources', scraperController.listSources);

// POST /api/scraper/run-all - Ejecutar escaneo completo (admin)
router.post('/run-all', authMiddleware, adminMiddleware, scraperController.runAll);

// POST /api/scraper/run/:sourceName - Escanear fuente específica (admin)
router.post('/run/:sourceName', authMiddleware, adminMiddleware, scraperController.runSource);

// GET /api/scraper/courses - Obtener cursos escaneados
router.get('/courses', scraperController.listCourses);

module.exports = router;

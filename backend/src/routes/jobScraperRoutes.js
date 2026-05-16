const express = require('express');
const router = express.Router();
const jobScraperController = require('../controllers/jobScraperController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// GET /api/job-scraper/sources - Listar fuentes disponibles
router.get('/sources', jobScraperController.listSources);

// POST /api/job-scraper/run-all - Ejecutar escaneo completo (admin)
router.post('/run-all', authMiddleware, adminMiddleware, jobScraperController.runAll);

// POST /api/job-scraper/run/:sourceName - Escanear fuente específica (admin)
router.post('/run/:sourceName', authMiddleware, adminMiddleware, jobScraperController.runSource);

// GET /api/job-scraper/jobs - Obtener empleos escaneados
router.get('/jobs', jobScraperController.listJobs);

module.exports = router;

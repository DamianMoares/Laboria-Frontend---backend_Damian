const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

// Candidato: Crear aplicación
router.post('/', authMiddleware, applicationController.create);

// Candidato: Ver mis aplicaciones
router.get('/my', authMiddleware, applicationController.myApplications);

// Empresa: Ver aplicaciones a un empleo
router.get('/job/:jobId', authMiddleware, applicationController.jobApplications);

// Empresa: Actualizar estado de aplicación
router.put('/:id/status', authMiddleware, applicationController.updateStatus);

// Candidato: Cancelar aplicación
router.delete('/:id', authMiddleware, applicationController.cancel);

module.exports = router;

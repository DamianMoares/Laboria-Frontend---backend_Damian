const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

// Públicas
router.get('/', jobController.list);
router.get('/:id', jobController.detail);

// Protegidas
router.post('/', authMiddleware, jobController.create);
router.put('/:id', authMiddleware, jobController.update);
router.delete('/:id', authMiddleware, jobController.delete);

module.exports = router;

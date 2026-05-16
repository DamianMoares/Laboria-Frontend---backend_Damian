const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
const { createJobRules, updateJobRules } = require('../middleware/validate');

// Públicas
router.get('/', jobController.list);
router.get('/:id', jobController.detail);

// Protegidas
router.post('/', authMiddleware, createJobRules, jobController.create);
router.put('/:id', authMiddleware, updateJobRules, jobController.update);
router.delete('/:id', authMiddleware, jobController.delete);

module.exports = router;

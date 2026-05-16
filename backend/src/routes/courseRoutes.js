const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const { createCourseRules, updateCourseRules } = require('../middleware/validate');

// Públicas
router.get('/', courseController.list);
router.get('/:id', courseController.detail);

// Protegidas
router.post('/', authMiddleware, createCourseRules, courseController.create);
router.put('/:id', authMiddleware, updateCourseRules, courseController.update);
router.delete('/:id', authMiddleware, courseController.delete);

module.exports = router;

const express = require('express');
const router = express.Router();
const courseApplicationController = require('../controllers/courseApplicationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, courseApplicationController.create);
router.get('/my', authMiddleware, courseApplicationController.myApplications);
router.put('/:id/status', authMiddleware, courseApplicationController.updateStatus);
router.delete('/:id', authMiddleware, courseApplicationController.cancel);

module.exports = router;

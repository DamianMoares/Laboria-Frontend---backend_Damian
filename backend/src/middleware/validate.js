const { body, validationResult } = require('express-validator');

const handleErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array().map(e => e.msg).join('. '));
    error.statusCode = 400;
    return next(error);
  }
  next();
};

const registerRules = [
  body('email').isEmail().withMessage('Email no válido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password debe tener al menos 6 caracteres'),
  body('name').trim().notEmpty().withMessage('Nombre es requerido'),
  handleErrors,
];

const loginRules = [
  body('email').isEmail().withMessage('Email no válido').normalizeEmail(),
  body('password').notEmpty().withMessage('Password es requerido'),
  handleErrors,
];

const updateProfileRules = [
  body('name').optional().trim().notEmpty().withMessage('Nombre no puede estar vacío'),
  body('email').optional().isEmail().withMessage('Email no válido').normalizeEmail(),
  handleErrors,
];

const createJobRules = [
  body('title').trim().notEmpty().withMessage('Título es requerido'),
  body('company').trim().notEmpty().withMessage('Empresa es requerida'),
  body('description').trim().notEmpty().withMessage('Descripción es requerida'),
  body('location').optional().trim(),
  body('salary').optional().trim(),
  body('requirements').optional().trim(),
  body('mode').optional().isIn(['REMOTE', 'ONSITE', 'HYBRID']).withMessage('Modo no válido'),
  body('category').optional().trim(),
  handleErrors,
];

const updateJobRules = [
  body('title').optional().trim().notEmpty().withMessage('Título no puede estar vacío'),
  body('company').optional().trim().notEmpty().withMessage('Empresa no puede estar vacía'),
  body('description').optional().trim().notEmpty().withMessage('Descripción no puede estar vacía'),
  body('location').optional().trim(),
  body('salary').optional().trim(),
  body('requirements').optional().trim(),
  body('mode').optional().isIn(['REMOTE', 'ONSITE', 'HYBRID']).withMessage('Modo no válido'),
  body('category').optional().trim(),
  handleErrors,
];

const createCourseRules = [
  body('title').trim().notEmpty().withMessage('Título es requerido'),
  body('provider').trim().notEmpty().withMessage('Proveedor es requerido'),
  body('description').trim().notEmpty().withMessage('Descripción es requerida'),
  body('category').optional().trim(),
  body('level').optional().isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).withMessage('Nivel no válido'),
  body('duration').optional().trim(),
  body('price').optional().trim(),
  body('url').optional().isURL().withMessage('URL no válida'),
  body('image').optional().isURL().withMessage('URL de imagen no válida'),
  handleErrors,
];

const updateCourseRules = [
  body('title').optional().trim().notEmpty().withMessage('Título no puede estar vacío'),
  body('provider').optional().trim().notEmpty().withMessage('Proveedor no puede estar vacío'),
  body('description').optional().trim().notEmpty().withMessage('Descripción no puede estar vacía'),
  body('category').optional().trim(),
  body('level').optional().isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).withMessage('Nivel no válido'),
  body('duration').optional().trim(),
  body('price').optional().trim(),
  body('url').optional().isURL().withMessage('URL no válida'),
  body('image').optional().isURL().withMessage('URL de imagen no válida'),
  handleErrors,
];

module.exports = {
  registerRules,
  loginRules,
  updateProfileRules,
  createJobRules,
  updateJobRules,
  createCourseRules,
  updateCourseRules,
};

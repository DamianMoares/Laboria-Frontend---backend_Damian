// Middleware genérico para validar campos requeridos
const validateRequest = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      const error = new Error(`Campos requeridos: ${missingFields.join(', ')}`);
      error.statusCode = 400;
      return next(error);
    }
    
    next();
  };
};

// Validación específica para registro
const validateRegister = validateRequest(['email', 'password', 'name']);

// Validación específica para login
const validateLogin = validateRequest(['email', 'password']);

module.exports = {
  validateRequest,
  validateRegister,
  validateLogin
};

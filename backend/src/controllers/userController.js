const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { generateToken } = require('../utils/jwt');
const emailService = require('../services/emailService');

// REGISTRO
const register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    
    // Validar campos requeridos
    if (!email || !password || !name) {
      const error = new Error('Email, password y name son requeridos');
      error.statusCode = 400;
      throw error;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error('Email no válido');
      error.statusCode = 400;
      throw error;
    }
    
    // Validar longitud de password
    if (password.length < 6) {
      const error = new Error('Password debe tener al menos 6 caracteres');
      error.statusCode = 400;
      throw error;
    }
    
    // Verificar si email ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const error = new Error('Email ya registrado');
      error.statusCode = 409;
      throw error;
    }
    
    // Encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role ? role.toUpperCase() : 'CANDIDATE'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    
    // Enviar email de bienvenida (no bloqueante)
    emailService.sendWelcome(user.email, user.name).catch(console.error);
    
    res.status(201).json({ 
      message: 'Usuario creado exitosamente',
      user 
    });
    
  } catch (error) {
    next(error);
  }
};

// LOGIN (básico, sin JWT todavía)
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      const error = new Error('Email y password son requeridos');
      error.statusCode = 400;
      throw error;
    }
    
    // Buscar usuario
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }
    
    // Verificar password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }
    
    // Retornar usuario (sin password) + JWT token
    const { password: _, ...userWithoutPassword } = user;
    const token = generateToken(user.id);
    
    res.json({
      message: 'Login exitoso',
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    next(error);
  }
};

// OBTENER PERFIL
const getProfile = async (req, res, next) => {
  try {
    // Por ahora recibimos el ID por params, después será por JWT
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    res.json(user);
    
  } catch (error) {
    next(error);
  }
};

// ACTUALIZAR PERFIL
const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    const user = await prisma.user.update({
      where: { id },
      data: { name, email },
      select: { id: true, email: true, name: true, role: true, updatedAt: true }
    });
    
    res.json({
      message: 'Perfil actualizado',
      user
    });
    
  } catch (error) {
    next(error);
  }
};

// ELIMINAR CUENTA
const deleteAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await prisma.user.delete({ where: { id } });
    
    res.json({ message: 'Cuenta eliminada exitosamente' });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount
};
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../config/database');
const { generateToken } = require('../utils/jwt');
const emailService = require('../services/emailService');

// REGISTRO
const register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    
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

// LOGIN
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
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
    
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    if (email !== undefined && email !== existing.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) {
        const error = new Error('Email ya registrado');
        error.statusCode = 409;
        throw error;
      }
    }

    const data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    
    const user = await prisma.user.update({
      where: { id },
      data,
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
    
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    await prisma.user.delete({ where: { id } });
    
    res.json({ message: 'Cuenta eliminada exitosamente' });
    
  } catch (error) {
    next(error);
  }
};

// SOLICITAR RESTABLECIMIENTO DE CONTRASEÑA
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora

    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: token, resetPasswordExpires: expires }
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    emailService.sendPasswordReset(user.email, user.name, resetUrl).catch(console.error);

    res.json({ message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña.' });
  } catch (error) {
    next(error);
  }
};

// RESTABLECER CONTRASEÑA
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gte: new Date() }
      }
    });

    if (!user) {
      const error = new Error('Token inválido o expirado');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    res.json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    next(error);
  }
};

// CAMBIAR CONTRASEÑA (autenticado)
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      const error = new Error('Contraseña actual incorrecta');
      error.statusCode = 401;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    next(error);
  }
};

// OBTENER CURRICULUM
const getCurriculum = async (req, res, next) => {
  try {
    const curriculum = await prisma.curriculum.findUnique({
      where: { userId: req.user.id }
    });
    res.json({ curriculum: curriculum?.data || null });
  } catch (error) {
    next(error);
  }
};

// GUARDAR CURRICULUM
const saveCurriculum = async (req, res, next) => {
  try {
    const { data } = req.body;

    const curriculum = await prisma.curriculum.upsert({
      where: { userId: req.user.id },
      update: { data },
      create: { userId: req.user.id, data }
    });

    res.json({ message: 'Currículum guardado', curriculum: curriculum.data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
  forgotPassword,
  resetPassword,
  changePassword,
  getCurriculum,
  saveCurriculum
};
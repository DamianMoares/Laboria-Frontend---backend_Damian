const prisma = require('../config/database');
const { logAction } = require('../services/auditService');

/**
 * Obtener estadísticas del dashboard
 * GET /api/admin/dashboard
 */
const getDashboardStats = async (req, res, next) => {
  try {
    // Contar usuarios por rol
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: { id: true }
    });

    // Contar totales
    const totalUsers = await prisma.user.count();
    const totalJobs = await prisma.job.count();
    const totalCourses = await prisma.course.count();
    const totalApplications = await prisma.application.count();

    // Aplicaciones por estado
    const applicationsByStatus = await prisma.application.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    // Empleos por categoría
    const jobsByCategory = await prisma.job.groupBy({
      by: ['category'],
      _count: { id: true }
    });

    // Cursos por nivel
    const coursesByLevel = await prisma.course.groupBy({
      by: ['level'],
      _count: { id: true }
    });

    // Usuarios creados en los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = await prisma.user.count({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      }
    });

    const recentJobs = await prisma.job.count({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      }
    });

    const recentApplications = await prisma.application.count({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      }
    });

    res.json({
      success: true,
      stats: {
        totals: {
          users: totalUsers,
          jobs: totalJobs,
          courses: totalCourses,
          applications: totalApplications
        },
        usersByRole: usersByRole.map(r => ({ role: r.role, count: r._count.id })),
        applicationsByStatus: applicationsByStatus.map(s => ({ status: s.status, count: s._count.id })),
        jobsByCategory: jobsByCategory.map(c => ({ category: c.category, count: c._count.id })),
        coursesByLevel: coursesByLevel.map(l => ({ level: l.level, count: l._count.id })),
        recentActivity: {
          newUsers: recentUsers,
          newJobs: recentJobs,
          newApplications: recentApplications
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Listar todos los usuarios con detalles completos
 * GET /api/admin/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir filtros
    const where = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            jobs: true,
            courses: true,
            applications: true
          }
        }
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.user.count({ where });

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar rol de usuario
 * PUT /api/admin/users/:id/role
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validar rol
    const validRoles = ['CANDIDATE', 'COMPANY_EMPLOYEES', 'COMPANY_STUDENTS', 'COMPANY_HYBRID', 'ADMIN'];
    if (!validRoles.includes(role)) {
      const error = new Error('Rol no válido');
      error.statusCode = 400;
      throw error;
    }

    // No permitir cambiar el rol de uno mismo (para evitar quedarse sin admin)
    if (id === req.user.id) {
      const error = new Error('No puedes cambiar tu propio rol');
      error.statusCode = 403;
      throw error;
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    });

    await logAction({
      action: 'UPDATE_ROLE',
      entity: 'User',
      entityId: id,
      details: `Rol cambiado de ${targetUser.role} a ${role}`,
      adminId: req.user.id,
      adminName: req.user.name
    });

    res.json({
      success: true,
      message: 'Rol actualizado correctamente',
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar usuario como admin
 * DELETE /api/admin/users/:id
 */
const deleteUserAsAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // No permitir eliminarse a sí mismo
    if (id === req.user.id) {
      const error = new Error('No puedes eliminar tu propia cuenta desde el panel de admin');
      error.statusCode = 403;
      throw error;
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    await prisma.user.delete({
      where: { id }
    });

    await logAction({
      action: 'DELETE',
      entity: 'User',
      entityId: id,
      details: `Usuario "${existing.name}" (${existing.email}, rol: ${existing.role}) eliminado`,
      adminId: req.user.id,
      adminName: req.user.name
    });

    res.json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener detalles de un usuario específico
 * GET /api/admin/users/:id
 */
const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        jobs: {
          select: {
            id: true,
            title: true,
            company: true,
            createdAt: true
          }
        },
        courses: {
          select: {
            id: true,
            title: true,
            provider: true,
            createdAt: true
          }
        },
        applications: {
          include: {
            job: {
              select: {
                id: true,
                title: true,
                company: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Listar todos los empleos (admin)
 * GET /api/admin/jobs
 */
const getAllJobs = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ];
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: { applications: true }
        }
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.job.count({ where });

    res.json({
      success: true,
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar cualquier empleo como admin
 * PUT /api/admin/jobs/:id
 */
const updateJobAsAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const allowedFields = ['title', 'company', 'location', 'salary', 'description', 'requirements', 'mode', 'category'];
    const jobData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) jobData[field] = req.body[field];
    }

    const existing = await prisma.job.findUnique({ where: { id }, select: { title: true } });
    if (!existing) {
      const error = new Error('Empleo no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const job = await prisma.job.update({
      where: { id },
      data: jobData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    await logAction({
      action: 'UPDATE',
      entity: 'Job',
      entityId: id,
      details: `Empleo "${existing.title}" actualizado`,
      adminId: req.user.id,
      adminName: req.user.name
    });

    res.json({
      success: true,
      message: 'Empleo actualizado correctamente',
      job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar cualquier empleo como admin
 * DELETE /api/admin/jobs/:id
 */
const deleteJobAsAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.job.findUnique({ where: { id }, select: { title: true } });
    if (!existing) {
      const error = new Error('Empleo no encontrado');
      error.statusCode = 404;
      throw error;
    }

    await prisma.job.delete({
      where: { id }
    });

    await logAction({
      action: 'DELETE',
      entity: 'Job',
      entityId: id,
      details: `Empleo "${existing.title}" eliminado`,
      adminId: req.user.id,
      adminName: req.user.name
    });

    res.json({
      success: true,
      message: 'Empleo eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Listar todos los cursos (admin)
 * GET /api/admin/courses
 */
const getAllCourses = async (req, res, next) => {
  try {
    const { category, level, search, page = 1, limit = 20 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    if (category) where.category = category;
    if (level) where.level = level;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { provider: { contains: search, mode: 'insensitive' } }
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.course.count({ where });

    res.json({
      success: true,
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar cualquier curso como admin
 * PUT /api/admin/courses/:id
 */
const updateCourseAsAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const allowedFields = ['title', 'provider', 'description', 'category', 'level', 'duration', 'price', 'url', 'image'];
    const courseData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) courseData[field] = req.body[field];
    }

    const existing = await prisma.course.findUnique({ where: { id }, select: { title: true } });
    if (!existing) {
      const error = new Error('Curso no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const course = await prisma.course.update({
      where: { id },
      data: courseData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    await logAction({
      action: 'UPDATE',
      entity: 'Course',
      entityId: id,
      details: `Curso "${existing.title}" actualizado`,
      adminId: req.user.id,
      adminName: req.user.name
    });

    res.json({
      success: true,
      message: 'Curso actualizado correctamente',
      course
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar cualquier curso como admin
 * DELETE /api/admin/courses/:id
 */
const deleteCourseAsAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      const error = new Error('Curso no encontrado');
      error.statusCode = 404;
      throw error;
    }

    await prisma.course.delete({
      where: { id }
    });

    await logAction({
      action: 'DELETE',
      entity: 'Course',
      entityId: id,
      details: `Curso "${existing.title}" eliminado`,
      adminId: req.user.id,
      adminName: req.user.name
    });

    res.json({
      success: true,
      message: 'Curso eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Listar todas las aplicaciones (admin)
 * GET /api/admin/applications
 */
const getAllApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    if (status) where.status = status;

    const applications = await prisma.application.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        job: {
          include: {
            author: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.application.count({ where });

    res.json({
      success: true,
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar estado de cualquier aplicación como admin
 * PUT /api/admin/applications/:id/status
 */
const updateApplicationStatusAsAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      const error = new Error('Estado no válido');
      error.statusCode = 400;
      throw error;
    }

    const existing = await prisma.application.findUnique({
      where: { id },
      select: { status: true }
    });
    if (!existing) {
      const error = new Error('Aplicación no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const application = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        job: {
          select: {
            id: true,
            title: true,
            company: true
          }
        }
      }
    });

    await logAction({
      action: 'UPDATE_STATUS',
      entity: 'Application',
      entityId: id,
      details: `Estado cambiado de ${existing.status} a ${status} (empleo: ${application.job.title})`,
      adminId: req.user.id,
      adminName: req.user.name
    });

    res.json({
      success: true,
      message: 'Estado de aplicación actualizado correctamente',
      application
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ejecutar tests del backend (vitest)
 * GET /api/admin/tests/run
 */
const runTests = async (req, res, next) => {
  try {
    const { execSync } = require('child_process');
    const path = require('path');
    const backendDir = path.resolve(__dirname, '../..');

    const vitestPath = path.resolve(backendDir, 'node_modules', '.bin', 'vitest');
    const output = execSync(`"${vitestPath}" run --reporter=json`, {
      cwd: backendDir,
      timeout: 60000,
      encoding: 'utf-8'
    });

    const vitestResult = JSON.parse(output);
    const suites = vitestResult.testResults.map(file => ({
      name: path.basename(file.name, '.test.js'),
      tests: file.assertionResults.map(t => ({
        name: t.title,
        status: t.status
      }))
    }));

    const durationMs = vitestResult.testResults.reduce((sum, f) => {
      return sum + (f.endTime - f.startTime);
    }, 0);
    const duration = (durationMs / 1000).toFixed(1) + 's';

    res.json({
      success: true,
      total: vitestResult.numTotalTests,
      passed: vitestResult.numPassedTests,
      failed: vitestResult.numFailedTests,
      duration,
      suites
    });
  } catch (error) {
    if (error.stdout) {
      try {
        const vitestResult = JSON.parse(error.stdout);
        const path = require('path');
        const suites = vitestResult.testResults.map(file => ({
          name: path.basename(file.name, '.test.js'),
          tests: file.assertionResults.map(t => ({
            name: t.title,
            status: t.status
          }))
        }));
        const durationMs = vitestResult.testResults.reduce((sum, f) => sum + (f.endTime - f.startTime), 0);
        const duration = (durationMs / 1000).toFixed(1) + 's';
        return res.json({
          success: true,
          total: vitestResult.numTotalTests,
          passed: vitestResult.numPassedTests,
          failed: vitestResult.numFailedTests,
          duration,
          suites
        });
      } catch (_) {
        // fall through to error handler
      }
    }
    error.statusCode = 500;
    next(error);
  }
};

/**
 * Listar registros de auditoría
 * GET /api/admin/audit-logs
 */
const getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await prisma.auditLog.findMany({
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.auditLog.count();

    res.json({
      success: true,
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUserAsAdmin,
  getUserDetails,
  getAllJobs,
  updateJobAsAdmin,
  deleteJobAsAdmin,
  getAllCourses,
  updateCourseAsAdmin,
  deleteCourseAsAdmin,
  getAllApplications,
  updateApplicationStatusAsAdmin,
  runTests,
  getAuditLogs
};

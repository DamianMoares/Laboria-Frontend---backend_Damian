const prisma = require('../config/database');
const emailService = require('../services/emailService');

const applicationController = {
  // POST /api/applications - Candidato aplica a empleo
  create: async (req, res, next) => {
    try {
      const { jobId, message } = req.body;
      
      // Verificar que el empleo existe (incluir autor para email)
      const job = await prisma.job.findUnique({ 
        where: { id: jobId },
        include: { author: { select: { email: true, name: true } } }
      });
      if (!job) {
        const error = new Error('Empleo no encontrado');
        error.statusCode = 404;
        throw error;
      }
      
      // Verificar que el usuario sea candidato
      if (req.user.role !== 'CANDIDATE' && req.user.role !== 'ADMIN') {
        const error = new Error('Solo candidatos pueden aplicar a empleos');
        error.statusCode = 403;
        throw error;
      }
      
      // Verificar que no aplicó antes
      const existing = await prisma.application.findUnique({
        where: {
          userId_jobId: {
            userId: req.user.id,
            jobId
          }
        }
      });
      
      if (existing) {
        const error = new Error('Ya aplicaste a este empleo');
        error.statusCode = 409;
        throw error;
      }
      
      const application = await prisma.application.create({
        data: {
          userId: req.user.id,
          jobId,
          message
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          job: { select: { id: true, title: true, company: true } }
        }
      });
      
      // Notificar a la empresa (no bloqueante)
      if (job.author) {
        emailService.sendApplicationReceived(
          job.author.email, 
          job.title, 
          req.user.name
        ).catch(console.error);
      }
      
      res.status(201).json({
        message: 'Aplicación enviada exitosamente',
        application
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/applications/my - Ver mis aplicaciones (candidato)
  myApplications: async (req, res, next) => {
    try {
      const applications = await prisma.application.findMany({
        where: { userId: req.user.id },
        include: {
          job: { select: { id: true, title: true, company: true, location: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      res.json(applications);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/applications/job/:jobId - Ver aplicaciones a un empleo (empresa)
  jobApplications: async (req, res, next) => {
    try {
      const { jobId } = req.params;
      
      // Verificar que el empleo existe
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) {
        const error = new Error('Empleo no encontrado');
        error.statusCode = 404;
        throw error;
      }

      // Verificar que el empleo es del usuario actual
      if (job.authorId !== req.user.id && req.user.role !== 'ADMIN') {
        const error = new Error('No autorizado');
        error.statusCode = 403;
        throw error;
      }
      
      const applications = await prisma.application.findMany({
        where: { jobId },
        include: {
          user: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      res.json(applications);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/applications/:id/status - Actualizar estado (empresa)
  updateStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // PENDING, ACCEPTED, REJECTED

      const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED'];
      if (!validStatuses.includes(status)) {
        const error = new Error('Estado no válido');
        error.statusCode = 400;
        throw error;
      }
      
      const application = await prisma.application.findUnique({
        where: { id },
        include: { job: true }
      });
      
      if (!application) {
        const error = new Error('Aplicación no encontrada');
        error.statusCode = 404;
        throw error;
      }
      
      // Verificar que el empleo es del usuario actual
      if (application.job.authorId !== req.user.id && req.user.role !== 'ADMIN') {
        const error = new Error('No autorizado');
        error.statusCode = 403;
        throw error;
      }
      
      const updated = await prisma.application.update({
        where: { id },
        data: { status },
        include: {
          user: { select: { id: true, name: true, email: true } },
          job: { select: { id: true, title: true, company: true } }
        }
      });
      
      res.json({
        message: `Aplicación ${status.toLowerCase()}`,
        application: updated
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/applications/:id - Cancelar aplicación (candidato)
  cancel: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const application = await prisma.application.findUnique({
        where: { id }
      });
      
      if (!application) {
        const error = new Error('Aplicación no encontrada');
        error.statusCode = 404;
        throw error;
      }
      
      // Solo el candidato puede cancelar su aplicación
      if (application.userId !== req.user.id && req.user.role !== 'ADMIN') {
        const error = new Error('No autorizado');
        error.statusCode = 403;
        throw error;
      }
      
      await prisma.application.delete({ where: { id } });
      res.json({ message: 'Aplicación cancelada' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = applicationController;

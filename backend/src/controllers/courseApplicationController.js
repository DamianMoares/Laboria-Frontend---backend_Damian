const prisma = require('../config/database');

const courseApplicationController = {
  create: async (req, res, next) => {
    try {
      const { courseId, message } = req.body;

      if (req.user.role !== 'CANDIDATE' && req.user.role !== 'ADMIN') {
        const error = new Error('Solo candidatos pueden inscribirse en cursos');
        error.statusCode = 403;
        throw error;
      }

      const existing = await prisma.courseApplication.findUnique({
        where: { userId_courseId: { userId: req.user.id, courseId } }
      });

      if (existing) {
        const error = new Error('Ya te inscribiste en este curso');
        error.statusCode = 409;
        throw error;
      }

      const application = await prisma.courseApplication.create({
        data: {
          userId: req.user.id,
          courseId,
          message
        },
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      });

      res.status(201).json({
        message: 'Inscripción enviada exitosamente',
        application
      });
    } catch (error) {
      next(error);
    }
  },

  myApplications: async (req, res, next) => {
    try {
      const applications = await prisma.courseApplication.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' }
      });

      res.json(applications);
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (req.user.role !== 'ADMIN') {
        const error = new Error('Solo administradores pueden cambiar el estado de inscripciones');
        error.statusCode = 403;
        throw error;
      }

      const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED'];
      if (!validStatuses.includes(status)) {
        const error = new Error('Estado no válido');
        error.statusCode = 400;
        throw error;
      }

      const application = await prisma.courseApplication.findUnique({ where: { id } });
      if (!application) {
        const error = new Error('Inscripción no encontrada');
        error.statusCode = 404;
        throw error;
      }

      const updated = await prisma.courseApplication.update({
        where: { id },
        data: { status },
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      });

      res.json({ message: `Inscripción ${status.toLowerCase()}`, application: updated });
    } catch (error) {
      next(error);
    }
  },

  cancel: async (req, res, next) => {
    try {
      const { id } = req.params;

      const application = await prisma.courseApplication.findUnique({ where: { id } });
      if (!application) {
        const error = new Error('Inscripción no encontrada');
        error.statusCode = 404;
        throw error;
      }

      if (application.userId !== req.user.id && req.user.role !== 'ADMIN') {
        const error = new Error('No autorizado');
        error.statusCode = 403;
        throw error;
      }

      await prisma.courseApplication.delete({ where: { id } });
      res.json({ message: 'Inscripción cancelada' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = courseApplicationController;

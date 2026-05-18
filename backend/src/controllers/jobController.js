const prisma = require('../config/database');

const jobController = {
  // GET /api/jobs - Listar todos (con filtros)
  list: async (req, res, next) => {
    try {
      const { category, location, mode, search } = req.query;
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
      const skip = (page - 1) * limit;
      
      const where = {};
      if (category) where.category = category;
      if (location) where.location = { contains: location, mode: 'insensitive' };
      if (mode) where.mode = mode;
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const [jobs, total] = await Promise.all([
        prisma.job.findMany({
          where,
          skip,
          take: limit,
          include: {
            author: { select: { id: true, name: true } }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.job.count({ where })
      ]);
      
      res.json({ data: jobs, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/jobs/:id - Detalle
  detail: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const job = await prisma.job.findUnique({
        where: { id },
        include: {
          author: { select: { id: true, name: true } }
        }
      });
      
      if (!job) {
        const error = new Error('Empleo no encontrado');
        error.statusCode = 404;
        throw error;
      }
      
      res.json(job);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/jobs - Crear (solo empresas)
  create: async (req, res, next) => {
    try {
      const { title, company, location, salary, description, requirements, mode, category } = req.body;
      
      // Verificar que el usuario sea empresa
      const userRole = req.user.role;
      if (!['COMPANY_EMPLOYEES', 'COMPANY_STUDENTS', 'COMPANY_HYBRID', 'ADMIN'].includes(userRole)) {
        const error = new Error('Solo empresas pueden publicar empleos');
        error.statusCode = 403;
        throw error;
      }
      
      const job = await prisma.job.create({
        data: {
          title,
          company,
          location,
          salary,
          description,
          requirements,
          mode: mode || 'REMOTE',
          category,
          authorId: req.user.id
        },
        include: {
          author: { select: { id: true, name: true } }
        }
      });
      
      res.status(201).json({
        message: 'Empleo publicado exitosamente',
        job
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/jobs/:id - Editar (solo autor)
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const allowedFields = ['title', 'company', 'location', 'salary', 'description', 'requirements', 'mode', 'category'];
      const data = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) data[field] = req.body[field];
      }
      if (Object.keys(data).length === 0) {
        const error = new Error('No hay campos válidos para actualizar');
        error.statusCode = 400;
        throw error;
      }
      
      if (req.user.role === 'ADMIN') {
        const job = await prisma.job.update({
          where: { id },
          data,
          include: { author: { select: { id: true, name: true } } }
        });
        return res.json({ message: 'Empleo actualizado', job });
      }
      
      const existing = await prisma.job.findUnique({
        where: { id },
        select: { authorId: true }
      });
      if (!existing) {
        const error = new Error('Empleo no encontrado');
        error.statusCode = 404;
        throw error;
      }
      if (existing.authorId !== req.user.id) {
        const error = new Error('No autorizado - Solo el autor puede editar');
        error.statusCode = 403;
        throw error;
      }
      
      const job = await prisma.job.update({
        where: { id },
        data,
        include: { author: { select: { id: true, name: true } } }
      });
      
      res.json({ message: 'Empleo actualizado', job });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/jobs/:id - Eliminar (solo autor o admin)
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      if (req.user.role === 'ADMIN') {
        await prisma.job.delete({ where: { id } });
        return res.json({ message: 'Empleo eliminado' });
      }
      
      const existing = await prisma.job.findUnique({
        where: { id },
        select: { authorId: true }
      });
      if (!existing) {
        const error = new Error('Empleo no encontrado');
        error.statusCode = 404;
        throw error;
      }
      if (existing.authorId !== req.user.id) {
        const error = new Error('No autorizado');
        error.statusCode = 403;
        throw error;
      }
      
      await prisma.job.delete({ where: { id } });
      res.json({ message: 'Empleo eliminado' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = jobController;

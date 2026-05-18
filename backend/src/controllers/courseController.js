const prisma = require('../config/database');

const courseController = {
  // GET /api/courses - Listar todos (con filtros)
  list: async (req, res, next) => {
    try {
      const { category, level, search } = req.query;
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
      const skip = (page - 1) * limit;
      
      const where = {};
      if (category) where.category = category;
      if (level) where.level = level;
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { provider: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const [courses, total] = await Promise.all([
        prisma.course.findMany({
          where,
          skip,
          take: limit,
          include: {
            author: { select: { id: true, name: true } }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.course.count({ where })
      ]);
      
      res.json({ data: courses, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/courses/:id - Detalle
  detail: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const course = await prisma.course.findUnique({
        where: { id },
        include: {
          author: { select: { id: true, name: true } }
        }
      });
      
      if (!course) {
        const error = new Error('Curso no encontrado');
        error.statusCode = 404;
        throw error;
      }
      
      res.json(course);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/courses - Crear (solo empresas)
  create: async (req, res, next) => {
    try {
      const { title, provider, description, category, level, duration, price, url, image } = req.body;
      
      // Verificar que el usuario sea empresa
      const userRole = req.user.role;
      if (!['COMPANY_EMPLOYEES', 'COMPANY_STUDENTS', 'COMPANY_HYBRID', 'ADMIN'].includes(userRole)) {
        const error = new Error('Solo empresas pueden publicar cursos');
        error.statusCode = 403;
        throw error;
      }
      
      const course = await prisma.course.create({
        data: {
          title,
          provider,
          description,
          category,
          level: level || 'BEGINNER',
          duration,
          price,
          url,
          image,
          authorId: req.user.id
        },
        include: {
          author: { select: { id: true, name: true } }
        }
      });
      
      res.status(201).json({
        message: 'Curso publicado exitosamente',
        course
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/courses/:id - Editar (solo autor)
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const allowedFields = ['title', 'provider', 'description', 'category', 'level', 'duration', 'price', 'url', 'image'];
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
        const course = await prisma.course.update({
          where: { id },
          data,
          include: { author: { select: { id: true, name: true } } }
        });
        return res.json({ message: 'Curso actualizado', course });
      }
      
      const existing = await prisma.course.findUnique({
        where: { id },
        select: { authorId: true }
      });
      if (!existing) {
        const error = new Error('Curso no encontrado');
        error.statusCode = 404;
        throw error;
      }
      if (existing.authorId !== req.user.id) {
        const error = new Error('No autorizado - Solo el autor puede editar');
        error.statusCode = 403;
        throw error;
      }
      
      const course = await prisma.course.update({
        where: { id },
        data,
        include: { author: { select: { id: true, name: true } } }
      });
      
      res.json({ message: 'Curso actualizado', course });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/courses/:id - Eliminar (solo autor o admin)
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      if (req.user.role === 'ADMIN') {
        await prisma.course.delete({ where: { id } });
        return res.json({ message: 'Curso eliminado' });
      }
      
      const existing = await prisma.course.findUnique({
        where: { id },
        select: { authorId: true }
      });
      if (!existing) {
        const error = new Error('Curso no encontrado');
        error.statusCode = 404;
        throw error;
      }
      if (existing.authorId !== req.user.id) {
        const error = new Error('No autorizado');
        error.statusCode = 403;
        throw error;
      }
      
      await prisma.course.delete({ where: { id } });
      res.json({ message: 'Curso eliminado' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = courseController;

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno (busca .env donde está server.js)
dotenv.config({ path: path.join(__dirname, '.env') });

// Importar middleware
const errorHandler = require('./src/middleware/errorHandler');
const { writeLimiter } = require('./src/middleware/rateLimiter');
const prisma = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Seguridad HTTP
app.use(helmet());

// Middleware CORS
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:4173'];
const corsPatterns = corsOrigins.map(o => {
  if (o.startsWith('*.')) return new RegExp('^https?://[a-zA-Z0-9.-]+' + o.slice(1).replace('.', '\\.') + '$');
  return o;
});
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const match = corsPatterns.some(p => typeof p === 'string' ? p === origin : p.test(origin));
    callback(null, match);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
app.use(express.json()); // Parsear JSON

// Rate limiting global para escrituras (POST, PUT, DELETE)
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    return writeLimiter(req, res, next);
  }
  next();
});

// Rutas API
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/jobs', require('./src/routes/jobRoutes'));
app.use('/api/courses', require('./src/routes/courseRoutes'));
app.use('/api/applications', require('./src/routes/applicationRoutes'));
app.use('/api/course-applications', require('./src/routes/courseApplicationRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes')); // Rutas de administración

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '¡Backend de Laboria funcionando!' });
});

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Manejo de errores (siempre al final)
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`🛑 ${signal} recibido - cerrando servidor...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
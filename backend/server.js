const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno (busca .env donde está server.js)
dotenv.config({ path: path.join(__dirname, '.env') });

// Importar middleware
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:4173'];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
app.use(express.json()); // Parsear JSON

// Rutas API
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/jobs', require('./src/routes/jobRoutes'));
app.use('/api/courses', require('./src/routes/courseRoutes'));
app.use('/api/applications', require('./src/routes/applicationRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes')); // Rutas de administración

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '¡Backend de Laboria funcionando!' });
});

// Manejo de errores (siempre al final)
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido - cerrando servidor...');
  server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
  console.log('🛑 SIGINT recibido - cerrando servidor...');
  server.close(() => process.exit(0));
});
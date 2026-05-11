const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Importar middleware
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(cors()); // Permitir requests del frontend
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

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
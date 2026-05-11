const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Importar middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware básico
app.use(cors()); // Permitir requests del frontend
app.use(express.json()); // Parsear JSON

// Rutas
app.use('/api/users', require('./routes/userRoutes'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '¡Backend de Laboria funcionando!' });
});

// Manejo de errores (siempre al final)
app.use(errorHandler);

module.exports = app;

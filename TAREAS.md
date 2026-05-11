# 🚀 Guía de Trabajo - Laboria Midterm

> **Proyecto:** Portal de empleo y cursos Laboria  
> **Duración:** 8 de mayo → 19 de mayo de 2026  
> **Dedicación:** 5 horas/día (días laborales)  
> **Días de descanso:** 9/05, 10/05, 16/05, 17/05

---

## 🗓️ Tu Calendario Visual

```
MAYO 2026

Dom  Lun  Mar  Mié  Jue  Vie  Sáb
          1    2    3    4    5
 6    7   [8]  💤  💤  [11] [12]
[13] [14] [15] 💤  💤  [18] [19]

[XX] = Día de trabajo (5h)
💤   = Descanso
```

---

## 📦 FASE 1: Poniendo las Bases (Jueves 8/05)

> **Meta de hoy:** Tener el backend listo para empezar a codear. No programamos lógica todavía, solo preparamos el terreno.

---

### ✅ Tarea 1.1: Crear la estructura de carpetas
**Tiempo:** 30 minutos  
**Estado:** ⬜ Pendiente

**¿Qué vas a hacer?**
Imagina que tu proyecto actual es solo el frontend. Ahora necesitas "hermano" que sea el backend. Vas a crear una carpeta `backend/` al lado de tu `src/` actual.

**Pasos concretos:**
1. En tu explorador de archivos, ve a la raíz del proyecto
2. Crea una carpeta nueva llamada `backend/`
3. Opcional: Mueve tu código actual a una carpeta `frontend/` para tener todo ordenado tipo monorepo
4. Tu estructura debería verse así:
   ```
   Laboria-Frontend---backend_Damian/
   ├── frontend/          ← tu código actual
   └── backend/           ← lo que vas a crear
   ```

**¿Cómo sabes que terminaste?**
Tienes dos carpetas claras separadas.

---

### ✅ Tarea 1.2: Darle vida al backend
**Tiempo:** 1 hora 30 minutos  
**Estado:** ⬜ Pendiente

**¿Qué vas a hacer?**
Inicializar un proyecto Node.js desde cero e instalar todas las librerías que necesitarás.

**Pasos concretos:**
1. Abre terminal en la carpeta `backend/`
2. Ejecuta: `npm init -y` (crea tu package.json)
3. Instala estas dependencias:
   ```bash
   npm install express cors dotenv bcryptjs jsonwebtoken
   ```
   - `express` → el framework para crear la API
   - `cors` → para que el frontend pueda hablar con el backend
   - `dotenv` → para manejar variables de entorno (.env)
   - `bcryptjs` → para encriptar contraseñas
   - `jsonwebtoken` → para crear tokens de sesión

4. Instala dependencias de desarrollo:
   ```bash
   npm install --save-dev prisma @prisma/client nodemon
   ```
   - `prisma` → tu ORM para la base de datos
   - `nodemon` → para que el servidor se reinicie automático

5. Crea tu primer archivo `server.js`:
   ```javascript
   const express = require('express');
   const app = express();
   const PORT = 3000;

   app.get('/', (req, res) => {
     res.json({ message: '¡Backend de Laboria funcionando!' });
   });

   app.listen(PORT, () => {
     console.log(`Servidor corriendo en http://localhost:${PORT}`);
   });
   ```

6. Prueba: `node server.js` y visita `http://localhost:3000`

**¿Cómo sabes que terminaste?**
- Ves el mensaje "¡Backend de Laboria funcionando!" en el navegador
- Tu `package.json` tiene todas las dependencias listadas

---

### ✅ Tarea 1.3: Conectar PostgreSQL (Base de Datos)
**Tiempo:** 1 hora 30 minutos  
**Estado:** ⬜ Pendiente

**¿Qué vas a hacer?**
Crear tu base de datos en la nube (Railway o Render) y conectarla con Prisma.

**Pasos concretos:**
1. Ve a [railway.app](https://railway.app) o [render.com](https://render.com)
2. Crea una cuenta (gratis) y un nuevo proyecto
3. Agrega un "New" → "Database" → "PostgreSQL"
4. Espera a que se cree y copia la "Database URL" (algo como `postgresql://user:pass@host:5432/dbname`)
5. En tu carpeta `backend/`, crea un archivo `.env`:
   ```
   DATABASE_URL="postgresql://...tu_url_aqui..."
   PORT=3000
   ```
6. Inicializa Prisma:
   ```bash
   npx prisma init
   ```
7. Revisa que se creó:
   - `prisma/schema.prisma` (aquí defines tus tablas)
   - `.env` (ya lo tenías)

**¿Cómo sabes que terminaste?**
- Ejecuta `npx prisma studio` → debería abrir una interfaz web vacía pero funcionando
- No hay errores de conexión

---

### ✅ Tarea 1.4: Diseñar las tablas de tu base de datos
**Tiempo:** 1 hora 30 minutos  
**Estado:** ⬜ Pendiente

**¿Qué vas a hacer?**
Definir la estructura de tu base de datos: 4 tablas relacionadas mínimo.

**Archivo a editar:** `prisma/schema.prisma`

**Código completo a escribir:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaciones
  jobs         Job[]         // Un usuario puede crear muchos empleos
  courses      Course[]      // Un usuario puede crear muchos cursos
  applications Application[] // Un usuario puede aplicar a muchos empleos
}

model Job {
  id          String   @id @default(uuid())
  title       String
  company     String
  location    String
  salary      String?
  description String
  requirements String?
  mode        WorkMode @default(REMOTE)
  category    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relación con User (quién lo publicó)
  authorId String
  author   User   @relation(fields: [authorId], references: [id])

  // Relaciones
  applications Application[] // Un empleo puede tener muchas aplicaciones
}

model Course {
  id          String   @id @default(uuid())
  title       String
  provider    String
  description String
  category    String
  level       Level    @default(BEGINNER)
  duration    String?
  price       String?
  url         String?
  image       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relación con User (quién lo publicó)
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
}

model Application {
  id        String          @id @default(uuid())
  status    ApplicationStatus @default(PENDING)
  message   String?
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt

  // Relaciones
  userId String
  user   User   @relation(fields: [userId], references: [id])
  
  jobId String
  job   Job    @relation(fields: [jobId], references: [id])

  @@unique([userId, jobId]) // Un usuario solo puede aplicar una vez a un empleo
}

// Enums (tipos especiales)
enum Role {
  USER
  ADMIN
}

enum WorkMode {
  REMOTE
  HYBRID
  ONSITE
}

enum Level {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum ApplicationStatus {
  PENDING
  ACCEPTED
  REJECTED
}
```

**Crear la primera migración:**
```bash
npx prisma migrate dev --name init
```

**¿Cómo sabes que terminaste?**
- Prisma Studio muestra tus 4 tablas creadas
- No hay errores en la consola
- Puedes ver las tablas en Railway si quieres

---

## 🔧 FASE 2: El Cerebro del Backend (Dom 11/05 + Lun 12/05)

> **Meta:** Tener una API REST funcional con manejo de errores y validaciones.

---

### ✅ Tarea 2.1: Organizar el código del backend
**Tiempo:** 1 hora  
**Estado:** ⬜ Pendiente  
**Fecha:** Domingo 11/05

**¿Qué vas a hacer?**
Crear una estructura profesional de carpetas para que tu código sea mantenible.

**Crea estas carpetas dentro de `backend/src/`:**
```
backend/src/
├── config/
│   └── database.js      ← Conexión a Prisma
├── middleware/
│   ├── errorHandler.js  ← Manejo de errores
│   ├── validateRequest.js ← Validaciones
│   └── authMiddleware.js ← Protección JWT
├── controllers/
│   └── userController.js ← Lógica de usuarios
├── routes/
│   └── userRoutes.js    ← Definición de rutas
├── utils/
│   └── ... helpers
└── app.js               ← Configuración de Express
```

**Archivos iniciales a crear:**

**`src/config/database.js`:**
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;
```

**`src/middleware/errorHandler.js`:**
```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
```

**Refactoriza `server.js`:**
```javascript
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

// Rutas (las agregaremos después)
// app.use('/api/users', require('./src/routes/userRoutes'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '¡Backend de Laboria funcionando!' });
});

// Manejo de errores (siempre al final)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
```

**¿Cómo sabes que terminaste?**
- El servidor sigue funcionando sin errores
- Tu código está organizado en carpetas

---

### ✅ Tarea 2.2: Crear el CRUD de Usuarios
**Tiempo:** 2 horas 30 minutos  
**Estado:** ⬜ Pendiente  
**Fecha:** Domingo 11/05 (continúa Lunes 12/05 si es necesario)

**¿Qué vas a hacer?**
Implementar registro, login y gestión de usuarios con validaciones.

**1. Crea `src/controllers/userController.js`:**
```javascript
const bcrypt = require('bcryptjs');
const prisma = require('../config/database');

// REGISTRO
const register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    
    // Validar campos requeridos
    if (!email || !password || !name) {
      const error = new Error('Email, password y name son requeridos');
      error.statusCode = 400;
      throw error;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error('Email no válido');
      error.statusCode = 400;
      throw error;
    }
    
    // Validar longitud de password
    if (password.length < 6) {
      const error = new Error('Password debe tener al menos 6 caracteres');
      error.statusCode = 400;
      throw error;
    }
    
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
        role: role || 'USER'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    
    res.status(201).json({ 
      message: 'Usuario creado exitosamente',
      user 
    });
    
  } catch (error) {
    next(error);
  }
};

// LOGIN (básico, sin JWT todavía)
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      const error = new Error('Email y password son requeridos');
      error.statusCode = 400;
      throw error;
    }
    
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
    
    // Retornar usuario (sin password) - agregaremos JWT después
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login exitoso',
      user: userWithoutPassword
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
    
    const user = await prisma.user.update({
      where: { id },
      data: { name, email },
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
    
    await prisma.user.delete({ where: { id } });
    
    res.json({ message: 'Cuenta eliminada exitosamente' });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount
};
```

**2. Crea `src/routes/userRoutes.js`:**
```javascript
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/users/register
router.post('/register', userController.register);

// POST /api/users/login
router.post('/login', userController.login);

// GET /api/users/:id
router.get('/:id', userController.getProfile);

// PUT /api/users/:id
router.put('/:id', userController.updateProfile);

// DELETE /api/users/:id
router.delete('/:id', userController.deleteAccount);

module.exports = router;
```

**3. Conecta las rutas en `server.js`:**
```javascript
// Reemplaza el comentario de rutas con:
app.use('/api/users', require('./src/routes/userRoutes'));
```

**Prueba en Postman o con curl:**
```bash
# Registro
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@laboria.com","password":"123456","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@laboria.com","password":"123456"}'
```

**¿Cómo sabes que terminaste?**
- Puedes crear un usuario desde Postman
- Puedes loguearte y recibir datos del usuario
- Los errores devuelven códigos HTTP correctos (400, 401, 409, etc.)

---

## 🔐 FASE 3: Seguridad con JWT (Martes 13/05)

> **Meta:** Que solo usuarios autenticados puedan acceder a ciertas rutas.

---

### ✅ Tarea 3.1: Implementar JWT
**Tiempo:** 2 horas  
**Estado:** ⬜ Pendiente  
**Fecha:** Martes 13/05

**¿Qué vas a hacer?**
Agregar tokens JWT para mantener sesiones de usuario.

**1. Agrega a `.env`:**
```
JWT_SECRET="tu_clave_secreta_super_segura_aqui_12345"
JWT_EXPIRES_IN="7d"
```

**2. Crea `src/utils/jwt.js`:**
```javascript
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
```

**3. Actualiza `login` en `userController.js`:**
```javascript
const { generateToken } = require('../utils/jwt');

// ... en la función login, reemplaza el res.json con:
const token = generateToken(user.id);

res.json({
  message: 'Login exitoso',
  user: userWithoutPassword,
  token  // ← El frontend guardará esto
});
```

**4. Completa `src/middleware/authMiddleware.js`:**
```javascript
const { verifyToken } = require('../utils/jwt');
const prisma = require('../config/database');

const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('No autorizado - Token no proporcionado');
      error.statusCode = 401;
      throw error;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = verifyToken(token);
    if (!decoded) {
      const error = new Error('No autorizado - Token inválido');
      error.statusCode = 401;
      throw error;
    }
    
    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true }
    });
    
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    // Agregar usuario al request para usarlo en controllers
    req.user = user;
    next();
    
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
```

**5. Protege rutas en `userRoutes.js`:**
```javascript
const authMiddleware = require('../middleware/authMiddleware');

// Rutas protegidas (requieren token)
router.get('/profile/me', authMiddleware, (req, res) => {
  // req.user viene del middleware
  res.json(req.user);
});

router.put('/profile/me', authMiddleware, userController.updateProfile);
router.delete('/account', authMiddleware, userController.deleteAccount);
```

**Prueba:**
1. Login → recibes token
2. Llamar a `/api/users/profile/me` con header: `Authorization: Bearer tu_token_aqui`
3. Debería devolver tus datos

---

### ✅ Tarea 3.2: Roles de Usuario
**Tiempo:** 1 hora 30 minutos  
**Estado:** ⬜ Pendiente

**¿Qué vas a hacer?**
Separar entre usuarios normales y admins.

**1. Crea `src/middleware/adminMiddleware.js`:**
```javascript
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    const error = new Error('Acceso denegado - Requiere rol ADMIN');
    error.statusCode = 403;
    throw error;
  }
  next();
};

module.exports = adminMiddleware;
```

**2. Crea un seed de admin (script rápido):**
Crea `prisma/seed.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@laboria.com' },
    update: {},
    create: {
      email: 'admin@laboria.com',
      password: hashedPassword,
      name: 'Admin Laboria',
      role: 'ADMIN'
    }
  });
  
  console.log('✅ Seed completado - Admin creado');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Ejecutar:** `node prisma/seed.js`

**3. Crea ruta solo para admins:**
```javascript
// En userRoutes.js
const adminMiddleware = require('../middleware/adminMiddleware');

// GET /api/users (solo admins)
router.get('/', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});
```

---

### ✅ Tarea 3.3: Conectar el frontend
**Tiempo:** 1 hora 30 minutos  
**Estado:** ⬜ Pendiente

**¿Qué vas a hacer?**
Hacer que tu React use el backend real en lugar de JSON estático.

**1. Instala axios en frontend:**
```bash
cd frontend
npm install axios
```

**2. Crea `frontend/src/config/api.js`:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default API_URL;
```

**3. Crea `frontend/src/services/api.js`:**
```javascript
import axios from 'axios';
import API_URL from '../config/api';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**4. Modifica `frontend/.env`:**
```
VITE_API_URL=http://localhost:3000
```

**5. Actualiza `AuthContext.jsx`:**
```javascript
import api from '../services/api';

// ... en el login:
const login = async (email, password) => {
  try {
    const { data } = await api.post('/users/login', { email, password });
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Error en el login' 
    };
  }
};

// ... en el register:
const register = async (userData) => {
  try {
    const { data } = await api.post('/users/register', userData);
    
    // Auto-login después de registro
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Error en el registro' 
    };
  }
};
```

---

## 📚 FASE 4: Recursos API (Miércoles 14/05)

> **Meta:** CRUD completo de Jobs, Courses y Applications.

---

### ✅ Tarea 4.1: CRUD de Empleos (Jobs)
**Tiempo:** 2 horas  
**Estado:** ⬜ Pendiente  
**Fecha:** Miércoles 14/05

**Crea `src/controllers/jobController.js`:**
```javascript
const prisma = require('../config/database');

const jobController = {
  // GET /api/jobs - Listar todos (con filtros)
  list: async (req, res, next) => {
    try {
      const { category, location, mode, search } = req.query;
      
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
      
      const jobs = await prisma.job.findMany({
        where,
        include: {
          author: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      res.json(jobs);
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
      
      // Validaciones
      if (!title || !company || !description) {
        const error = new Error('Título, empresa y descripción son requeridos');
        error.statusCode = 400;
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
          authorId: req.user.id  // Del JWT
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
      
      // Verificar que existe
      const existing = await prisma.job.findUnique({ where: { id } });
      if (!existing) {
        const error = new Error('Empleo no encontrado');
        error.statusCode = 404;
        throw error;
      }
      
      // Verificar que sea el autor o admin
      if (existing.authorId !== req.user.id && req.user.role !== 'ADMIN') {
        const error = new Error('No autorizado - Solo el autor puede editar');
        error.statusCode = 403;
        throw error;
      }
      
      const job = await prisma.job.update({
        where: { id },
        data: req.body,
        include: {
          author: { select: { id: true, name: true } }
        }
      });
      
      res.json({
        message: 'Empleo actualizado',
        job
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/jobs/:id - Eliminar (solo autor o admin)
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const existing = await prisma.job.findUnique({ where: { id } });
      if (!existing) {
        const error = new Error('Empleo no encontrado');
        error.statusCode = 404;
        throw error;
      }
      
      if (existing.authorId !== req.user.id && req.user.role !== 'ADMIN') {
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
```

**Crea `src/routes/jobRoutes.js`:**
```javascript
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

// Públicas
router.get('/', jobController.list);
router.get('/:id', jobController.detail);

// Protegidas
router.post('/', authMiddleware, jobController.create);
router.put('/:id', authMiddleware, jobController.update);
router.delete('/:id', authMiddleware, jobController.delete);

module.exports = router;
```

**Agrega a `server.js`:**
```javascript
app.use('/api/jobs', require('./src/routes/jobRoutes'));
```

---

### ✅ Tarea 4.2: CRUD de Cursos
**Tiempo:** 1 hora 30 minutos  
**Estado:** ⬜ Pendiente

**Crea `src/controllers/courseController.js`** (similar a jobController pero para cursos):
- `list` - GET /api/courses (con filtros por category, level)
- `detail` - GET /api/courses/:id
- `create` - POST /api/courses (auth required)
- `update` - PUT /api/courses/:id (autor o admin)
- `delete` - DELETE /api/courses/:id (autor o admin)

**Campos a manejar:** title, provider, description, category, level, duration, price, url, image

**Rutas:** `src/routes/courseRoutes.js` (similar a jobRoutes)

---

### ✅ Tarea 4.3: CRUD de Aplicaciones
**Tiempo:** 1 hora 30 minutos  
**Estado:** ⬜ Pendiente

**Crea `src/controllers/applicationController.js`:**
```javascript
const prisma = require('../config/database');

const applicationController = {
  // POST /api/applications - Candidato aplica a empleo
  create: async (req, res, next) => {
    try {
      const { jobId, message } = req.body;
      
      // Verificar que el empleo existe
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) {
        const error = new Error('Empleo no encontrado');
        error.statusCode = 404;
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
      
      // Verificar que el empleo es del usuario actual
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job || (job.authorId !== req.user.id && req.user.role !== 'ADMIN')) {
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
      
      const application = await prisma.application.findUnique({
        where: { id },
        include: { job: true }
      });
      
      if (!application) {
        const error = new Error('Aplicación no encontrada');
        error.statusCode = 404;
        throw error;
      }
      
      // Verificar que el empleo es del usuario
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
          job: { select: { id: true, title: true } }
        }
      });
      
      res.json({
        message: `Aplicación ${status.toLowerCase()}`,
        application: updated
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = applicationController;
```

---

## 🔌 FASE 5: Integraciones (Jueves 15/05)

> **Meta:** Conectar todo y agregar integración externa.

---

### ✅ Tarea 5.1: Servicio de Email
**Tiempo:** 2 horas  
**Estado:** ⬜ Pendiente  
**Fecha:** Jueves 15/05

**Opción A: Resend.com (recomendado, 3000 emails/mes gratis)**
**Opción B: EmailJS (solo frontend)**

**Con Resend:**
1. Crear cuenta en [resend.com](https://resend.com)
2. Verificar dominio o usar `onboarding@resend.dev` para pruebas
3. Copiar API key

**Instala:** `npm install resend`

**Crea `src/services/emailService.js`:**
```javascript
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const emailService = {
  // Enviar email de bienvenida
  sendWelcome: async (to, name) => {
    try {
      await resend.emails.send({
        from: 'Laboria <onboarding@resend.dev>',
        to,
        subject: '¡Bienvenido a Laboria!',
        html: `
          <h1>¡Hola ${name}!</h1>
          <p>Gracias por registrarte en Laboria. Tu plataforma de empleo y cursos.</p>
          <p>Empieza a explorar oportunidades hoy mismo.</p>
        `
      });
    } catch (error) {
      console.error('Error enviando email:', error);
    }
  },

  // Notificar cuando aplican a empleo
  sendApplicationReceived: async (to, jobTitle, applicantName) => {
    try {
      await resend.emails.send({
        from: 'Laboria <notifications@resend.dev>',
        to,
        subject: `Nueva aplicación para: ${jobTitle}`,
        html: `
          <h1>Nueva Aplicación</h1>
          <p><strong>${applicantName}</strong> ha aplicado a tu oferta: <strong>${jobTitle}</strong></p>
          <p>Revisa tu panel de control para más detalles.</p>
        `
      });
    } catch (error) {
      console.error('Error enviando notificación:', error);
    }
  }
};

module.exports = emailService;
```

**Agrega a `.env`:**
```
RESEND_API_KEY=re_tu_api_key_aqui
```

**Usa en controllers:**
```javascript
const emailService = require('../services/emailService');

// En register, después de crear usuario:
await emailService.sendWelcome(user.email, user.name);

// En applicationController.create, después de crear aplicación:
await emailService.sendApplicationReceived(job.author.email, job.title, req.user.name);
```

---

### ✅ Tarea 5.2: Conectar páginas frontend con API
**Tiempo:** 2 horas  
**Estado:** ⬜ Pendiente

**Actualiza `JobSearchPage.jsx`:**
```javascript
import { useState, useEffect } from 'react';
import api from '../../services/api';

function JobSearchPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/jobs');
        setJobs(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error cargando empleos');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (jobs.length === 0) return <div>No hay empleos disponibles</div>;

  return (
    // Tu JSX actual pero usando el array `jobs`
  );
}
```

**Haz lo mismo para:**
- `CourseSearchPage.jsx`
- `DashboardPage.jsx`
- `MyApplicationsPage.jsx`

---

### ✅ Tarea 5.3: Limpieza de código mock
**Tiempo:** 1 hora  
**Estado:** ⬜ Pendiente

- Borra o renombra `src/data/users.json`
- Borra `src/data/courses.json` si ya no se usa
- Elimina imports de JSON estático
- Verifica que todo funciona con API real

---

## 🎨 FASE 6: Frontend Polish (Domingo 18/05)

> **Meta:** CSS Modules y validaciones visuales.

---

### ✅ Tarea 6.1: Migrar a CSS Modules
**Tiempo:** 3 horas  
**Estado:** ⬜ Pendiente  
**Fecha:** Domingo 18/05

**Ejemplo de migración:**

**Antes (App.css global):**
```css
.navbar { ... }
.navbar-logo { ... }
```

**Después (App.module.css):**
```css
.navbar { ... }
.navbarLogo { ... }  /* camelCase en CSS Modules */
```

**En App.jsx:**
```javascript
import styles from './App.module.css';

// Usar:
<nav className={styles.navbar}>
  <img className={styles.navbarLogo} ... />
</nav>
```

**Archivos a migrar:**
1. `App.css` → `App.module.css` (y actualizar App.jsx)
2. Crea `components/Navbar/Navbar.module.css` (extrae estilos del navbar)
3. `pages/inicio/Home.css` → `Home.module.css`
4. `pages/autenticacion/LoginPage.css` → `LoginPage.module.css`
5. `pages/autenticacion/RegisterPage.css` → `RegisterPage.module.css`

---

### ✅ Tarea 6.2: Responsive Check
**Tiempo:** 1 hora  
**Estado:** ⬜ Pendiente

- Abre DevTools → Toggle device toolbar
- Prueba en iPhone SE, iPhone 12 Pro, iPad
- Verifica que:
  - Navbar se convierte en hamburguesa
  - Formularios no se desbordan
  - Botones son tocables (mínimo 44px)
  - Texto es legible (mínimo 16px en inputs)

---

### ✅ Tarea 6.3: Validaciones visuales en formularios
**Tiempo:** 1 hora  
**Estado:** ⬜ Pendiente

**En LoginPage.jsx:**
```javascript
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  if (!email) newErrors.email = 'Email es requerido';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = 'Email no válido';
  }
  if (!password) newErrors.password = 'Password es requerido';
  else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (!validate()) return;
  // continuar con login...
};

// En el JSX:
<input 
  type="email" 
  value={email} 
  onChange={e => setEmail(e.target.value)}
  className={errors.email ? styles.inputError : ''}
/>
{errors.email && <span className={styles.errorText}>{errors.email}</span>}
```

---

## 🧪 FASE 7: Testing y Despliegue (Lunes 19/05)

> **Meta:** 8+ tests pasando y todo en producción.

---

### ✅ Tarea 7.1: Crear tests faltantes
**Tiempo:** 2 horas  
**Estado:** ⬜ Pendiente  
**Fecha:** Lunes 19/05

**Tests que ya tienes (3):**
- ✅ CourseSearchPage.test.jsx
- ✅ JobSearchPage.test.jsx
- ✅ Home.test.jsx

**Tests que necesitas (5+):**

**`src/context/AuthContext.test.jsx`:**
```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock de la API
vi.mock('../services/api', () => ({
  default: {
    post: vi.fn()
  }
}));

describe('AuthContext', () => {
  it('debe iniciar sin usuario autenticado', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/No autenticado/i)).toBeInTheDocument();
  });

  it('debe manejar login exitoso', async () => {
    // Test del flujo de login
  });

  it('debe manejar logout', async () => {
    // Test de cerrar sesión
  });
});
```

**Otros tests a crear:**
- `src/hooks/useFetch.test.js`
- `src/components/Navbar.test.jsx` (muestra links según auth)
- `src/pages/autenticacion/LoginPage.test.jsx`
- `src/pages/autenticacion/RegisterPage.test.jsx`
- `src/utils/validations.test.js` (testear funciones de validación)

**Ejecuta todos los tests:**
```bash
npm test
```

**Meta:** 8+ tests y que todos pasen ✅

---

### ✅ Tarea 7.2: Desplegar Backend
**Tiempo:** 1 hora  
**Estado:** ⬜ Pendiente

**En Railway:**
1. Sube tu código a GitHub
2. En Railway: New Project → Deploy from GitHub repo
3. Selecciona tu repositorio
4. Railway detectará Node.js automáticamente
5. Configura variables de entorno en la web:
   - `DATABASE_URL` (Railway te da una)
   - `JWT_SECRET`
   - `RESEND_API_KEY`
6. Deploy!

**O en Render:**
- Similar proceso, crea Web Service

**Verifica:**
- `https://tu-api.railway.app/` debe devolver "¡Backend de Laboria funcionando!"

---

### ✅ Tarea 7.3: Migrar base de datos a producción
**Tiempo:** 30 minutos  
**Estado:** ⬜ Pendiente

**En terminal (conectado a Railway):**
```bash
# Railway te da un comando para conectar, algo como:
railway run npx prisma migrate deploy

# O si tienes la DATABASE_URL de producción:
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

**Verifica en Prisma Studio (producción):**
```bash
railway run npx prisma studio
```

---

### ✅ Tarea 7.4: Desplegar Frontend
**Tiempo:** 1 hora  
**Estado:** ⬜ Pendiente

**1. Configura para producción:**

**`frontend/.env.production`:**
```
VITE_API_URL=https://tu-api.railway.app
```

**2. Push a GitHub y conectar en Netlify:**
- Si ya tienes Netlify configurado, solo push
- Si no: Netlify → Add new site → Import from GitHub
- Build command: `npm run build`
- Publish directory: `dist`

**3. Configura variables en Netlify:**
- Ve a Site settings → Environment variables
- Agrega `VITE_API_URL` con tu URL de Railway

**4. Deploy!

---

### ✅ Tarea 7.5: Testing Final Integración
**Tiempo:** 30 minutos  
**Estado:** ⬜ Pendiente

**Checklist de producción:**
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Crear empleo como empresa funciona
- [ ] Buscar empleos funciona
- [ ] Aplicar a empleo funciona
- [ ] Emails llegan (verifica spam también)
- [ ] Todo funciona en móvil
- [ ] No hay errores en consola del navegador

---

## 🎉 ¡Proyecto Completado!

### Resumen de entregables:

| Componente | Estado |
|------------|--------|
| API REST con 4+ recursos | ✅ |
| Autenticación JWT | ✅ |
| Roles USER/ADMIN | ✅ |
| PostgreSQL con 4 tablas | ✅ |
| Prisma ORM | ✅ |
| Validaciones en endpoints | ✅ |
| Manejo de errores HTTP | ✅ |
| Variables de entorno | ✅ |
| Integración email | ✅ |
| React 18 + Vite | ✅ |
| React Router v6 (18 rutas) | ✅ |
| Context API (Auth) | ✅ |
| Formularios controlados | ✅ |
| Estados loading/error/empty | ✅ |
| Diseño responsive | ✅ |
| CSS Modules | ✅ |
| 8+ tests pasando | ✅ |
| Backend desplegado | ✅ |
| Frontend desplegado | ✅ |
| DB en la nube | ✅ |
| Comunicación frontend-backend | ✅ |

---

## 🆘 Ayuda rápida

### Errores comunes:

**"Cannot find module"**
→ Ejecuta `npm install` en la carpeta correspondiente

**"Prisma Client didn't initialize"**
→ Ejecuta `npx prisma generate`

**"Database connection failed"**
→ Verifica que `DATABASE_URL` está en `.env`

**"JWT malformed"**
→ Verifica que el token se envía como `Bearer token_aqui`

**CORS error en frontend**
→ Verifica que `cors` está configurado en backend y permite el dominio del frontend

---

**¡Mucha suerte con tu proyecto! 🚀**

Si te atas en algo, recuerda: Google, documentación oficial, y dividir el problema en partes más pequeñas.

# Volumen 3: Backend API

## Índice del volumen

1. [Entry point (`server.js`)](#1-entry-point-serverjs)
2. [Configuración de base de datos](#2-configuración-de-base-de-datos)
3. [Middleware de autenticación](#3-middleware-de-autenticación)
4. [Middleware de autorización](#4-middleware-de-autorización)
5. [Manejo de errores](#5-manejo-de-errores)
6. [Rate limiting](#6-rate-limiting)
7. [Utilidades JWT](#7-utilidades-jwt)
8. [Controlador de usuarios](#8-controlador-de-usuarios)
9. [Controlador de empleos](#9-controlador-de-empleos)
10. [Controlador de cursos](#10-controlador-de-cursos)
11. [Controlador de aplicaciones](#11-controlador-de-aplicaciones)
12. [Controlador de administración](#12-controlador-de-administración)
13. [Servicio de email](#13-servicio-de-email)
14. [Rutas](#14-rutas)
15. [Diagrama de flujo de una petición](#15-diagrama-de-flujo-de-una-petición)

---

## 1. Entry point (`server.js`)

**Archivo:** `backend/server.js`

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS dinámico
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:4173'];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.use(express.json()); // Parsear JSON en el body

// Rutas
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/jobs', require('./src/routes/jobRoutes'));
app.use('/api/courses', require('./src/routes/courseRoutes'));
app.use('/api/applications', require('./src/routes/applicationRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '¡Backend de Laboria funcionando!' });
});

// Error handler (siempre al final)
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
```

**Cada elemento explicado:**

| Elemento | Línea(s) | Explicación |
|---|---|---|
| `dotenv.config()` | 7 | Carga las variables de `backend/.env` en `process.env` |
| `allowedOrigins` | 16-18 | Lista de orígenes permitidos por CORS. Se configura via variable de entorno `CORS_ORIGINS` (separada por comas). En desarrollo: `localhost:5173, localhost:4173` |
| `cors()` | 19-25 | Middleware CORS. Permite peticiones desde el frontend (GitHub Pages o localhost). `credentials: true` permite enviar cookies/headers de autenticación |
| `express.json()` | 27 | Middleware que parsea el body de las peticiones con `Content-Type: application/json`. **Sin esto, `req.body` es `undefined`** |
| `app.use('/api/...', rutas)` | 30-34 | Monta los routers en sus respectivas rutas base |
| `app.use(errorHandler)` | 37 | Middleware de manejo de errores. **Debe ir al final** después de todas las rutas |
| `SIGTERM` / `SIGINT` | 44-45 | Graceful shutdown: cierra el servidor limpiamente cuando recibe señal de terminación |

---

## 2. Configuración de base de datos

**Archivo:** `backend/src/config/database.js`

```javascript
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;
```

**Explicación:**

| Elemento | Explicación |
|---|---|
| `dotenv.config()` | Carga el `.env` desde la raíz del backend (otra vez) para asegurar que `DATABASE_URL` está disponible antes de crear el cliente Prisma |
| `PrismaClient` | Cliente ORM que se conecta a PostgreSQL usando `DATABASE_URL`. Proporciona métodos tipados como `prisma.user.findMany()`, `prisma.job.create()`, etc. |
| Singleton | Se exporta una única instancia. Todos los controllers importan esta misma instancia para evitar múltiples conexiones a la BD |

---

## 3. Middleware de autenticación

**Archivo:** `backend/src/middleware/authMiddleware.js`

```javascript
const { verifyToken } = require('../utils/jwt');
const prisma = require('../config/database');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('No autorizado - Token no proporcionado');
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(' ')[1];

    const decoded = verifyToken(token);
    if (!decoded) {
      const error = new Error('No autorizado - Token inválido');
      error.statusCode = 401;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
```

**Flujo de autenticación:**

```
Request con header: Authorization: Bearer <token>
    │
    ▼
1. ¿Header existe y empieza con "Bearer "?
    ├─ No → Error 401: Token no proporcionado
    └─ Sí → Continuar
    │
    ▼
2. Extraer token (split(' ')[1])
    │
    ▼
3. verifyToken(token)
    ├─ Token inválido/expirado → Error 401: Token inválido
    └─ Válido → decoded = { userId, iat, exp }
    │
    ▼
4. Buscar usuario en BD por decoded.userId
    ├─ No encontrado → Error 404: Usuario no encontrado
    └─ Encontrado → req.user = { id, email, name, role }
    │
    ▼
5. next() → Pasa al siguiente middleware/controlador
```

---

## 4. Middleware de autorización

### ownerMiddleware

**Archivo:** `backend/src/middleware/ownerMiddleware.js`

```javascript
const ownerMiddleware = (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      const error = new Error('No autorizado - Solo puedes acceder a tu propio perfil');
      error.statusCode = 403;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
};
```

**Propósito:** Verifica que el usuario autenticado sea el propietario del recurso (por ID en params) o un administrador.

**Uso:** Rutas como `GET /api/users/:id`, `PUT /api/users/:id`

### adminMiddleware

**Archivo:** `backend/src/middleware/adminMiddleware.js`

```javascript
const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      const error = new Error('Acceso denegado - Requiere rol ADMIN');
      error.statusCode = 403;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
};
```

**Propósito:** Verifica que el usuario tenga rol `ADMIN`.

**Uso:** Todas las rutas de administración (`/api/admin/*`)

---

## 5. Manejo de errores

**Archivo:** `backend/src/middleware/errorHandler.js`

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
```

**Propósito:** Middleware centralizado de manejo de errores. Captura cualquier error lanzado con `next(error)` en los controladores.

**Comportamiento:**

| Situación | Código | Respuesta |
|---|---|---|
| Error con `statusCode` propio | El asignado | `{ error: mensaje }` |
| Error sin statusCode | 500 | `{ error: "Error interno del servidor" }` |
| En desarrollo | El que sea | Incluye `stack` trace |
| En producción | El que sea | Oculta el stack trace |

---

## 6. Rate limiting

**Archivo:** `backend/src/middleware/rateLimiter.js`

```javascript
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 30,                     // máximo 30 requests
  message: { error: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
```

**Limitadores disponibles:**

| Limitador | Límite | Ventana | Uso |
|---|---|---|---|
| `authLimiter` | 30 requests | 15 minutos | Login y registro |
| `generalLimiter` | 100 requests | 15 minutos | (Disponible para otras rutas) |

---

## 7. Utilidades JWT

**Archivo:** `backend/src/utils/jwt.js`

```javascript
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
```

**Funciones:**

| Función | Parámetros | Retorno | Descripción |
|---|---|---|---|
| `generateToken(userId)` | ID del usuario | String (JWT) | Crea un token firmado con `userId` en el payload |
| `verifyToken(token)` | Token JWT | Payload decodificado o `null` | Verifica la firma y expiración. Retorna `null` si es inválido |

**Estructura del JWT:**

```json
// Header
{ "alg": "HS256", "typ": "JWT" }

// Payload
{ "userId": "uuid-del-usuario", "iat": 1234567890, "exp": 1234567890 + 7d }

// Firma
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), JWT_SECRET)
```

---

## 8. Controlador de usuarios

**Archivo:** `backend/src/controllers/userController.js`

### register(req, res, next)

```
POST /api/users/register
Body: { email, password, name, role? }
```

**Validaciones:**
- Campos requeridos: `email`, `password`, `name`
- Email: formato válido (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Password: mínimo 6 caracteres
- Email único en BD (error 409 si ya existe)

**Proceso:**
1. Validar campos
2. Verificar email único
3. Hash de password con bcrypt (10 rondas)
4. Crear usuario en BD con `prisma.user.create()`
5. Enviar email de bienvenida (no bloqueante)
6. Responder 201 con `{ message, user }` (sin password)

### login(req, res, next)

```
POST /api/users/login
Body: { email, password }
```

**Proceso:**
1. Buscar usuario por email
2. Si no existe → 401 "Credenciales inválidas"
3. Comparar password con bcrypt
4. Si no coincide → 401 "Credenciales inválidas"
5. Generar JWT token
6. Responder 200 con `{ message, user (sin password), token }`

### getProfile(req, res, next)

```
GET /api/users/:id
Auth: Bearer + ownerMiddleware
```

**Proceso:**
1. Buscar usuario por ID
2. Si no existe → 404
3. Responder con datos del usuario

### updateProfile(req, res, next)

```
PUT /api/users/:id
Auth: Bearer + ownerMiddleware
Body: { name, email }
```

**Nota:** Solo actualiza `name` y `email`. Los datos extendidos del perfil se manejan en localStorage del frontend.

### deleteAccount(req, res, next)

```
DELETE /api/users/:id
Auth: Bearer + ownerMiddleware (o adminMiddleware)
```

Elimina al usuario de la base de datos. El frontend también limpia localStorage.

---

## 9. Controlador de empleos

**Archivo:** `backend/src/controllers/jobController.js`

### list(req, res, next)

```
GET /api/jobs
Query: ?category=&location=&mode=&search=
```

**Filtros disponibles:**

| Query | Operación | Ejemplo |
|---|---|---|
| `category` | Igualdad exacta | `?category=Tecnología` |
| `location` | Búsqueda insensible (contains) | `?location=Madrid` |
| `mode` | Igualdad exacta | `?mode=REMOTE` |
| `search` | Búsqueda en título y empresa (OR) | `?search=developer` |

### create(req, res, next)

```
POST /api/jobs
Auth: Bearer (solo COMPANY_* o ADMIN)
Body: { title, company, location, salary?, description, requirements?, mode?, category }
```

**Validaciones:**
- Campos requeridos: `title`, `company`, `description`
- Solo empresas o admin pueden crear

### update(req, res, next) / delete(req, res, next)

Requieren ser el autor del empleo o ADMIN.

---

## 10. Controlador de cursos

**Archivo:** `backend/src/controllers/courseController.js`

Estructura idéntica al controlador de empleos, pero para cursos.

### list(req, res, next)

```
GET /api/courses
Query: ?category=&level=&search=
```

---

## 11. Controlador de aplicaciones

**Archivo:** `backend/src/controllers/applicationController.js`

### create(req, res, next)

```
POST /api/applications
Auth: Bearer (solo CANDIDATE)
Body: { jobId, message? }
```

**Validaciones:**
- El empleo debe existir (incluye verificar autor para notificación)
- El usuario debe ser CANDIDATE
- No puede aplicar dos veces al mismo empleo (unique compuesto)

### myApplications(req, res, next)

```
GET /api/applications/my
Auth: Bearer (solo CANDIDATE)
```

Retorna todas las aplicaciones del usuario autenticado, con datos del empleo.

### jobApplications(req, res, next)

```
GET /api/applications/job/:jobId
Auth: Bearer (solo autor del empleo o ADMIN)
```

Retorna todas las aplicaciones recibidas para un empleo.

### updateStatus(req, res, next)

```
PUT /api/applications/:id/status
Auth: Bearer (solo autor del empleo o ADMIN)
Body: { status: "ACCEPTED" | "REJECTED" }
```

### cancel(req, res, next)

```
DELETE /api/applications/:id
Auth: Bearer (solo el candidato que aplicó)
```

---

## 12. Controlador de administración

**Archivo:** `backend/src/controllers/adminController.js`

Todas las rutas requieren `authMiddleware` + `adminMiddleware`.

### Funciones disponibles:

| Función | Endpoint | Descripción |
|---|---|---|
| `getDashboardStats` | GET `/api/admin/dashboard` | Estadísticas: totales, usuarios por rol, aplicaciones por estado, empleos por categoría, cursos por nivel, actividad reciente (30 días) |
| `getAllUsers` | GET `/api/admin/users?role=&search=&page=&limit=` | Lista paginada de usuarios con filtros |
| `getUserDetails` | GET `/api/admin/users/:id` | Detalle completo: datos + empleos + cursos + aplicaciones |
| `updateUserRole` | PUT `/api/admin/users/:id/role` | Cambiar rol. No permite cambiarse el rol a sí mismo |
| `deleteUserAsAdmin` | DELETE `/api/admin/users/:id` | Eliminar usuario. No permite eliminarse a sí mismo |
| `getAllJobs` | GET `/api/admin/jobs?category=&search=&page=&limit=` | Empleos con autor y conteo de aplicaciones |
| `getAllCourses` | GET `/api/admin/courses?category=&level=&search=&page=&limit=` | Cursos con autor |
| `getAllApplications` | GET `/api/admin/applications?status=&page=&limit=` | Aplicaciones con usuario y empleo |
| `updateJobAsAdmin` | PUT `/api/admin/jobs/:id` | Actualizar cualquier empleo |
| `deleteJobAsAdmin` | DELETE `/api/admin/jobs/:id` | Eliminar cualquier empleo |
| `updateCourseAsAdmin` | PUT `/api/admin/courses/:id` | Actualizar cualquier curso |
| `deleteCourseAsAdmin` | DELETE `/api/admin/courses/:id` | Eliminar cualquier curso |
| `updateApplicationStatusAsAdmin` | PUT `/api/admin/applications/:id/status` | Cambiar estado de cualquier aplicación |

---

## 13. Servicio de email

**Archivo:** `backend/src/services/emailService.js`

```javascript
let Resend;
try {
  Resend = require('resend').Resend;
} catch (e) {
  console.warn('⚠️ Paquete resend no disponible - emails desactivados');
}

let resend = null;
if (Resend && process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}
```

**Funciones:**

| Función | Cuándo se envía | Destinatario |
|---|---|---|
| `sendWelcome(to, name)` | Al registrarse un usuario | El nuevo usuario |
| `sendApplicationReceived(to, jobTitle, applicantName)` | Cuando un candidato aplica a un empleo | La empresa que publicó el empleo |

**Comportamiento:**

| Situación | Acción |
|---|---|
| `RESEND_API_KEY` no configurada | Log "Email service no configurado" y continúa |
| Error al enviar | Log del error y continúa (no bloquea la operación principal) |
| Éxito | Email enviado |

---

## 14. Rutas

**Archivo:** `backend/src/routes/`

Cada archivo de rutas define los endpoints y su cadena de middlewares.

### userRoutes.js

```javascript
router.post('/register', authLimiter, userController.register);
router.post('/login', authLimiter, userController.login);
router.get('/profile/me', authMiddleware, (req, res) => res.json(req.user));
router.put('/profile/me', authMiddleware, userController.updateProfile);
router.delete('/account', authMiddleware, userController.deleteAccount);
router.get('/:id', authMiddleware, ownerMiddleware, userController.getProfile);
router.put('/:id', authMiddleware, ownerMiddleware, userController.updateProfile);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteAccount);
```

### jobRoutes.js

```javascript
router.get('/', jobController.list);          // público
router.get('/:id', jobController.detail);     // público
router.post('/', authMiddleware, jobController.create);
router.put('/:id', authMiddleware, jobController.update);
router.delete('/:id', authMiddleware, jobController.delete);
```

### courseRoutes.js — idéntico a jobRoutes

### applicationRoutes.js

```javascript
router.post('/', authMiddleware, applicationController.create);
router.get('/my', authMiddleware, applicationController.myApplications);
router.get('/job/:jobId', authMiddleware, applicationController.jobApplications);
router.put('/:id/status', authMiddleware, applicationController.updateStatus);
router.delete('/:id', authMiddleware, applicationController.cancel);
```

### adminRoutes.js — todas requieren authMiddleware + adminMiddleware a nivel de router

---

## 15. Diagrama de flujo de una petición

```
CLIENTE (Frontend / Postman)
        │
        │  POST /api/users/login
        │  Body: { email, password }
        ▼
┌─────────────────────────────────┐
│         Express Server          │
│                                 │
│  1. cors()                      │
│     └─ ¿Origen permitido?       │
│        ├─ No → Error CORS       │
│        └─ Sí → Continuar        │
│                                 │
│  2. express.json()              │
│     └─ Parsear body → req.body  │
│                                 │
│  3. Router.match('/api/users/   │
│     login')                     │
│     └─ authLimiter              │
│        └─ ¿Dentro del límite?   │
│           ├─ No → 429           │
│           └─ Sí → Continuar     │
│                                 │
│  4. userController.login()      │
│     └─ Validar campos           │
│     └─ Buscar usuario en BD     │
│     └─ Comparar password        │
│     └─ Generar JWT              │
│     └─ Responder 200            │
│                                 │
│  5. errorHandler() (si hay      │
│     error en cualquier paso)    │
│     └─ Responder con status     │
│        code y mensaje           │
└─────────────────────────────────┘
        │
        │  { user, token }
        ▼
CLIENTE recibe respuesta
```

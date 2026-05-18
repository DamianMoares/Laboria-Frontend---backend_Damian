# Backend de Laboria — Especificación Técnica Completa

> **Documento:** especifico-backend.md  
> **Versión:** 2.0  
> **Fecha:** Mayo 2026  
> **Stack:** Node.js + Express 5 + Prisma 6 + PostgreSQL 16 + JWT + Resend

---

## Índice

1. [Tecnologías y dependencias](#1-tecnologías-y-dependencias)
2. [Estructura del proyecto](#2-estructura-del-proyecto)
3. [Entry point — server.js](#3-entry-point--serverjs)
4. [Base de datos — Prisma Schema](#4-base-de-datos--prisma-schema)
5. [Modelos de datos (8)](#5-modelos-de-datos-8)
6. [Enumeraciones (4)](#6-enumeraciones-4)
7. [Migraciones (8)](#7-migraciones-8)
8. [Configuración — database.js](#8-configuración--databasejs)
9. [Utilidades — jwt.js](#9-utilidades--jwtjs)
10. [Middleware (6)](#10-middleware-6)
11. [Servicios (2)](#11-servicios-2)
12. [Controladores (6)](#12-controladores-6)
13. [Rutas (6) — 40 endpoints](#13-rutas-6--40-endpoints)
14. [Tests (6 archivos — 29 tests)](#14-tests-6-archivos--29-tests)
15. [Scripts (2)](#15-scripts-2)
16. [Configuración adicional](#16-configuración-adicional)

---

## 1. Tecnologías y dependencias

### 1.1 Lenguaje y runtime

| Aspecto | Valor |
|---------|-------|
| Lenguaje | JavaScript (CommonJS) |
| Runtime | Node.js >= 18 (recomendado 20 LTS) |
| Tipo de módulo | `commonjs` (`"type": "commonjs"` en package.json) |

### 1.2 Dependencias de producción (11)

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@prisma/client` | ^6.19.3 | ORM — cliente de base de datos generado desde el schema |
| `bcryptjs` | ^3.0.3 | Hashing de contraseñas (cost factor 10) |
| `cors` | ^2.8.6 | Middleware CORS para peticiones cross-origin |
| `dotenv` | ^17.4.2 | Carga de variables de entorno desde `.env` |
| `express` | ^5.2.1 | Framework web (versión 5 con async error handling) |
| `express-rate-limit` | ^8.5.1 | Rate limiting para prevenir abuso |
| `express-validator` | ^7.3.2 | Validación de datos de entrada en rutas |
| `helmet` | ^8.1.0 | Headers de seguridad HTTP |
| `jsonwebtoken` | ^9.0.3 | Generación y verificación de JWT |
| `resend` | ^3.0.0 | SDK para envío de emails transaccionales |
| `vitest` | ^1.4.0 | Framework de testing (usado también en producción para el endpoint de tests) |

### 1.3 Dependencias de desarrollo (2)

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `nodemon` | ^3.1.14 | Auto-reload en desarrollo |
| `prisma` | ^6.19.3 | CLI de Prisma (migraciones, generate, seed) |

### 1.4 Scripts disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| `start` | `node server.js` | Inicio en producción |
| `dev` | `nodemon server.js` | Desarrollo con auto-reinicio |
| `build` | `npx prisma generate && npx prisma migrate deploy` | Genera cliente Prisma + aplica migraciones |
| `seed` | `node prisma/seed.js` | Pobla la BD con datos demo (9 usuarios, 8 empleos, 8 cursos, 5 aplicaciones) |
| `test` | `vitest run` | Ejecuta tests una sola vez |
| `test:watch` | `vitest` | Tests en modo watch |

---

## 2. Estructura del proyecto

```
backend/
├── server.js                          # Entry point Express
├── package.json                       # Dependencias y scripts
├── vitest.config.js                   # Configuración de Vitest
├── Dockerfile                         # Contenedor Node 20 Alpine
├── .env.example                       # Plantilla de variables de entorno
├── prisma/
│   ├── schema.prisma                  # Schema de datos (8 modelos, 4 enums)
│   ├── seed.js                        # Seed de datos demo
│   └── migrations/                    # 8 migraciones SQL
│       ├── migration_lock.toml
│       ├── 20260515084230_init/
│       ├── 20260516223005_add_password_reset/
│       ├── 20260516232019_add_curriculum_and_course_applications/
│       ├── 20260517121137_add_login_sessions/
│       ├── 20260517213005_add_audit_log/
│       ├── 20260517214627_change_user_role_to_enum/
│       ├── 20260517215955_add_indexes_and_course_application_fk/
│       └── 20260518082506_add_status_indexes_and_auditlog_relation/
├── scripts/
│   ├── generateSpanishData.js         # Generador de datos españoles (350 empleos, 150 cursos)
│   └── seedDemoUsers.js               # Seed rápido de 5 usuarios demo
└── src/
    ├── config/
    │   └── database.js                # Singleton PrismaClient
    ├── utils/
    │   └── jwt.js                     # Generación/verificación de JWT
    ├── middleware/
    │   ├── authMiddleware.js           # Verificación de JWT + carga de usuario
    │   ├── adminMiddleware.js          # Verificación de rol ADMIN
    │   ├── ownerMiddleware.js          # Verificación de propietario
    │   ├── errorHandler.js            # Manejador global de errores
    │   ├── rateLimiter.js             # 3 limitadores de tasa
    │   └── validate.js                # 10 conjuntos de reglas express-validator
    ├── services/
    │   ├── auditService.js            # Registro de acciones de administración
    │   └── emailService.js            # Envío de emails (Resend)
    ├── controllers/
    │   ├── userController.js          # 14 funciones — 417 líneas
    │   ├── jobController.js           # 5 funciones — 190 líneas
    │   ├── courseController.js        # 5 funciones — 190 líneas
    │   ├── applicationController.js   # 5 funciones — 204 líneas
    │   ├── courseApplicationController.js # 4 funciones — 121 líneas
    │   └── adminController.js         # 12 funciones — 845 líneas
    ├── routes/
    │   ├── userRoutes.js              # 16 endpoints
    │   ├── jobRoutes.js               # 5 endpoints
    │   ├── courseRoutes.js            # 5 endpoints
    │   ├── applicationRoutes.js       # 5 endpoints
    │   ├── courseApplicationRoutes.js # 4 endpoints
    │   └── adminRoutes.js             # 15 endpoints
    └── __tests__/
        ├── userController.test.js     # 6 tests
        ├── jobController.test.js      # 4 tests
        ├── courseController.test.js   # 4 tests
        ├── applicationController.test.js # 6 tests
        ├── adminController.test.js    # 5 tests
        └── authMiddleware.test.js     # 4 tests
```

---

## 3. Entry point — server.js

**Archivo:** `backend/server.js` — 84 líneas

### 3.1 Configuración inicial

```javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });
```

Carga las variables de entorno desde `backend/.env` usando `dotenv`.

### 3.2 Middleware global

| Middleware | Orden | Propósito |
|-----------|-------|-----------|
| `helmet()` | 1º | Headers de seguridad HTTP |
| `cors()` | 2º | Configuración CORS con soporte para orígenes exactos y wildcards (`*.vercel.app`) |
| `express.json()` | 3º | Parseo de cuerpo JSON |
| `writeLimiter` | 4º | Rate limiting global para métodos POST/PUT/DELETE (60 peticiones / 15 min) |

**Configuración CORS:**
- Soporta orígenes exactos (ej: `http://localhost:5173`)
- Soporta wildcards (ej: `*.vercel.app` → regex que acepta cualquier subdominio)
- Credentials: true
- Métodos: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization, X-Requested-With

### 3.3 Rutas montadas

| Prefijo | Archivo de rutas |
|---------|-----------------|
| `/api/users` | `./src/routes/userRoutes` |
| `/api/jobs` | `./src/routes/jobRoutes` |
| `/api/courses` | `./src/routes/courseRoutes` |
| `/api/applications` | `./src/routes/applicationRoutes` |
| `/api/course-applications` | `./src/routes/courseApplicationRoutes` |
| `/api/admin` | `./src/routes/adminRoutes` |

### 3.4 Endpoints adicionales

| Método | Ruta | Respuesta |
|--------|------|-----------|
| GET | `/` | `{ message: "¡Backend de Laboria funcionando!" }` |
| GET | `/health` | `{ status: "ok", timestamp: "ISO-8601" }` |

### 3.5 Manejador de errores

```javascript
app.use(errorHandler);  // Siempre al final del pipeline
```

### 3.6 Inicio del servidor y shutdown graceful

```javascript
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Shutdown graceful: cierra server + desconecta Prisma
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

---

## 4. Base de datos — Prisma Schema

**Archivo:** `backend/prisma/schema.prisma` — 166 líneas

### 4.1 Generator y datasource

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 4.2 Resumen de modelos

| # | Modelo | Campos | Líneas | Relaciones |
|---|--------|--------|--------|------------|
| 1 | User | 10 | ~30 | 7 relaciones (jobs, courses, applications, courseApplications, curriculum, loginSessions, auditLogs) |
| 2 | Job | 12 | ~22 | 2 relaciones (applications, author) + 5 índices |
| 3 | Course | 13 | ~22 | 2 relaciones (courseApplications, author) + 4 índices |
| 4 | LoginSession | 7 | ~14 | 1 relación (user) + 2 índices |
| 5 | Application | 8 | ~18 | 2 relaciones (job, user) + 1 unique compuesto + 1 índice |
| 6 | Curriculum | 6 | ~12 | 1 relación (user, unique) |
| 7 | CourseApplication | 8 | ~18 | 2 relaciones (course, user) + 1 unique compuesto + 1 índice |
| 8 | AuditLog | 8 | ~16 | 1 relación (admin -> User) + 2 índices |

---

## 5. Modelos de datos (8)

### 5.1 User

```prisma
model User {
  id                 String             @id @default(uuid())
  email              String             @unique
  password           String
  name               String
  role               Role               @default(CANDIDATE)
  resetPasswordToken String?            @unique
  resetPasswordExpires DateTime?
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt
  applications       Application[]
  courseApplications CourseApplication[]
  courses            Course[]
  jobs               Job[]
  curriculum         Curriculum?
  loginSessions      LoginSession[]
  auditLogs          AuditLog[]
}
```

**Campos detallados:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | String (UUID) | `@id @default(uuid())` | Identificador único |
| `email` | String | `@unique` | Correo electrónico (validado en registro) |
| `password` | String | — | Hash bcrypt de la contraseña |
| `name` | String | — | Nombre completo del usuario |
| `role` | Role (enum) | `@default(CANDIDATE)` | Rol: CANDIDATE / COMPANY_EMPLOYEES / COMPANY_STUDENTS / COMPANY_HYBRID / ADMIN |
| `resetPasswordToken` | String? | `@unique` | Token para restablecimiento de contraseña |
| `resetPasswordExpires` | DateTime? | — | Fecha de expiración del token |
| `createdAt` | DateTime | `@default(now())` | Fecha de registro |
| `updatedAt` | DateTime | `@updatedAt` | Última actualización |

**Relaciones:**
- `applications` → Application[] (candidato)
- `courseApplications` → CourseApplication[] (estudiante)
- `courses` → Course[] (autor/instructor)
- `jobs` → Job[] (autor/empleador)
- `curriculum` → Curriculum? (CV, 1:1)
- `loginSessions` → LoginSession[] (sesiones de inicio)
- `auditLogs` → AuditLog[] (acciones realizadas como admin)

### 5.2 Job

```prisma
model Job {
  id           String        @id @default(uuid())
  title        String
  company      String
  location     String
  salary       String?
  description  String
  requirements String?
  mode         WorkMode      @default(REMOTE)
  category     String
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  authorId     String
  applications Application[]
  author       User          @relation(fields: [authorId], references: [id])

  @@index([category])
  @@index([location])
  @@index([mode])
  @@index([authorId])
  @@index([createdAt])
}
```

**Campos detallados:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | String (UUID) | `@id @default(uuid())` | Identificador único |
| `title` | String | — | Título del puesto |
| `company` | String | — | Nombre de la empresa |
| `location` | String | — | Ubicación (ej: "Madrid", "Barcelona", "Remoto") |
| `salary` | String? | — | Rango salarial (ej: "30.000€ - 45.000€") |
| `description` | String | — | Descripción completa del puesto |
| `requirements` | String? | — | Requisitos y habilidades necesarias |
| `mode` | WorkMode | `@default(REMOTE)` | Modalidad: REMOTE / HYBRID / ONSITE |
| `category` | String | — | Categoría profesional |
| `createdAt` | DateTime | `@default(now())` | Fecha de publicación |
| `updatedAt` | DateTime | `@updatedAt` | Última modificación |
| `authorId` | String | FK → User.id | Autor/publicador |

**Relaciones:**
- `applications` → Application[] (candidaturas recibidas)
- `author` → User (empresa/publicador)

**Índices (5):** category, location, mode, authorId, createdAt

### 5.3 Course

```prisma
model Course {
  id                String              @id @default(uuid())
  title             String
  provider          String
  description       String
  category          String
  level             Level               @default(BEGINNER)
  duration          String?
  price             String?
  url               String?
  image             String?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  authorId          String
  author            User                @relation(fields: [authorId], references: [id])
  courseApplications CourseApplication[]

  @@index([category])
  @@index([level])
  @@index([authorId])
  @@index([createdAt])
}
```

**Campos detallados:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | String (UUID) | `@id @default(uuid())` | Identificador único |
| `title` | String | — | Título del curso |
| `provider` | String | — | Proveedor o institución educativa |
| `description` | String | — | Descripción del contenido |
| `category` | String | — | Categoría formativa |
| `level` | Level | `@default(BEGINNER)` | Nivel: BEGINNER / INTERMEDIATE / ADVANCED |
| `duration` | String? | — | Duración estimada (ej: "8 semanas", "40 horas") |
| `price` | String? | — | Precio o "Gratuito" |
| `url` | String? | — | URL del curso externo |
| `image` | String? | — | URL de imagen representativa |
| `createdAt` | DateTime | `@default(now())` | Fecha de publicación |
| `updatedAt` | DateTime | `@updatedAt` | Última modificación |
| `authorId` | String | FK → User.id | Autor/instructor |

**Relaciones:**
- `courseApplications` → CourseApplication[] (inscripciones)
- `author` → User (institución/instructor)

**Índices (4):** category, level, authorId, createdAt

### 5.4 LoginSession

```prisma
model LoginSession {
  id        String    @id @default(uuid())
  userId    String
  userRole  Role
  loginAt   DateTime  @default(now())
  logoutAt  DateTime?
  duration  Int?
  user      User      @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([loginAt])
}
```

**Campos detallados:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | String (UUID) | `@id @default(uuid())` | Identificador único |
| `userId` | String | FK → User.id | Usuario que inició sesión |
| `userRole` | Role (enum) | — | Rol del usuario en el momento del login |
| `loginAt` | DateTime | `@default(now())` | Momento del inicio de sesión |
| `logoutAt` | DateTime? | — | Momento del cierre de sesión |
| `duration` | Int? | — | Duración en segundos (calculada al logout) |

### 5.5 Application

```prisma
model Application {
  id        String            @id @default(uuid())
  status    ApplicationStatus @default(PENDING)
  message   String?
  createdAt DateTime          @default(now())
  updatedAt DateTime          @updatedAt
  userId    String
  jobId     String
  job       Job               @relation(fields: [jobId], references: [id])
  user      User              @relation(fields: [userId], references: [id])

  @@unique([userId, jobId])
  @@index([status])
}
```

**Campos detallados:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | String (UUID) | `@id @default(uuid())` | Identificador único |
| `status` | ApplicationStatus | `@default(PENDING)` | Estado: PENDING / ACCEPTED / REJECTED |
| `message` | String? | — | Mensaje de presentación del candidato |
| `createdAt` | DateTime | `@default(now())` | Fecha de aplicación |
| `updatedAt` | DateTime | `@updatedAt` | Última modificación |
| `userId` | String | FK → User.id | Candidato |
| `jobId` | String | FK → Job.id | Empleo solicitado |

**Restricción única:** `@@unique([userId, jobId])` — Un candidato no puede aplicar dos veces al mismo empleo.
**Índice (1):** status

### 5.6 Curriculum

```prisma
model Curriculum {
  id        String   @id @default(uuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  data      Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Campos detallados:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | String (UUID) | `@id @default(uuid())` | Identificador único |
| `userId` | String | `@unique`, FK → User.id | Usuario (relación 1:1) |
| `data` | Json | — | Datos del CV (secciones: experiencia, educación, habilidades, etc.) |
| `createdAt` | DateTime | `@default(now())` | Fecha de creación |
| `updatedAt` | DateTime | `@updatedAt` | Última modificación |

### 5.7 CourseApplication

```prisma
model CourseApplication {
  id        String            @id @default(uuid())
  status    ApplicationStatus @default(PENDING)
  message   String?
  createdAt DateTime          @default(now())
  updatedAt DateTime          @updatedAt
  userId    String
  courseId  String
  course    Course            @relation(fields: [courseId], references: [id])
  user      User              @relation(fields: [userId], references: [id])

  @@unique([userId, courseId])
  @@index([status])
}
```

**Campos detallados:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | String (UUID) | `@id @default(uuid())` | Identificador único |
| `status` | ApplicationStatus | `@default(PENDING)` | Estado: PENDING / ACCEPTED / REJECTED |
| `message` | String? | — | Mensaje del estudiante |
| `createdAt` | DateTime | `@default(now())` | Fecha de inscripción |
| `updatedAt` | DateTime | `@updatedAt` | Última modificación |
| `userId` | String | FK → User.id | Estudiante |
| `courseId` | String | FK → Course.id | Curso solicitado |

**Restricción única:** `@@unique([userId, courseId])` — Un candidato no puede inscribirse dos veces al mismo curso.
**Índice (1):** status

### 5.8 AuditLog

```prisma
model AuditLog {
  id        String   @id @default(uuid())
  action    String
  entity    String
  entityId  String?
  details   String?
  adminId   String
  admin     User     @relation(fields: [adminId], references: [id])
  adminName String?
  createdAt DateTime @default(now())

  @@index([adminId])
  @@index([entity, entityId])
}
```

**Campos detallados:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | String (UUID) | `@id @default(uuid())` | Identificador único |
| `action` | String | — | Acción realizada (ej: "USER_DELETED", "ROLE_CHANGED") |
| `entity` | String | — | Entidad afectada (ej: "User", "Job", "Application") |
| `entityId` | String? | — | ID de la entidad afectada |
| `details` | String? | — | Detalles adicionales (JSON string) |
| `adminId` | String | FK → User.id | Admin que ejecutó la acción |
| `adminName` | String? | — | Nombre del admin en el momento |
| `createdAt` | DateTime | `@default(now())` | Fecha de la acción |

**Índices (2):** adminId, [entity, entityId]

---

## 6. Enumeraciones (4)

### 6.1 Role

```prisma
enum Role {
  CANDIDATE          // Busca empleo y formación
  COMPANY_EMPLOYEES  // Publica ofertas de empleo
  COMPANY_STUDENTS   // Publica cursos formativos
  COMPANY_HYBRID     // Publica empleos y cursos
  ADMIN              // Gestiona todo el sistema
}
```

**Uso en el código:**
- `User.role` — Rol principal del usuario
- `LoginSession.userRole` — Rol al momento del login

### 6.2 WorkMode

```prisma
enum WorkMode {
  REMOTE    // Teletrabajo
  HYBRID    // Mixto (presencial + remoto)
  ONSITE    // Presencial
}
```

**Uso en el código:**
- `Job.mode` — Modalidad de trabajo

### 6.3 Level

```prisma
enum Level {
  BEGINNER      // Principiante
  INTERMEDIATE  // Intermedio
  ADVANCED      // Avanzado
}
```

**Uso en el código:**
- `Course.level` — Nivel del curso

### 6.4 ApplicationStatus

```prisma
enum ApplicationStatus {
  PENDING   // Pendiente de revisión
  ACCEPTED  // Aceptada
  REJECTED  // Rechazada
}
```

**Uso en el código:**
- `Application.status` — Estado de candidatura a empleo
- `CourseApplication.status` — Estado de inscripción a curso

---

## 7. Migraciones (8)

| # | Migración | Descripción | SQL |
|---|-----------|-------------|-----|
| 1 | `20260515084230_init` | Schema inicial: crea enums (Role, WorkMode, Level, ApplicationStatus) y tablas (User, Job, Course, Application) con FK e índices | CREATE TYPE + CREATE TABLE |
| 2 | `20260516223005_add_password_reset` | Añade `resetPasswordToken` (unique) y `resetPasswordExpires` a User | ALTER TABLE ADD COLUMN |
| 3 | `20260516232019_add_curriculum_and_course_applications` | Crea tabla Curriculum (userId unique, JSON data) y CourseApplication (unique userId+courseId) con FK | CREATE TABLE + ALTER TABLE ADD FK |
| 4 | `20260517121137_add_login_sessions` | Crea tabla LoginSession (userId, userRole TEXT, loginAt, logoutAt, duration) con FK a User | CREATE TABLE + ALTER TABLE ADD FK |
| 5 | `20260517213005_add_audit_log` | Crea tabla AuditLog (action, entity, entityId, details, adminId, adminName, createdAt) con índices | CREATE TABLE |
| 6 | `20260517214627_change_user_role_to_enum` | Cambia LoginSession.userRole de TEXT a enum Role (DROP + ADD con DEFAULT 'CANDIDATE') | ALTER TABLE DROP/ADD COLUMN |
| 7 | `20260517215955_add_indexes_and_course_application_fk` | Añade 12 índices (Course: 4, Job: 5, LoginSession: 2, CourseApplication FK) | CREATE INDEX + ALTER TABLE ADD FK |
| 8 | `20260518082506_add_status_indexes_and_auditlog_relation` | Añade índices en Application(status) y CourseApplication(status). FK AuditLog.adminId → User.id | CREATE INDEX + ALTER TABLE ADD FK |

---

## 8. Configuración — database.js

**Archivo:** `backend/src/config/database.js` — 7 líneas

```javascript
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;
```

Exporta una **instancia singleton** de `PrismaClient`. Carga dotenv desde la raíz del backend. Este singleton es importado por todos los controladores, servicios y middleware que necesitan acceso a la base de datos.

---

## 9. Utilidades — jwt.js

**Archivo:** `backend/src/utils/jwt.js` — 29 líneas

### 9.1 Funciones exportadas

| Función | Parámetros | Retorno | Descripción |
|---------|-----------|---------|-------------|
| `generateToken(userId)` | `userId: String` | `String` (JWT) | Genera access token con expiración `JWT_EXPIRES_IN` (defecto: 1d) |
| `generateRefreshToken(userId)` | `userId: String` | `String` (JWT) | Genera refresh token con expiración 7d |
| `verifyToken(token)` | `token: String` | `Object \| null` | Verifica y decodifica JWT. Retorna `null` si es inválido/expirado |

### 9.2 Payload del JWT

```javascript
// Access token
{ userId: "uuid", type: "access", iat: timestamp, exp: timestamp }

// Refresh token
{ userId: "uuid", type: "refresh", iat: timestamp, exp: timestamp }
```

### 9.3 Variables de entorno requeridas

| Variable | Defecto | Descripción |
|----------|---------|-------------|
| `JWT_SECRET` | (requerido) | Secreto para firmar tokens |
| `JWT_EXPIRES_IN` | `"1d"` | Duración del access token (ej: "15m", "1d") |

---

## 10. Middleware (6)

### 10.1 authMiddleware.js

**Archivo:** `backend/src/middleware/authMiddleware.js` — 46 líneas

```javascript
const authMiddleware = async (req, res, next) => { ... };
```

**Propósito:** Verifica que la petición incluya un JWT válido en el header `Authorization: Bearer <token>`, decodifica el token, carga el usuario de la BD y lo adjunta en `req.user`.

**Flujo:**
1. Extrae header `Authorization`
2. Verifica formato `Bearer <token>`
3. Decodifica y verifica JWT con `verifyToken()`
4. Busca usuario en BD por `decoded.userId` (selecciona: id, email, name, role)
5. Adjunta `req.user = { id, email, name, role }`

**Errores:**
| Código | Mensaje | Causa |
|--------|---------|-------|
| 401 | "No autorizado - Token no proporcionado" | Header ausente o sin formato Bearer |
| 401 | "No autorizado - Token inválido" | JWT expirado, mal formado o firma incorrecta |
| 404 | "Usuario no encontrado" | Token válido pero usuario eliminado |

### 10.2 adminMiddleware.js

**Archivo:** `backend/src/middleware/adminMiddleware.js` — 14 líneas

```javascript
const adminMiddleware = (req, res, next) => { ... };
```

**Propósito:** Verifica que el usuario autenticado tenga rol ADMIN.

**Flujo:**
1. Comprueba `req.user.role === 'ADMIN'`

**Errores:**
| Código | Mensaje | Causa |
|--------|---------|-------|
| 403 | "Acceso denegado - Requiere rol ADMIN" | Usuario no es admin |

### 10.3 ownerMiddleware.js

**Archivo:** `backend/src/middleware/ownerMiddleware.js` — 15 líneas

```javascript
const ownerMiddleware = (req, res, next) => { ... };
```

**Propósito:** Verifica que el usuario autenticado sea el propietario del recurso (por `req.params.id`) o sea ADMIN.

**Flujo:**
1. Compara `req.user.id` con `req.params.id`
2. Si coincide o es ADMIN → next()
3. Si no → error 403

**Errores:**
| Código | Mensaje | Causa |
|--------|---------|-------|
| 403 | "No autorizado - Solo puedes acceder a tu propio perfil" | No es propietario ni admin |

### 10.4 errorHandler.js

**Archivo:** `backend/src/middleware/errorHandler.js` — 13 líneas

```javascript
const errorHandler = (err, req, res, next) => { ... };
```

**Propósito:** Middleware global de errores Express (4 parámetros). Captura cualquier error y devuelve respuesta JSON estructurada.

**Respuesta:**
```json
// Desarrollo (NODE_ENV=development):
{ "error": "Mensaje", "stack": "Stack trace completo" }

// Producción (NODE_ENV=production):
{ "error": "Mensaje" }
```

**Comportamiento:**
- Usa `err.statusCode` si existe, o 500 por defecto
- Usa `err.message` si existe, o "Error interno del servidor" por defecto
- Loggea `err.stack` en consola siempre
- Incluye stack trace solo en desarrollo

### 10.5 rateLimiter.js

**Archivo:** `backend/src/middleware/rateLimiter.js` — 26 líneas

```javascript
const rateLimit = require('express-rate-limit');
```

**Exporta 3 limitadores:**

| Limitador | Ventana | Máx. | Mensaje | Uso |
|-----------|---------|------|---------|-----|
| `authLimiter` | 15 min | 30 | "Demasiados intentos. Intenta de nuevo en 15 minutos." | Rutas de autenticación (login, register, forgot/reset password) |
| `generalLimiter` | 15 min | 100 | Mensaje por defecto de express-rate-limit | Reservado para uso general |
| `writeLimiter` | 15 min | 60 | "Demasiadas peticiones. Intenta de nuevo en 15 minutos." | Global en server.js para POST/PUT/DELETE |

**Configuración común:** `standardHeaders: true`, `legacyHeaders: false`

### 10.6 validate.js

**Archivo:** `backend/src/middleware/validate.js` — 110 líneas

```javascript
const { body, validationResult } = require('express-validator');
```

**Función interna:** `handleErrors(req, res, next)` — Comprueba `validationResult(req)` y si hay errores, los concatena y pasa a `next(error)` con status 400.

**Reglas de validación exportadas (10 conjuntos):**

#### registerRules
| Campo | Reglas |
|-------|--------|
| email | `isEmail().normalizeEmail()`, `notEmpty()` |
| password | `isLength({ min: 6 })` |
| name | `notEmpty()` |

#### loginRules
| Campo | Reglas |
|-------|--------|
| email | `isEmail().normalizeEmail()`, `notEmpty()` |
| password | `notEmpty()` |
| name | `notEmpty()` (para el campo name del body) |

#### updateProfileRules
| Campo | Reglas |
|-------|--------|
| name | (opcional) `notEmpty()` si presente |
| email | (opcional) `isEmail()` si presente |

#### createJobRules
| Campo | Reglas |
|-------|--------|
| title | `notEmpty()` |
| company | `notEmpty()` |
| description | `notEmpty()` |
| mode | `isIn(['REMOTE', 'ONSITE', 'HYBRID'])` |

#### updateJobRules
Mismos campos que createJobRules pero todos opcionales.

#### createCourseRules
| Campo | Reglas |
|-------|--------|
| title | `notEmpty()` |
| provider | `notEmpty()` |
| description | `notEmpty()` |
| level | `isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])` |
| url | (opcional) `isURL()` si presente |
| image | (opcional) `isURL()` si presente |

#### updateCourseRules
Mismos campos que createCourseRules pero todos opcionales.

#### forgotPasswordRules
| Campo | Reglas |
|-------|--------|
| email | `isEmail().normalizeEmail()` |

#### resetPasswordRules
| Campo | Reglas |
|-------|--------|
| token | `notEmpty()` |
| password | `isLength({ min: 8 })` |

#### changePasswordRules
| Campo | Reglas |
|-------|--------|
| currentPassword | `notEmpty()` |
| newPassword | `isLength({ min: 8 })` |

---

## 11. Servicios (2)

### 11.1 auditService.js

**Archivo:** `backend/src/services/auditService.js` — 9 líneas

```javascript
const logAction = async ({ action, entity, entityId, details, adminId, adminName }) => {
  return prisma.auditLog.create({
    data: { action, entity, entityId, details, adminId, adminName }
  });
};

module.exports = { logAction };
```

**Función:** `logAction({ action, entity, entityId?, details?, adminId, adminName? })`

Crea un registro de auditoría en la tabla `AuditLog`. Es llamado por el controlador de administración antes/después de acciones críticas como:
- Cambio de rol de usuario
- Eliminación de usuario
- Actualización/eliminación de empleos y cursos
- Cambio de estado de aplicaciones

### 11.2 emailService.js

**Archivo:** `backend/src/services/emailService.js` — 84 líneas

**Dependencia:** `resend` SDK (opcional — si no hay API key, loggea warning sin bloquear).

**Funciones exportadas:**

#### sendWelcome(to, name)
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `to` | String | Email del destinatario |
| `name` | String | Nombre del nuevo usuario |

**Contenido:** Email de bienvenida con saludo personalizado e información de la plataforma.

#### sendApplicationReceived(to, jobTitle, applicantName)
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `to` | String | Email de la empresa |
| `jobTitle` | String | Título del empleo |
| `applicantName` | String | Nombre del candidato |

**Contenido:** Notificación a la empresa de que un candidato ha aplicado a una oferta.

#### sendPasswordReset(to, name, resetUrl)
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `to` | String | Email del usuario |
| `name` | String | Nombre del usuario |
| `resetUrl` | String | URL de restablecimiento con token |

**Contenido:** Email estilizado con botón de "Restablecer contraseña" y enlace directo.

**Configuración:**
- Remitente: `onboarding@resend.dev` / `notifications@resend.dev`
- API Key: `RESEND_API_KEY` en variables de entorno
- **Graceful degradation:** Si el paquete `resend` falla al importar, o la API key no está configurada, los emails se saltan silenciosamente con un log de advertencia.

---

## 12. Controladores (6)

### 12.1 userController.js — 417 líneas — 14 funciones

**Archivo:** `backend/src/controllers/userController.js`

**Dependencias:** bcryptjs, crypto, prisma, jwt utils, emailService

#### register(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | POST |
| Ruta | `/api/users/register` |
| Body | `{ email, password, name }` |
| Autenticación | No |
| Validación | registerRules (email válido, password ≥ 6, name no vacío) |
| **Lógica:** | 1. Verifica email único → 409 si existe. 2. Hashea password (bcrypt, cost 10). 3. Crea User con role CANDIDATE por defecto. 4. Genera access + refresh token (login automático post-registro). 5. Crea LoginSession. 6. Envía email de bienvenida (no bloqueante — catch silencioso). |
| **Respuesta 201:** | `{ message, user: { id, email, name, role }, token, refreshToken }` |
| **Errores:** | 409 email duplicado |

#### login(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | POST |
| Ruta | `/api/users/login` |
| Body | `{ email, password }` |
| Autenticación | No |
| Validación | loginRules |
| **Lógica:** | 1. Busca User por email. 2. Compara password con bcrypt. 3. Genera access + refresh token. 4. Crea LoginSession (userId, userRole). 5. Retorna usuario (sin password) + tokens. |
| **Respuesta 200:** | `{ message, user: { id, email, name, role, createdAt }, token, refreshToken }` |
| **Errores:** | 401 email o password incorrectos |

#### refreshToken(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | POST |
| Ruta | `/api/users/refresh-token` |
| Body | `{ refreshToken }` |
| **Lógica:** | 1. Verifica refresh token JWT (type: 'refresh'). 2. Busca usuario por decoded.userId. 3. Genera nuevo par de tokens. |
| **Respuesta 200:** | `{ message, token, refreshToken, user }` |
| **Errores:** | 400 no se proporcionó token, 401 token inválido/expirado, 404 usuario no encontrado |

#### logout(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | POST |
| Ruta | `/api/users/logout` |
| Body | `{ sessionId? }` (opcional) |
| **Lógica:** | 1. Busca LoginSession más reciente del usuario sin logoutAt. 2. Si existe, actualiza logoutAt = now() y duration = diferencia en segundos. |
| **Respuesta 200:** | `{ message: "Sesión cerrada exitosamente" }` |

#### sessionStats(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | GET |
| Ruta | `/api/users/session-stats` |
| **Lógica:** | 1. Calcula duración promedio de sesiones agrupado por rol CANDIDATE vs COMPANY. 2. Usa agregación de Prisma con _avg. |
| **Respuesta 200:** | `{ candidates: number, companies: number }` (segundos promedio, 0 si no hay datos) |

#### getProfile(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | GET |
| Ruta | `/api/users/:id` |
| **Lógica:** | Busca usuario por ID, retorna { id, email, name, role, createdAt } |
| **Errores:** | 404 usuario no encontrado |

#### updateProfile(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | PUT |
| Ruta | `/api/users/:id` o `/api/users/profile/me` |
| Body | `{ name?, email? }` |
| **Lógica:** | 1. Verifica existencia. 2. Si cambia email, verifica unicidad. 3. Actualiza campos. |
| **Errores:** | 404 no encontrado, 409 email ya usado |

#### deleteAccount(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | DELETE |
| Ruta | `/api/users/:id` o `/api/users/account` |
| **Lógica:** | Verifica existencia y elimina usuario. |
| **Errores:** | 404 no encontrado |

#### forgotPassword(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | POST |
| Ruta | `/api/users/forgot-password` |
| Body | `{ email }` |
| **Lógica:** | 1. Genera token crypto aleatorio (32 bytes hex). 2. Almacena token + expiración (1 hora). 3. Envía email con enlace de restablecimiento. 4. Siempre responde igual (seguridad — no revela si el email existe). |
| **Respuesta 200:** | `{ message: "Si el email existe..." }` |

#### resetPassword(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | POST |
| Ruta | `/api/users/reset-password` |
| Body | `{ token, password }` |
| **Lógica:** | 1. Busca usuario con token válido y no expirado. 2. Hashea nueva password. 3. Limpia token y expiración. |
| **Errores:** | 400 token inválido o expirado |

#### changePassword(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | POST |
| Ruta | `/api/users/change-password` |
| Body | `{ currentPassword, newPassword }` |
| **Lógica:** | 1. Verifica password actual con bcrypt. 2. Hashea y guarda nueva password. |
| **Errores:** | 404 usuario no encontrado (vía req.user), 401 password actual incorrecta |

#### getCurriculum(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | GET |
| Ruta | `/api/users/curriculum` |
| **Lógica:** | Busca Curriculum por userId (req.user.id). Retorna null si no existe. |
| **Respuesta 200:** | `{ curriculum: { id, userId, data } \| null }` |

#### saveCurriculum(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | PUT |
| Ruta | `/api/users/curriculum` |
| Body | `{ data }` (objeto JSON con secciones del CV) |
| **Lógica:** | Upsert de Curriculum: crea si no existe, actualiza si ya existe. |
| **Respuesta 200:** | `{ message, curriculum }` |

### 12.2 jobController.js — 190 líneas — 5 funciones

**Archivo:** `backend/src/controllers/jobController.js`

**Exporta:** `{ list, detail, create, update, delete }` como objeto `jobController`.

#### list(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | GET |
| Ruta | `/api/jobs` |
| Query | `{ category?, location?, mode?, search?, page=1, limit=50 }` |
| **Paginación:** | limit máx 100. skip = (page-1) * limit |
| **Filtros:** | category exacto, location (contains, insensitive), mode exacto, search (title contains OR company contains) |
| **Incluye:** | author: { id, name, email } |
| **Orden:** | createdAt desc |
| **Respuesta 200:** | `{ data: Job[], total, page, limit, totalPages }` |

#### detail(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | GET |
| Ruta | `/api/jobs/:id` |
| **Incluye:** | author: { id, name, email } |
| **Errores:** | 404 no encontrado |

#### create(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | POST |
| Ruta | `/api/jobs` |
| Body | `{ title, company, location, salary?, description, requirements?, mode, category }` |
| **Roles permitidos:** | COMPANY_EMPLOYEES, COMPANY_STUDENTS, COMPANY_HYBRID, ADMIN |
| **Lógica:** | Crea Job con authorId = req.user.id |
| **Respuesta 201:** | `{ message, job }` |
| **Errores:** | 403 solo empresas pueden crear empleos |

#### update(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | PUT |
| Ruta | `/api/jobs/:id` |
| Body | Campos a actualizar |
| **Autorización:** | ADMIN siempre puede. COMPANY debe ser authorId === req.user.id |
| **Campos permitidos:** | title, company, location, salary, description, requirements, mode, category |
| **Respuesta 200:** | `{ message, job }` |
| **Errores:** | 400 no hay campos válidos, 404 no encontrado, 403 no autorizado |

#### delete(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | DELETE |
| Ruta | `/api/jobs/:id` |
| **Autorización:** | ADMIN siempre. COMPANY debe ser authorId === req.user.id |
| **Respuesta 200:** | `{ message: "Empleo eliminado exitosamente" }` |
| **Errores:** | 404 no encontrado, 403 no autorizado |

### 12.3 courseController.js — 190 líneas — 5 funciones

**Archivo:** `backend/src/controllers/courseController.js`

**Exporta:** `{ list, detail, create, update, delete }` como objeto `courseController`.

Estructura y permisos idénticos a jobController pero para la entidad Course.

#### list(req, res, next)
| Query | Descripción |
|-------|-------------|
| `category?` | Filtro exacto |
| `level?` | Filtro exacto (BEGINNER/INTERMEDIATE/ADVANCED) |
| `search?` | Búsqueda en title y provider |
| `page=1, limit=50` | Paginación |

#### create(req, res, next)
| Body | Descripción |
|------|-------------|
| `{ title, provider, description, category, level?, duration?, price?, url?, image? }` | level por defecto BEGINNER |
| **Roles:** | COMPANY_EMPLOYEES, COMPANY_STUDENTS, COMPANY_HYBRID, ADMIN |

### 12.4 applicationController.js — 204 líneas — 5 funciones

**Archivo:** `backend/src/controllers/applicationController.js`

**Exporta:** `{ create, myApplications, jobApplications, updateStatus, cancel }`

#### create(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | POST |
| Ruta | `/api/applications` |
| Body | `{ jobId, message? }` |
| **Roles permitidos:** | CANDIDATE, ADMIN |
| **Lógica:** | 1. Verifica que el Job existe (incluye author para email). 2. Verifica que no exista aplicación previa (unique userId+jobId). 3. Crea Application. 4. Notifica a la empresa por email (no bloqueante). |
| **Respuesta 201:** | `{ message, application }` |
| **Errores:** | 404 job no encontrado, 403 solo candidatos, 409 ya aplicaste |

#### myApplications(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | GET |
| Ruta | `/api/applications/my` |
| **Descripción:** | Lista todas las aplicaciones del usuario autenticado. Incluye job: { id, title, company, location }. |
| **Respuesta 200:** | `Application[]` |

#### jobApplications(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | GET |
| Ruta | `/api/applications/job/:jobId` |
| **Autorización:** | Solo el autor del Job o ADMIN puede ver las aplicaciones. |
| **Incluye:** | user: { id, name, email } |
| **Errores:** | 404 job no encontrado, 403 no autorizado |

#### updateStatus(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | PUT |
| Ruta | `/api/applications/:id/status` |
| Body | `{ status }` — debe ser PENDING, ACCEPTED o REJECTED |
| **Autorización:** | Autor del Job o ADMIN |
| **Errores:** | 400 status inválido, 404 no encontrado, 403 no autorizado |

#### cancel(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | DELETE |
| Ruta | `/api/applications/:id` |
| **Autorización:** | Solicitante de la aplicación (userId) o ADMIN |
| **Errores:** | 404 no encontrado, 403 no autorizado |

### 12.5 courseApplicationController.js — 121 líneas — 4 funciones

**Archivo:** `backend/src/controllers/courseApplicationController.js`

**Exporta:** `{ create, myApplications, updateStatus, cancel }`

#### create(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| Método | POST |
| Ruta | `/api/course-applications` |
| Body | `{ courseId, message? }` |
| **Roles permitidos:** | CANDIDATE, ADMIN |
| **Lógica:** | Verifica unicidad (userId+courseId). No incluye validación de existencia del Course. |
| **Errores:** | 403 solo candidatos, 409 ya inscrito |

#### updateStatus(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| **Autorización:** | Solo ADMIN (a diferencia de applicationController que permite al autor del Job) |
| **Body:** | `{ status: PENDING | ACCEPTED | REJECTED }` |

### 12.6 adminController.js — 845 líneas — 12 funciones + endpoint runTests

**Archivo:** `backend/src/controllers/adminController.js`

**Dependencias:** prisma, auditService, child_process (runTests)

#### getDashboardStats(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| **Descripción:** | Agrega estadísticas completas del sistema en una sola respuesta. |
| **Consultas (10):** | usersByRole (groupBy), totalUsers, totalJobs, totalCourses, totalApplications, applicationsByStatus (groupBy), jobsByCategory (groupBy), coursesByLevel (groupBy), recentUsers (30d), recentJobs (30d), recentApplications (30d) |
| **Respuesta 200:** | `{ success, stats: { totals, usersByRole, applicationsByStatus, jobsByCategory, coursesByLevel, recentActivity } }` |

#### getAllUsers(req, res, next)
| Query | Filtros |
|-------|---------|
| `role?` | Filtro exacto por rol |
| `search?` | Búsqueda en name o email (contains, insensitive) |
| `page=1, limit=20` | Paginación (limit max 100) |
| **Incluye:** | _count de jobs, courses, applications |
| **Respuesta:** | `{ success, users, pagination: { page, limit, total, totalPages } }` |

#### getUserDetails(req, res, next)
| **Descripción:** | Usuario singular con sus empleos, cursos y aplicaciones (cada aplicación incluye detalles del job) |
| **Errores:** | 404 no encontrado |

#### updateUserRole(req, res, next)
| Body | `{ role }` — debe ser uno de: CANDIDATE, COMPANY_EMPLOYEES, COMPANY_STUDENTS, COMPANY_HYBRID, ADMIN |
| **Seguridad:** | Bloquea auto-cambio de rol (no puedes cambiarte el rol a ti mismo) |
| **Auditoría:** | logAction con detalles del cambio |
| **Errores:** | 400 rol inválido, 403 no puedes cambiar tu propio rol, 404 no encontrado |

#### deleteUserAsAdmin(req, res, next)
| **Seguridad:** | Bloquea auto-eliminación |
| **Auditoría:** | logAction con datos completos del usuario eliminado |
| **Errores:** | 403 no puedes eliminarte a ti mismo, 404 no encontrado |

#### getAllJobs(req, res, next)
| Query | `{ category?, search?, page=1, limit=20 }` |
| **Incluye:** | author (id, name, email), _count de applications |
| **Respuesta:** | `{ success, jobs, pagination }` |

#### updateJobAsAdmin(req, res, next)
| **Campos permitidos:** | title, company, location, salary, description, requirements, mode, category |
| **Auditoría:** | logAction con título del empleo |
| **Errores:** | 404 no encontrado |

#### deleteJobAsAdmin(req, res, next)
| **Auditoría:** | logAction con título del empleo |
| **Errores:** | 404 no encontrado |

#### getAllCourses(req, res, next)
| Query | `{ category?, level?, search?, page=1, limit=20 }` |
| **Respuesta:** | `{ success, courses, pagination }` |

#### updateCourseAsAdmin(req, res, next)
| **Campos permitidos:** | title, provider, description, category, level, duration, price, url, image |
| **Auditoría:** | logAction |
| **Errores:** | 404 no encontrado |

#### deleteCourseAsAdmin(req, res, next)
| **Auditoría:** | logAction |
| **Errores:** | 404 no encontrado |

#### getAllApplications(req, res, next)
| Query | `{ status?, page=1, limit=20 }` |
| **Incluye:** | user (id, name, email), job (id, title, company, author con id, name, email) |
| **Respuesta:** | `{ success, applications, pagination }` |

#### updateApplicationStatusAsAdmin(req, res, next)
| Body | `{ status }` — PENDING, ACCEPTED o REJECTED |
| **Auditoría:** | logAction con estado anterior → nuevo y título del empleo |
| **Errores:** | 400 status inválido, 404 no encontrado |

#### runTests(req, res, next)
| Aspecto | Detalle |
|---------|---------|
| **Seguridad:** | Bloqueado en producción (NODE_ENV=production) |
| **Lógica:** | Ejecuta `vitest run --reporter=json` como child_process. Parsea stdout JSON con resultados. |
| **Respuesta:** | `{ success, total, passed, failed, duration, suites[] }` |
| **Errores:** | 403 solo en desarrollo, 500 error al ejecutar tests |

#### getAuditLogs(req, res, next)
| Query | `{ page=1, limit=50 }` |
| **Orden:** | createdAt desc |
| **Respuesta:** | `{ success, logs, pagination }` |

---

## 13. Rutas (6) — 40 endpoints

### 13.1 userRoutes.js — 16 endpoints

**Archivo:** `backend/src/routes/userRoutes.js`

| Método | Ruta | Middleware | Controlador |
|--------|------|-----------|-------------|
| POST | `/register` | authLimiter, registerRules | register |
| POST | `/login` | authLimiter, loginRules | login |
| POST | `/refresh-token` | authLimiter | refreshToken |
| POST | `/forgot-password` | authLimiter, forgotPasswordRules | forgotPassword |
| POST | `/reset-password` | authLimiter, resetPasswordRules | resetPassword |
| GET | `/profile/me` | authMiddleware | inline (req.user) |
| PUT | `/profile/me` | authMiddleware, updateProfileRules | updateProfile |
| POST | `/logout` | authMiddleware | logout |
| GET | `/session-stats` | authMiddleware | sessionStats |
| POST | `/change-password` | authMiddleware, changePasswordRules | changePassword |
| GET | `/curriculum` | authMiddleware | getCurriculum |
| PUT | `/curriculum` | authMiddleware | saveCurriculum |
| DELETE | `/account` | authMiddleware | deleteAccount |
| GET | `/:id` | authMiddleware, ownerMiddleware | getProfile |
| PUT | `/:id` | authMiddleware, ownerMiddleware, updateProfileRules | updateProfile |
| DELETE | `/:id` | authMiddleware, adminMiddleware | deleteAccount |

### 13.2 jobRoutes.js — 5 endpoints

**Archivo:** `backend/src/routes/jobRoutes.js`

| Método | Ruta | Middleware | Controlador |
|--------|------|-----------|-------------|
| GET | `/` | — | list |
| GET | `/:id` | — | detail |
| POST | `/` | authMiddleware, createJobRules | create |
| PUT | `/:id` | authMiddleware, updateJobRules | update |
| DELETE | `/:id` | authMiddleware | delete |

### 13.3 courseRoutes.js — 5 endpoints

**Archivo:** `backend/src/routes/courseRoutes.js`

| Método | Ruta | Middleware | Controlador |
|--------|------|-----------|-------------|
| GET | `/` | — | list |
| GET | `/:id` | — | detail |
| POST | `/` | authMiddleware, createCourseRules | create |
| PUT | `/:id` | authMiddleware, updateCourseRules | update |
| DELETE | `/:id` | authMiddleware | delete |

### 13.4 applicationRoutes.js — 5 endpoints

**Archivo:** `backend/src/routes/applicationRoutes.js`

| Método | Ruta | Middleware | Controlador |
|--------|------|-----------|-------------|
| POST | `/` | authMiddleware | create |
| GET | `/my` | authMiddleware | myApplications |
| GET | `/job/:jobId` | authMiddleware | jobApplications |
| PUT | `/:id/status` | authMiddleware | updateStatus |
| DELETE | `/:id` | authMiddleware | cancel |

### 13.5 courseApplicationRoutes.js — 4 endpoints

**Archivo:** `backend/src/routes/courseApplicationRoutes.js`

| Método | Ruta | Middleware | Controlador |
|--------|------|-----------|-------------|
| POST | `/` | authMiddleware | create |
| GET | `/my` | authMiddleware | myApplications |
| PUT | `/:id/status` | authMiddleware | updateStatus |
| DELETE | `/:id` | authMiddleware | cancel |

### 13.6 adminRoutes.js — 15 endpoints

**Archivo:** `backend/src/routes/adminRoutes.js`

Todas las rutas usan `router.use(authMiddleware, adminMiddleware)` — no se repite en cada ruta.

| Método | Ruta | Controlador |
|--------|------|-------------|
| GET | `/dashboard` | getDashboardStats |
| GET | `/users` | getAllUsers |
| GET | `/users/:id` | getUserDetails |
| PUT | `/users/:id/role` | updateUserRole |
| DELETE | `/users/:id` | deleteUserAsAdmin |
| GET | `/jobs` | getAllJobs |
| PUT | `/jobs/:id` | updateJobAsAdmin |
| DELETE | `/jobs/:id` | deleteJobAsAdmin |
| GET | `/courses` | getAllCourses |
| PUT | `/courses/:id` | updateCourseAsAdmin |
| DELETE | `/courses/:id` | deleteCourseAsAdmin |
| GET | `/applications` | getAllApplications |
| PUT | `/applications/:id/status` | updateApplicationStatusAsAdmin |
| GET | `/audit-logs` | getAuditLogs |
| GET | `/tests/run` | runTests |

---

## 14. Tests (6 archivos — 29 tests)

### 14.1 Estrategia de testing

| Aspecto | Detalle |
|---------|---------|
| Framework | Vitest 1.6.1 |
| Configuración | `globals: true, environment: 'node'` |
| Patrón de mocking | `require.cache` (no `vi.mock` — no funciona con CJS en Vitest 1.6.1) |
| Base de datos | No se usa BD real — todos los modelos Prisma se mockean |
| Autenticación | Se mockea req.user directamente |

### 14.2 userController.test.js — 6 tests

| # | Test | Descripción |
|---|------|-------------|
| 1 | creates user successfully with valid data | POST /register → 201 con token |
| 2 | rejects duplicate email | POST /register con email existente → 409 |
| 3 | logs in with valid credentials | POST /login → 200 con tokens |
| 4 | rejects login with wrong password | POST /login con password incorrecto → 401 |
| 5 | rejects login with non-existent email | POST /login con email no registrado → 401 |
| 6 | requires authentication for profile | GET /profile/me sin token → 401 |

### 14.3 jobController.test.js — 4 tests

| # | Test | Descripción |
|---|------|-------------|
| 1 | lists jobs with pagination | GET /api/jobs → 200 con datos paginados |
| 2 | creates job as company | POST /api/jobs como COMPANY → 201 |
| 3 | rejects job creation by candidate | POST /api/jobs como CANDIDATE → 403 |
| 4 | returns 404 for non-existent job | GET /api/jobs/:id inexistente → 404 |

### 14.4 courseController.test.js — 4 tests

| # | Test | Descripción |
|---|------|-------------|
| 1 | lists courses with pagination | GET /api/courses → 200 |
| 2 | creates course as company | POST /api/courses como COMPANY_STUDENTS → 201 |
| 3 | rejects course creation by candidate | POST /api/courses como CANDIDATE → 403 |
| 4 | returns 404 for non-existent course | GET /api/courses/:id inexistente → 404 |

### 14.5 applicationController.test.js — 6 tests

| # | Test | Descripción |
|---|------|-------------|
| 1 | returns 404 for non-existent job | POST con jobId inexistente → 404 |
| 2 | returns 409 for duplicate application | POST con jobId ya aplicado → 409 |
| 3 | creates application successfully | POST con datos válidos → 201 |
| 4 | lists my applications | GET /my → 200 |
| 5 | rejects invalid status update | PUT /:id/status con status inválido → 400 |
| 6 | returns 404 when cancelling non-existent | DELETE /:id inexistente → 404 |

### 14.6 adminController.test.js — 5 tests

| # | Test | Descripción |
|---|------|-------------|
| 1 | returns aggregated dashboard stats | GET /dashboard → 200 con stats |
| 2 | returns paginated users | GET /users → 200 con paginación |
| 3 | returns 404 when deleting non-existent user | DELETE /users/:id inexistente → 404 |
| 4 | blocks running tests in production | GET /tests/run con NODE_ENV=production → 403 |
| 5 | returns audit log entries | GET /audit-logs → 200 |

### 14.7 authMiddleware.test.js — 4 tests

| # | Test | Descripción |
|---|------|-------------|
| 1 | passes with valid token | Token válido → next() llamado |
| 2 | rejects invalid token | Token mal formado → 401 |
| 3 | rejects expired token | Token expirado → 401 |
| 4 | rejects missing token | Sin header Authorization → 401 |

---

## 15. Scripts (2)

### 15.1 generateSpanishData.js

**Archivo:** `backend/scripts/generateSpanishData.js` — 408 líneas

**Propósito:** Genera datos realistas españoles para poblar el frontend.

**Modos de ejecución:**
| Comando | Acción |
|---------|--------|
| `node scripts/generateSpanishData.js` | Genera JSONs en `frontend/src/data/jobs.json` y `frontend/src/data/courses.json` |
| `node scripts/generateSpanishData.js --seed` | Genera JSONs + imprime instrucciones para seed en BD |
| `node scripts/generateSpanishData.js --db-only` | Solo imprime instrucciones para seed en BD |

**Datos generados:**
- 350 empleos españoles con: 50 provincias, 13 sectores, títulos realistas, empresas, descripciones, requisitos, salarios
- 150 cursos con: instituciones (universidades, plataformas), niveles, duraciones, precios, instructores

### 15.2 seedDemoUsers.js

**Archivo:** `backend/scripts/seedDemoUsers.js` — 83 líneas

**Propósito:** Seed rápido de 5 usuarios demo usando `prisma.user.upsert`.

| Email | Contraseña | Nombre | Rol |
|-------|-----------|--------|-----|
| admin@laboria.com | admin123 | Administrador Laboria | ADMIN |
| candidate@laboria.com | candidate123 | Juan Pérez | CANDIDATE |
| company@laboria.com | company123 | Tech Solutions S.A. | COMPANY_EMPLOYEES |
| recruiter@laboria.com | recruiter123 | María González | COMPANY_STUDENTS |
| hybrid@laboria.com | hybrid123 | Carlos Rodríguez | COMPANY_HYBRID |

---

## 16. Configuración adicional

### 16.1 Variables de entorno

**Archivo:** `backend/.env.example`

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/laboria
JWT_SECRET=tu-secreto-jwt-aqui
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://localhost:4173
NODE_ENV=development
PORT=3000
# RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
```

### 16.2 Vitest config

**Archivo:** `backend/vitest.config.js`

```javascript
const { defineConfig } = require('vitest/config');
module.exports = defineConfig({
  test: { globals: true, environment: 'node' }
});
```

### 16.3 Dockerfile

**Archivo:** `backend/Dockerfile`

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
COPY prisma/schema.prisma ./prisma/
RUN npx prisma generate
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## Resumen de métricas del backend

| Métrica | Valor |
|---------|-------|
| Líneas totales | ~2.500+ (sin node_modules) |
| Archivos fuente | 20 |
| Controladores | 6 (45 funciones exportadas) |
| Middleware | 6 (3 autorización, 1 errores, 1 rate-limit, 1 validación) |
| Servicios | 2 (auditoría, email) |
| Rutas | 6 (40 endpoints total) |
| Modelos BD | 8 |
| Enums BD | 4 |
| Migraciones | 8 |
| Tests | 6 archivos (29 tests) |
| Dependencias | 11 producción + 2 desarrollo |

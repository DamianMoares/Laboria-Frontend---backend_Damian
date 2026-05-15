# Volumen 2: Base de Datos

## Índice del volumen

1. [Esquema Prisma (`schema.prisma`)](#1-esquema-prisma)
2. [Modelo User](#2-modelo-user)
3. [Modelo Job](#3-modelo-job)
4. [Modelo Course](#4-modelo-course)
5. [Modelo Application](#5-modelo-application)
6. [Enumeraciones](#6-enumeraciones)
7. [Migraciones](#7-migraciones)
8. [Seed de datos](#8-seed-de-datos)
9. [Estrategia de almacenamiento de perfil](#9-estrategia-de-almacenamiento-de-perfil)

---

## 1. Esquema Prisma

**Archivo:** `backend/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Detalle de configuración:**

| Elemento | Valor | Explicación |
|---|---|---|
| `generator client` | `prisma-client-js` | Genera el cliente TypeScript/JavaScript para interactuar con la BD |
| `datasource provider` | `postgresql` | Motor de base de datos. Originalmente era `sqlite`, se migró a PostgreSQL |
| `datasource url` | `env("DATABASE_URL")` | Lee la cadena de conexión de la variable de entorno. En desarrollo: `postgresql://postgres:pass@localhost:5432/laboria`. En Render: la provee el servicio `laboria-db` |

---

## 2. Modelo User

```prisma
model User {
  id           String        @id @default(uuid())
  email        String        @unique
  password     String
  name         String
  role         Role          @default(CANDIDATE)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  applications Application[]
  courses      Course[]
  jobs         Job[]
}
```

**Campos:**

| Campo | Tipo | Atributos | Descripción |
|---|---|---|---|
| `id` | `String` (UUID) | `@id @default(uuid())` | Identificador único universal |
| `email` | `String` | `@unique` | Email del usuario (único en el sistema) |
| `password` | `String` | — | Hash bcrypt de la contraseña |
| `name` | `String` | — | Nombre completo. Para candidatos: "Nombre Apellido". Para empresas: nombre de la empresa |
| `role` | `Role` (enum) | `@default(CANDIDATE)` | Rol del usuario (ver sección de enums) |
| `createdAt` | `DateTime` | `@default(now())` | Fecha de creación |
| `updatedAt` | `DateTime` | `@updatedAt` | Fecha de última actualización (automático) |

**Relaciones:**

| Relación | Modelo | Descripción |
|---|---|---|
| `applications` | `Application[]` | Aplicaciones a empleos que ha hecho el usuario |
| `courses` | `Course[]` | Cursos que ha publicado el usuario (solo empresas) |
| `jobs` | `Job[]` | Empleos que ha publicado el usuario (solo empresas) |

---

## 3. Modelo Job

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
}
```

**Campos:**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | UUID | Sí | Identificador único |
| `title` | String | Sí | Título del puesto |
| `company` | String | Sí | Nombre de la empresa |
| `location` | String | Sí | Ubicación (ej: "Madrid, España" o "Remoto") |
| `salary` | String? | No | Rango salarial (ej: "30000-40000€") |
| `description` | String | Sí | Descripción detallada del puesto |
| `requirements` | String? | No | Requisitos del puesto |
| `mode` | WorkMode | No (default: REMOTE) | Modalidad: REMOTE, HYBRID, ONSITE |
| `category` | String | Sí | Categoría (ej: "Tecnología", "Salud") |
| `authorId` | String | Sí | ID del usuario que publicó el empleo |

**Relaciones:**

| Relación | Descripción |
|---|---|
| `author` → `User` | El usuario (empresa) que publicó este empleo |
| `applications` → `Application[]` | Aplicaciones recibidas para este empleo |

---

## 4. Modelo Course

```prisma
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
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
}
```

**Campos:**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | UUID | Sí | Identificador único |
| `title` | String | Sí | Título del curso |
| `provider` | String | Sí | Proveedor/institución |
| `description` | String | Sí | Descripción del curso |
| `category` | String | Sí | Categoría |
| `level` | Level | No (default: BEGINNER) | Nivel: BEGINNER, INTERMEDIATE, ADVANCED |
| `duration` | String? | No | Duración (ej: "8 semanas") |
| `price` | String? | No | Precio (ej: "Gratis" o "99€") |
| `url` | String? | No | Enlace al curso |
| `image` | String? | No | URL de imagen del curso |

---

## 5. Modelo Application

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
}
```

**Campos:**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | UUID | Sí | Identificador único |
| `status` | ApplicationStatus | No (default: PENDING) | Estado: PENDING, ACCEPTED, REJECTED |
| `message` | String? | No | Mensaje del candidato al aplicar |
| `userId` | String | Sí | ID del candidato que aplica |
| `jobId` | String | Sí | ID del empleo al que aplica |

**Restricción única compuesta:**

```prisma
@@unique([userId, jobId])
```

Un candidato solo puede aplicar **una vez** al mismo empleo. Si intenta aplicar de nuevo, la BD devuelve error 409.

**Relaciones:**

| Relación | Descripción |
|---|---|
| `user` → `User` | El candidato que aplicó |
| `job` → `Job` | El empleo al que aplicó |

---

## 6. Enumeraciones

### Role

```prisma
enum Role {
  CANDIDATE          // Candidato buscando empleo
  COMPANY_EMPLOYEES  // Empresa que busca empleados
  COMPANY_STUDENTS   // Empresa que busca estudiantes
  COMPANY_HYBRID     // Empresa híbrida (empleados + estudiantes)
  ADMIN              // Administrador del sistema
}
```

### WorkMode

```prisma
enum WorkMode {
  REMOTE  // Trabajo remoto
  HYBRID  // Trabajo híbrido (presencial + remoto)
  ONSITE  // Trabajo presencial
}
```

### Level

```prisma
enum Level {
  BEGINNER      // Principiante
  INTERMEDIATE  // Intermedio
  ADVANCED      // Avanzado
}
```

### ApplicationStatus

```prisma
enum ApplicationStatus {
  PENDING   // Pendiente de revisión
  ACCEPTED  // Aceptada
  REJECTED  // Rechazada
}
```

---

## 7. Migraciones

**Ubicación:** `backend/prisma/migrations/`

Las migraciones son generadas por Prisma cuando el esquema cambia.

### Crear una migración

```bash
cd backend
npx prisma migrate dev --name descripcion_del_cambio
```

Esto:
1. Compara el esquema actual con el estado de la BD
2. Genera el SQL necesario en `prisma/migrations/`
3. Lo aplica a la BD local
4. Regenera Prisma Client

### Aplicar migraciones en producción

```bash
npx prisma migrate deploy
```

Este comando se ejecuta automáticamente en Render durante el build.

### Migración inicial

La migración `20260515084230_init` crea las 4 tablas (`User`, `Job`, `Course`, `Application`) y sus relaciones.

---

## 8. Seed de datos

**Archivo:** `backend/prisma/seed.js`

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const demoAccounts = [
    { email: 'admin@laboria.com', password: 'admin123', name: 'Admin Laboria', role: 'ADMIN' },
    { email: 'candidate@laboria.com', password: 'candidate123', name: 'Carlos García', role: 'CANDIDATE' },
    { email: 'company@laboria.com', password: 'company123', name: 'TechCorp Solutions', role: 'COMPANY_EMPLOYEES' },
    { email: 'recruiter@laboria.com', password: 'recruiter123', name: 'EduNext Academy', role: 'COMPANY_STUDENTS' },
    { email: 'hybrid@laboria.com', password: 'hybrid123', name: 'InnovaGroup', role: 'COMPANY_HYBRID' },
  ];

  for (const acc of demoAccounts) {
    const hashed = await bcrypt.hash(acc.password, 10);
    await prisma.user.upsert({
      where: { email: acc.email },
      update: {},
      create: { email: acc.email, password: hashed, name: acc.name, role: acc.role },
    });
  }
  // ...
}
```

**Detalle del proceso:**

| Paso | Descripción |
|---|---|
| 1. Hash | Cada contraseña se hashea con bcrypt (10 rondas) |
| 2. Upsert | `prisma.user.upsert()` — si el email ya existe, no hace nada; si no, crea el usuario |
| 3. Resultado | 5 cuentas demo con nombres reales (no genéricos) |

**Cuentas creadas:**

| Email | Contraseña | Nombre visible | Rol |
|---|---|---|---|
| `admin@laboria.com` | `admin123` | Admin Laboria | ADMIN |
| `candidate@laboria.com` | `candidate123` | Carlos García | CANDIDATE |
| `company@laboria.com` | `company123` | TechCorp Solutions | COMPANY_EMPLOYEES |
| `recruiter@laboria.com` | `recruiter123` | EduNext Academy | COMPANY_STUDENTS |
| `hybrid@laboria.com` | `hybrid123` | InnovaGroup | COMPANY_HYBRID |

**Ejecutar el seed:**

```bash
# Local
cd backend && node prisma/seed.js

# En Render (después del deploy)
# Dashboard → Shell → node prisma/seed.js
```

---

## 9. Estrategia de almacenamiento de perfil

### Limitación del modelo actual

El modelo `User` solo tiene estos campos: `id, email, password, name, role`. No existe un modelo `Profile` que almacene datos como `firstName`, `lastName`, `companyName`, `industry`, `bio`, `skills`, etc.

### Solución implementada

Los datos extendidos del perfil se almacenan en **localStorage del navegador** bajo la clave:

```
profile_{userId}
```

**Ejemplo de estructura guardada:**

```javascript
// Para candidato:
{
  firstName: "Carlos",
  lastName: "García",
  email: "candidate@laboria.com",
  phone: "+34 600 000 000",
  location: "Madrid",
  bio: "Desarrollador full stack...",
  experience: "3-5 años",
  salaryExpectation: "35000-45000€",
  workModePreference: "Remoto",
  linkedin: "https://linkedin.com/in/carlos",
  github: "https://github.com/carlos",
  portfolio: "https://carlos.dev"
}

// Para empresa:
{
  companyName: "EduNext Academy",
  email: "recruiter@laboria.com",
  phone: "+34 600 000 000",
  location: "Barcelona",
  industry: "Educación",
  size: "11-50",
  website: "https://edunext.com",
  description: "Plataforma de formación online...",
  focus: "estudiantes"
}
```

### Flujo de sincronización

```
Login/Registro
    │
    ▼
AuthContext.seedProfile()
  └─ ¿Ya existe profile_{userId} en localStorage?
       ├─ Sí → no hacer nada
       └─ No → crear perfil inicial con datos de user.name/user.email
    │
    ▼
EditProfileModal (guardar)
  ├─ Guarda TODOS los campos en localStorage (profile_{userId})
  └─ Envía solo { name, email } a PUT /users/profile/me (backend)
    │
    ▼
ProfilePages / DashboardPage
  └─ Lee de localStorage (profile_{userId})
     └─ Fallback → user.profile (objeto vacío)
        └─ Fallback → user.name
```

### ¿Por qué esta solución?

| Razón | Explicación |
|---|---|
| El backend no tiene modelo Profile | El controlador `updateProfile` solo actualiza `name` y `email` |
| Datos del perfil son solo frontend | Phone, bio, skills, etc. no se usan en el backend |
 | Persistencia entre sesiones | localStorage conserva los datos aunque el usuario cierre el navegador |
| Portabilidad | Si el usuario cambia de dispositivo, pierde los datos. Es una limitación conocida |

### Mejora futura recomendada

Crear un modelo `Profile` en Prisma:

```prisma
model Profile {
  id        String @id @default(uuid())
  userId    String @unique
  user      User   @relation(fields: [userId], references: [id])
  firstName String?
  lastName  String?
  companyName String?
  phone     String?
  location  String?
  bio       String?
  industry  String?
  // ... resto de campos
}
```

Y migrar todos los datos de localStorage a la BD.

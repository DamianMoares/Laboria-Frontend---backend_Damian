# Modelo de Datos

> **Documento:** 03-MODELO-DATOS.md  
> **Versión:** 2.0  
> **Fecha:** Mayo 2026

---

## 1. Diagrama de relaciones

```
  +----------+         +---------------+         +------------+
  |   User   |1---N    | Application   |N---1    |    Job     |
  +----------+         +---------------+         +------------+
       |                      |
       |1                     |N
       |                      |
       |1---N   +---------------+         +------------+
       +--------|CourseApp      |N---1    |   Course   |
                +---------------+         +------------+
       |
       |1---1   +------------+
       +--------| Curriculum |
                +------------+
       |
       |1---N   +-------------+
       +--------| LoginSession|
                +-------------+
       |
       |1---N   +-----------+
       +--------| AuditLog  |
                +-----------+
```

---

## 2. Modelos

### 2.1 User
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, default uuid | Identificador único |
| email | String | Unique, not null | Email del usuario |
| password | String | not null | Hash bcrypt |
| name | String | not null | Nombre completo |
| role | Role enum | not null, default CANDIDATE | Rol del usuario |
| resetPasswordToken | String? | nullable | Token para reset |
| resetPasswordExpires | DateTime? | nullable | Expiración del token |
| createdAt | DateTime | default now | Fecha de registro |
| updatedAt | DateTime | auto update | Última modificación |

**Relaciones:** Application[], CourseApplication[], Course[], Job[], LoginSession[], Curriculum?, AuditLog[]

### 2.2 Job
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, default uuid | Identificador único |
| title | String | not null | Título del empleo |
| company | String | not null | Nombre de la empresa |
| location | String | not null | Ubicación |
| salary | String? | nullable | Rango salarial |
| description | String | not null | Descripción del puesto |
| requirements | String? | nullable | Requisitos |
| mode | WorkMode enum | not null | Modalidad (REMOTE/HYBRID/ONSITE) |
| category | String | not null | Categoría profesional |
| createdAt | DateTime | default now | Fecha de publicación |
| updatedAt | DateTime | auto update | Última modificación |
| authorId | UUID | FK -> User | Autor/publicador |

**Relaciones:** Application[], author -> User  
**Índices:** category, location, mode, authorId, createdAt

### 2.3 Course
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, default uuid | Identificador único |
| title | String | not null | Título del curso |
| provider | String | not null | Proveedor/institución |
| description | String | not null | Descripción |
| category | String | not null | Categoría |
| level | Level enum | not null | Nivel (BEGINNER/INTERMEDIATE/ADVANCED) |
| duration | String? | nullable | Duración estimada |
| price | String? | nullable | Precio o "Gratuito" |
| url | String? | nullable | Enlace al curso |
| image | String? | nullable | URL de imagen |
| createdAt | DateTime | default now | Fecha de publicación |
| updatedAt | DateTime | auto update | Última modificación |
| authorId | UUID | FK -> User | Autor/publicador |

**Relaciones:** CourseApplication[], author -> User  
**Índices:** category, level, authorId, createdAt

### 2.4 Application
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, default uuid | Identificador único |
| status | ApplicationStatus | default PENDING | Estado (PENDING/ACCEPTED/REJECTED) |
| message | String? | nullable | Mensaje del candidato |
| createdAt | DateTime | default now | Fecha de aplicación |
| updatedAt | DateTime | auto update | Última modificación |
| userId | UUID | FK -> User | Candidato |
| jobId | UUID | FK -> Job | Empleo |

**Unique:** [userId, jobId]  
**Índices:** status, (userId, jobId) unique

### 2.5 CourseApplication
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, default uuid | Identificador único |
| status | ApplicationStatus | default PENDING | Estado |
| message | String? | nullable | Mensaje del candidato |
| createdAt | DateTime | default now | Fecha de inscripción |
| updatedAt | DateTime | auto update | Última modificación |
| userId | UUID | FK -> User | Candidato |
| courseId | UUID | FK -> Course | Curso |

**Unique:** [userId, courseId]  
**Índices:** status, (userId, courseId) unique

### 2.6 LoginSession
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, default uuid | Identificador único |
| userId | UUID | FK -> User | Usuario |
| userRole | Role enum | not null | Rol al momento del login |
| loginAt | DateTime | default now | Inicio de sesión |
| logoutAt | DateTime? | nullable | Cierre de sesión |
| duration | Int? | nullable | Duración en segundos |

**Índices:** userId, loginAt

### 2.7 Curriculum
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, default uuid | Identificador único |
| userId | UUID | FK -> User, unique | Usuario (1:1) |
| data | Json | not null | Datos del CV |
| createdAt | DateTime | default now | Fecha de creación |
| updatedAt | DateTime | auto update | Última modificación |

### 2.8 AuditLog
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, default uuid | Identificador único |
| action | String | not null | Acción realizada |
| entity | String | not null | Entidad afectada |
| entityId | String? | nullable | ID de la entidad |
| details | Json? | nullable | Detalles adicionales |
| adminId | UUID | FK -> User | Admin que ejecutó |
| adminName | String? | nullable | Nombre del admin |
| createdAt | DateTime | default now | Fecha |

**Índices:** adminId, [entity, entityId]

---

## 3. Enumeraciones

| Enum | Valores | Uso |
|------|---------|-----|
| **Role** | CANDIDATE, COMPANY_EMPLOYEES, COMPANY_STUDENTS, COMPANY_HYBRID, ADMIN | User.role, LoginSession.userRole |
| **WorkMode** | REMOTE, HYBRID, ONSITE | Job.mode |
| **Level** | BEGINNER, INTERMEDIATE, ADVANCED | Course.level |
| **ApplicationStatus** | PENDING, ACCEPTED, REJECTED | Application.status, CourseApplication.status |

---

## 4. Índices (11 total)

| Tabla | Índice | Tipo | Propósito |
|-------|--------|------|-----------|
| Job | category | B-tree | Filtrado por categoría |
| Job | location | B-tree | Filtrado por ubicación |
| Job | mode | B-tree | Filtrado por modalidad |
| Job | authorId | B-tree | Búsqueda por autor |
| Job | createdAt | B-tree | Ordenación por fecha |
| Course | category | B-tree | Filtrado por categoría |
| Course | level | B-tree | Filtrado por nivel |
| Course | authorId | B-tree | Búsqueda por autor |
| Course | createdAt | B-tree | Ordenación por fecha |
| Application | status | B-tree | Filtrado por estado |
| Application | [userId, jobId] | Unique | Evitar duplicados |
| CourseApplication | status | B-tree | Filtrado por estado |
| CourseApplication | [userId, courseId] | Unique | Evitar duplicados |
| AuditLog | adminId | B-tree | Búsqueda por admin |
| AuditLog | [entity, entityId] | B-tree | Búsqueda por entidad |
| LoginSession | userId | B-tree | Sesiones por usuario |
| LoginSession | loginAt | B-tree | Ordenación por fecha |

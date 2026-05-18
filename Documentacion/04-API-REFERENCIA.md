# Referencia de la API REST

> **Documento:** 04-API-REFERENCIA.md  
> **Versión:** 2.0  
> **Fecha:** Mayo 2026  
> **Base URL:** `http://localhost:3000/api` (dev) / `https://laboria-backend.onrender.com/api` (prod)

---

## 1. Autenticación

### POST /api/users/register
Registro de nuevo usuario.

```json
// Request
{ "email": "user@email.com", "password": "Pass@2026!", "name": "Usuario", "role": "CANDIDATE" }
// Response 201
{ "message": "Usuario registrado exitosamente", "user": { "id": "uuid", "email": "...", "name": "...", "role": "CANDIDATE" } }
```

### POST /api/users/login
Inicio de sesión.

```json
// Request
{ "email": "admin@laboria.com", "password": "Admin@2026!Secure" }
// Response 200
{ "accessToken": "jwt...", "refreshToken": "jwt...", "user": { "id": "uuid", "email": "...", "name": "Admin Laboria", "role": "ADMIN" } }
```

### POST /api/users/refresh-token
Renovar access token.

```json
// Request
{ "refreshToken": "jwt..." }
// Response 200
{ "accessToken": "jwt...", "refreshToken": "jwt..." }
```

### POST /api/users/logout
Cierre de sesión (registra duracion en LoginSession).

```json
// Request (Auth required)
{ "sessionId": "uuid" } // opcional
// Response 200
{ "message": "Sesion cerrada exitosamente" }
```

### POST /api/users/forgot-password
Solicitar restablecimiento de contrasena.

```json
// Request
{ "email": "user@email.com" }
// Response 200
{ "message": "Si el email existe, recibiras un enlace" }
```

### POST /api/users/reset-password
Restablecer contrasena con token.

```json
// Request
{ "token": "...", "password": "Nueva@Pass1" }
// Response 200
{ "message": "Contrasena restablecida exitosamente" }
```

---

## 2. Perfil de usuario (Auth required)

### GET /api/users/profile/me
Obtener perfil propio.

### PUT /api/users/profile/me
Actualizar perfil propio.

```json
// Request
{ "name": "Nuevo Nombre" }
```

### POST /api/users/change-password
Cambiar contrasena.

```json
// Request
{ "currentPassword": "...", "newPassword": "Nueva@Pass1" }
```

### DELETE /api/users/account
Eliminar cuenta propia.

---

## 3. Currículum (Auth required, CANDIDATE)

### GET /api/users/curriculum
Obtener CV del usuario.

### PUT /api/users/curriculum
Guardar/actualizar CV.

```json
// Request
{ "data": { "sections": [ { "type": "experience", "title": "Experiencia", "items": [ ... ] } ] } }
```

---

## 4. Empleos

### GET /api/jobs
Listar empleos (paginado).

```
Query: ?page=1&limit=10&category=TECH&mode=REMOTE&location=Madrid&search=developer&sortBy=createdAt&order=desc
```

### GET /api/jobs/:id
Detalle de empleo.

### POST /api/jobs (Auth required, COMPANY or ADMIN)
Crear empleo.

```json
// Request
{ "title": "Desarrollador Full Stack", "company": "TechCorp", "location": "Madrid", "description": "...", "category": "TECH", "mode": "HYBRID" }
```

### PUT /api/jobs/:id (Auth required, owner or ADMIN)
Actualizar empleo.

### DELETE /api/jobs/:id (Auth required, owner or ADMIN)
Eliminar empleo.

---

## 5. Cursos

### GET /api/courses
Listar cursos (paginado).

```
Query: ?page=1&limit=10&category=TECH&level=BEGINNER&search=javascript&sortBy=createdAt&order=desc
```

### GET /api/courses/:id
Detalle de curso.

### POST /api/courses (Auth required, COMPANY_STUDENTS/COMPANY_HYBRID/ADMIN)
Crear curso.

```json
// Request
{ "title": "React desde cero", "provider": "EduNext", "description": "...", "category": "TECH", "level": "BEGINNER" }
```

### PUT /api/courses/:id (Auth required, owner or ADMIN)
Actualizar curso.

### DELETE /api/courses/:id (Auth required, owner or ADMIN)
Eliminar curso.

---

## 6. Aplicaciones a empleos (Auth required)

### POST /api/applications
Aplicar a un empleo (CANDIDATE).

```json
// Request
{ "jobId": "uuid", "message": "Me interesa esta posicion" }
```

### GET /api/applications/my
Mis aplicaciones (CANDIDATE).

### GET /api/applications/job/:jobId
Aplicaciones de un empleo (COMPANY or ADMIN).

### PUT /api/applications/:id/status
Cambiar estado (COMPANY or ADMIN).

```json
// Request
{ "status": "ACCEPTED" } // PENDING | ACCEPTED | REJECTED
```

### DELETE /api/applications/:id
Cancelar aplicacion (CANDIDATE owner).

---

## 7. Aplicaciones a cursos (Auth required)

### POST /api/course-applications
Inscribirse en un curso (CANDIDATE).

```json
// Request
{ "courseId": "uuid", "message": "Me interesa" }
```

### GET /api/course-applications/my
Mis inscripciones (CANDIDATE).

### PUT /api/course-applications/:id/status
Cambiar estado (COMPANY_STUDENTS/COMPANY_HYBRID/ADMIN).

### DELETE /api/course-applications/:id
Cancelar inscripcion (CANDIDATE owner).

---

## 8. Administración (Auth required, ADMIN)

### GET /api/admin/dashboard
Estadisticas del dashboard.

### GET /api/admin/users
Listar usuarios (paginado, filtrable).

```
Query: ?page=1&limit=20&role=CANDIDATE&search=term
```

### GET /api/admin/users/:id
Detalles de usuario.

### PUT /api/admin/users/:id/role
Cambiar rol.

```json
// Request
{ "role": "ADMIN" }
```

### DELETE /api/admin/users/:id
Eliminar usuario como admin.

### GET /api/admin/jobs
Listar todos los empleos.

### PUT /api/admin/jobs/:id
Actualizar cualquier empleo.

### DELETE /api/admin/jobs/:id
Eliminar cualquier empleo.

### GET /api/admin/courses
Listar todos los cursos.

### PUT /api/admin/courses/:id
Actualizar cualquier curso.

### DELETE /api/admin/courses/:id
Eliminar cualquier curso.

### GET /api/admin/applications
Listar todas las aplicaciones.

### PUT /api/admin/applications/:id/status
Actualizar estado de aplicacion.

### GET /api/admin/audit-logs
Registro de auditoria (paginado).

### GET /api/admin/tests/run
Ejecutar tests del backend (solo en desarrollo).

---

## 9. Health check

### GET /health
```json
// Response 200
{ "status": "ok", "timestamp": "2026-05-18T..." }
```

---

## 10. Códigos de error

| Código | Significado |
|--------|-------------|
| 400 | Bad Request (validación) |
| 401 | No autenticado |
| 403 | No autorizado (rol) |
| 404 | Recurso no encontrado |
| 409 | Conflicto (duplicado) |
| 429 | Rate limit excedido |
| 500 | Error interno del servidor |

**Formato de error:**
```json
{ "error": { "message": "Descripcion del error", "statusCode": 400 } }
```

# Guía de verificación de base de datos y API

## 1. Ver modelos y relaciones

### Opción A — Prisma Studio (visual, recomendada)

```bash
cd backend
npx prisma studio
```

Se abre en http://localhost:5555. Muestra todas las tablas, sus campos, y puedes navegar los datos.

### Opción B — Schema (código)

El archivo `backend/prisma/schema.prisma` define todos los modelos:

| Modelo | Campos clave | Relaciones |
|---|---|---|
| **User** | id, email, password, name, role | → Application, CourseApplication, Course, Job, Curriculum |
| **Job** | id, title, company, location, description, authorId | → User (author), Application |
| **Course** | id, title, provider, description, authorId | → User (author) |
| **Application** | id, status, message, userId, jobId | → User, Job (único por userId+jobId) |
| **Curriculum** | id, data (JSON), userId | → User (uno por usuario) |
| **CourseApplication** | id, status, userId, courseId | → User (único por userId+courseId) |

### Opción C — psql (terminal)

```bash
cd backend
npx prisma db execute --stdin <<< "\dt"
```

Para ver las columnas de una tabla:

```bash
npx prisma db execute --stdin <<< "\d \"User\""
```

---

## 2. Endpoints para probar con Postman

URL base: `http://localhost:3000/api`

### Autenticación

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| POST | `/users/register` | `{ "email", "password", "name", "role" }` | Crear usuario |
| POST | `/users/login` | `{ "email", "password" }` | Iniciar sesión → devuelve `token` |
| POST | `/users/forgot-password` | `{ "email" }` | Solicitar reset |
| POST | `/users/reset-password` | `{ "token", "password" }` | Resetear contraseña |

### Perfil (requieren token)

Añadir header: `Authorization: Bearer <token>`

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| GET | `/users/profile/me` | — | Ver mi perfil |
| PUT | `/users/profile/me` | `{ "name", "email" }` | Actualizar perfil |
| POST | `/users/change-password` | `{ "currentPassword", "newPassword" }` | Cambiar contraseña |
| DELETE | `/users/account` | — | Eliminar cuenta |
| GET | `/users/curriculum` | — | Obtener curriculum |
| PUT | `/users/curriculum` | `{ "data": { ... } }` | Guardar curriculum |

### Empleos

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| GET | `/jobs` | — | Listar empleos |
| GET | `/jobs/:id` | — | Detalle de empleo |
| POST | `/jobs` | `{ "title", "company", "location", ... }` | Crear empleo |
| PUT | `/jobs/:id` | `{ "title", ... }` | Actualizar empleo |
| DELETE | `/jobs/:id` | — | Eliminar empleo |

### Cursos

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| GET | `/courses` | — | Listar cursos |
| GET | `/courses/:id` | — | Detalle de curso |
| POST | `/courses` | `{ "title", "provider", ... }` | Crear curso |
| PUT | `/courses/:id` | `{ "title", ... }` | Actualizar curso |
| DELETE | `/courses/:id` | — | Eliminar curso |

### Postulaciones a empleo

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| POST | `/applications` | `{ "jobId", "message" }` | Aplicar a empleo |
| GET | `/applications/my` | — | Mis aplicaciones |
| DELETE | `/applications/:id` | — | Cancelar aplicación |

### Inscripciones a cursos

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| POST | `/course-applications` | `{ "courseId", "message" }` | Inscribirse en curso |
| GET | `/course-applications/my` | — | Mis inscripciones |
| DELETE | `/course-applications/:id` | — | Cancelar inscripción |

### Administración

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/admin/users` | Listar usuarios |
| GET | `/admin/jobs` | Listar empleos (admin) |
| GET | `/admin/courses` | Listar cursos (admin) |
| GET | `/admin/applications` | Listar postulaciones |

---

## 3. Flujo completo de prueba en Postman

### 3.1 Crear y autenticar usuario

```
POST http://localhost:3000/api/users/register
Body (JSON):
{
  "email": "test@correo.com",
  "password": "123456",
  "name": "Usuario Test",
  "role": "CANDIDATE"
}
```

```
POST http://localhost:3000/api/users/login
Body:
{
  "email": "test@correo.com",
  "password": "123456"
}
→ Copiar el `token` del response
```

### 3.2 Guardar curriculum

Crear variable de entorno en Postman: `token = <token_copiado>`

```
PUT http://localhost:3000/api/users/curriculum
Headers: Authorization: Bearer {{token}}
Body (JSON):
{
  "data": {
    "experience": [
      { "id": 1, "company": "Empresa X", "position": "Developer", "startDate": "2020-01-01", "endDate": "2023-12-31", "description": "Trabajé en...", "sendToApplication": true }
    ],
    "education": [
      { "id": 1, "institution": "Universidad Y", "degree": "Ingeniería", "field": "Informática", "startDate": "2015-09-01", "endDate": "2020-06-30", "sendToApplication": true }
    ],
    "skills": [
      { "id": 1, "name": "JavaScript", "level": "avanzado", "sendToApplication": true }
    ],
    "projects": [],
    "languages": [
      { "id": 1, "language": "Inglés", "level": "intermedio", "sendToApplication": true }
    ]
  }
}
```

```
GET http://localhost:3000/api/users/curriculum
Headers: Authorization: Bearer {{token}}
→ Debe devolver los datos guardados
```

### 3.3 Aplicar a empleo

```
GET http://localhost:3000/api/jobs
→ Elegir un jobId del listado
```

```
POST http://localhost:3000/api/applications
Headers: Authorization: Bearer {{token}}
Body:
{
  "jobId": "<id_del_empleo>",
  "message": "Me interesa esta oferta"
}
```

### 3.4 Inscribirse en curso

```
POST http://localhost:3000/api/course-applications
Headers: Authorization: Bearer {{token}}
Body:
{
  "courseId": "1",
  "message": "Quiero inscribirme"
}
```

### 3.5 Ver todas las postulaciones

```
GET http://localhost:3000/api/applications/my
Headers: Authorization: Bearer {{token}}
```

```
GET http://localhost:3000/api/course-applications/my
Headers: Authorization: Bearer {{token}}
```

### 3.6 Cambiar contraseña

```
POST http://localhost:3000/api/users/change-password
Headers: Authorization: Bearer {{token}}
Body:
{
  "currentPassword": "123456",
  "newPassword": "nueva123"
}
```

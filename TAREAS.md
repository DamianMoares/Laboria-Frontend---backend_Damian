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

### ✅ Tarea 1.1: Crear la estructura de carpetas
**Estado:** ✅ Completado

### ✅ Tarea 1.2: Darle vida al backend
**Estado:** ✅ Completado

### ✅ Tarea 1.3: Conectar PostgreSQL (Base de Datos)
**Estado:** ✅ Completado (SQLite para desarrollo local)

### ✅ Tarea 1.4: Diseñar las tablas de tu base de datos
**Estado:** ✅ Completado (User, Job, Course, Application + enums Role, WorkMode, Level, ApplicationStatus)

---

## 🔧 FASE 2: El Cerebro del Backend (Dom 11/05 + Lun 12/05)

### ✅ Tarea 2.1: Organizar el código del backend
**Estado:** ✅ Completado

### ✅ Tarea 2.2: Crear el CRUD de Usuarios
**Estado:** ✅ Completado (register, login, getProfile, updateProfile, deleteAccount)

---

## 🔐 FASE 3: Seguridad con JWT (Martes 13/05)

### ✅ Tarea 3.1: Implementar JWT
**Estado:** ✅ Completado (authMiddleware, generateToken, verifyToken)

### ✅ Tarea 3.2: Roles de Usuario
**Estado:** ✅ Completado (adminMiddleware, seed, roles: CANDIDATE, COMPANY_*, ADMIN)

### ✅ Tarea 3.3: Conectar el frontend
**Estado:** ✅ Completado (api.js, authService.js, AuthContext.jsx)

---

## 📚 FASE 4: Recursos API (Miércoles 14/05)

### ✅ Tarea 4.1: CRUD de Empleos (Jobs)
**Estado:** ✅ Completado

### ✅ Tarea 4.2: CRUD de Cursos
**Estado:** ✅ Completado

### ✅ Tarea 4.3: CRUD de Aplicaciones
**Estado:** ✅ Completado

---

## 🔌 FASE 5: Integraciones (Jueves 15/05)

### ✅ Tarea 5.1: Servicio de Email
**Estado:** ✅ Completado (Resend con guard clause para desarrollo)

### ✅ Tarea 5.2: Conectar páginas frontend con API
**Estado:** ✅ Completado (JobSearchPage, CourseSearchPage, DashboardPage, MyApplicationsPage + admin pages)

### ✅ Tarea 5.3: Limpieza de código mock
**Estado:** ✅ Completado (users.json eliminado, jobs.json/courses.json mantenidos como fallback)

---

## 🎨 FASE 6: Frontend Polish (Domingo 18/05)

### ✅ Tarea 6.1: Migrar a CSS Modules
**Estado:** ✅ Completado (App.module.css)

### ✅ Tarea 6.2: Responsive Check
**Estado:** ⬜ Pendiente

### ✅ Tarea 6.3: Validaciones visuales en formularios
**Estado:** ⬜ Pendiente

---

## 🧪 FASE 7: Testing y Despliegue (Lunes 19/05)

### ✅ Tarea 7.1: Crear tests faltantes
**Estado:** ✅ Completado (8 tests: Home, App, Navbar, AuthContext, LoginPage, RegisterPage, CourseSearchPage, JobSearchPage)

### ✅ Tarea 7.2: Desplegar Backend
**Estado:** ⬜ Pendiente

### ✅ Tarea 7.3: Migrar base de datos a producción
**Estado:** ⬜ Pendiente

### ✅ Tarea 7.4: Desplegar Frontend
**Estado:** ⬜ Pendiente

### ✅ Tarea 7.5: Testing Final Integración
**Estado:** ⬜ Pendiente

---

## 🎉 ¡Proyecto Completado!

### Resumen de entregables:

| Componente | Estado |
|------------|--------|
| API REST con 4+ recursos | ✅ |
| Autenticación JWT | ✅ |
| Roles USER/ADMIN | ✅ |
| PostgreSQL con 4 tablas | ✅ (SQLite dev) |
| Prisma ORM | ✅ |
| Validaciones en endpoints | ✅ |
| Manejo de errores HTTP | ✅ |
| Variables de entorno | ✅ |
| Integración email | ✅ |
| React 18 + Vite | ✅ |
| React Router v6 (25 rutas) | ✅ |
| Context API (Auth) | ✅ |
| Formularios controlados | ✅ |
| Estados loading/error/empty | ✅ |
| Diseño responsive | ⬜ Pendiente |
| CSS Modules | ✅ |
| 8+ tests pasando | ✅ (8 tests) |
| Backend desplegado | ⬜ Pendiente |
| Frontend desplegado | ⬜ Pendiente |
| DB en la nube | ⬜ Pendiente |
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

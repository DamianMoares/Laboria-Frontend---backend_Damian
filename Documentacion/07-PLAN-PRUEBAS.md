# Plan de Pruebas

> **Documento:** 07-PLAN-PRUEBAS.md  
> **Versión:** 2.0  
> **Fecha:** Mayo 2026  
> **Cobertura:** 86 tests (57 frontend + 29 backend)

---

## 1. Estrategia de pruebas

| Tipo | Herramienta | Alcance | Prioridad |
|------|-------------|---------|-----------|
| Unitarias (frontend) | Vitest + Testing Library | Componentes, paginas, contextos | Alta |
| Unitarias (backend) | Vitest + require.cache | Controladores, middleware | Alta |
| Build (frontend) | Vite build | Compilacion produccion | Alta |
| Sintaxis (backend) | node --check | Archivos .js | Media |
| Manual | QA visual | UX, flujos criticos | Media |
| E2E | No implementado | — | Futuro |

---

## 2. Tests del frontend (57 tests, 8 archivos)

### 2.1 App.test.jsx (4 tests)
- Renderizado del router con rutas principales
- Navegacion entre paginas publicas
- Renderizado de componentes clave (Navbar, Home)

### 2.2 AuthContext.test.jsx (6 tests)
- Estado inicial: no autenticado
- Login exitoso actualiza estado
- Login fallido maneja error
- Logout limpia estado
- Registro exitoso
- Registro fallido maneja error

### 2.3 Navbar.test.jsx (10 tests)
- Renderizado del menu de navegacion
- Enlaces visibles segun rol (no auth, candidate, company, admin)
- Menu hamburguesa en movil
- Cierre de sesion desde navbar
- Responsive: menu se oculta/muestra

### 2.4 Home.test.jsx (6 tests)
- Renderizado correcto de la pagina principal
- Subtitulo del portal visible
- Botones de navegacion principales
- Secciones de caracteristicas
- Estadisticas del sistema
- Llamada a la accion (CTA)

### 2.5 LoginPage.test.jsx (8 tests)
- Renderizado del formulario
- Validacion de campos requeridos
- Validacion de formato email
- Inicio de sesion exitoso
- Manejo de errores (credenciales incorrectas)
- Enlace a registro
- Enlace a recuperar contrasena
- Estado de carga (loading)

### 2.6 RegisterPage.test.jsx (10 tests)
- Renderizado del formulario
- Validacion de campos requeridos
- Validacion de contrasena (longitud, mayuscula, minuscula, numero, especial)
- Confirmacion de contrasena coincidente
- Registro exitoso
- Manejo de errores (email duplicado)
- Aceptacion de terminos
- Enlace a inicio de sesion

### 2.7 JobSearchPage.test.jsx (6 tests)
- Renderizado con datos mock
- Filtros visibles y funcionales
- Busqueda por texto
- Paginacion de resultados
- Manejo de estado vacio (EmptyState)
- Loader durante carga (Spinner)

### 2.8 CourseSearchPage.test.jsx (6 tests)
- Renderizado con datos mock
- Filtros por categoria y nivel
- Busqueda por texto
- Paginacion
- Estado vacio
- Loader

---

## 3. Tests del backend (29 tests, 6 archivos)

### 3.1 userController.test.js (6 tests)
- Creacion de usuario con datos validos -> 201
- Creacion con email duplicado -> 409
- Login con credenciales correctas -> 200 + tokens
- Login con contrasena incorrecta -> 401
- Login con email inexistente -> 401
- Obtencion de perfil requiere autenticacion (next llamado con error 401)

### 3.2 jobController.test.js (4 tests)
- Listado de empleos con paginacion -> 200 + datos
- Creacion de empleo por COMPANY -> 201
- Creacion de empleo por CANDIDATE -> 403
- Obtencion de detalle de empleo inexistente -> 404

### 3.3 courseController.test.js (4 tests)
- Listado de cursos con paginacion -> 200
- Creacion de curso por COMPANY_STUDENTS -> 201
- Creacion de curso por CANDIDATE -> 403
- Detalle de curso inexistente -> 404

### 3.4 applicationController.test.js (6 tests)
- Creacion de aplicacion a empleo inexistente -> 404
- Creacion de aplicacion duplicada -> 409
- Creacion de aplicacion exitosa -> 201
- Listado de mis aplicaciones -> 200
- Actualizacion de estado invalido -> 400
- Cancelacion de aplicacion inexistente -> 404

### 3.5 adminController.test.js (5 tests)
- Dashboard con estadisticas agregadas -> 200 + stats
- Listado de usuarios paginado -> 200
- Eliminacion de usuario inexistente -> 404
- Ejecucion de tests en produccion -> 403
- Obtencion de registros de auditoria -> 200

### 3.6 authMiddleware.test.js (4 tests)
- Token valido pasa al siguiente middleware
- Token invalido -> 401
- Token expirado -> 401
- Ausencia de token -> 401

---

## 4. Resultados de la auditoria

| Metricas | Valor |
|----------|-------|
| Tests totales | 86 |
| Tests frontend | 57 |
| Tests backend | 29 |
| Archivos de test | 14 |
| Hallazgos totales identificados | ~95 |
| Hallazgos corregidos | ~90 (~95%) |
| Hallazgos pendientes | ~9 (todos baja prioridad) |
| Build produccion | Exitoso (838 modulos, 7s) |
| Chunks generados | ~70 (code splitting) |

---

## 5. Pendientes 🟢 (baja prioridad)

| ID | Descripcion | Esfuerzo |
|----|-------------|----------|
| R-05 | Optimizar imagenes (WebP/SVG) | 30min |
| R-06 | Bundle analyzer (vite-plugin-visualizer) | 30min |
| UX-10 | Home.jsx "..." loading a Spinner | 15min |
| UX-11 | Eliminar codigo comentado en Home | 5min |
| C-14 | hooks/ directorio vacio (poblar o eliminar) | 5min |
| C-15 | Reubicar ConexionApi.jsx de context/ a services/ | 15min |
| C-16 | ConfirmContext.jsx estilos inline a CSS Module | 30min |
| C-02 | .editorconfig | 10min |
| T-07 | Script test:coverage | 15min |

---

## 6. Mejoras recomendadas para proxima iteracion

| Prioridad | Mejora | Justificacion |
|-----------|--------|---------------|
| Alta | Tests E2E (Playwright/Cypress) | Cobertura de flujo completo |
| Media | Test de integracion API (supertest) | Backend sin mock de BD |
| Media | Coverage reporting | Medir % de cobertura real |
| Baja | Pruebas de carga (k6/artillery) | Rendimiento bajo estres |
| Baja | Pruebas de accesibilidad (axe-core) | Cumplir WCAG 2.1 AA |

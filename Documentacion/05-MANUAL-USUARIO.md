# Manual de Usuario

> **Documento:** 05-MANUAL-USUARIO.md  
> **Versión:** 2.0  
> **Fecha:** Mayo 2026

---

## 1. Introducción

Laboria es una plataforma web que permite a candidatos buscar empleo y formación,
a empresas publicar ofertas y cursos, y a administradores gestionar el sistema.

**URL:** `https://laboria-frontend.vercel.app` (produccion)  
**URL:** `http://localhost:5173` (desarrollo)

---

## 2. Todos los usuarios

### 2.1 Registro

1. Acceder a `/register`
2. Completar: nombre, email, contraseña, confirmar contraseña, rol
3. La contraseña debe tener: 8+ caracteres, mayúscula, minúscula, número, especial
4. Aceptar términos y condiciones
5. Click en "Crear cuenta"

### 2.2 Inicio de sesión

1. Acceder a `/login`
2. Ingresar email y contraseña
3. Click en "Iniciar sesión"
4. La sesión dura 24 horas con refresh automático

### 2.3 Recuperar contraseña

1. En `/login`, click en "¿Olvidaste tu contraseña?"
2. Ingresar email registrado
3. Revisar bandeja de entrada (simulado en desarrollo)
4. Seguir enlace para restablecer

### 2.4 Navegación

La barra de navegación se adapta según el rol del usuario:

| Rol | Enlaces visibles |
|-----|------------------|
| No autenticado | Inicio, Empleos, Cursos, Sobre Laboria, FAQ, Iniciar Sesion, Registrarse |
| CANDIDATE | Inicio, Empleos, Cursos, Mis Aplicaciones, Dashboard, Mi Perfil, Cerrar Sesion |
| COMPANY | Inicio, Empleos, Cursos, Publicar, Gestionar, Mi Perfil |
| ADMIN | Todo lo anterior + Panel Admin |

---

## 3. Candidatos

### 3.1 Buscar empleos

1. Ir a "Empleos" en el menu
2. Usar filtros: categoria, ubicacion, modalidad (remoto/hibrido/presencial)
3. Ordenar por: fecha, relevancia
4. Resultados paginados con scroll infinito
5. Click en una tarjeta para ver detalle

### 3.2 Aplicar a un empleo

1. Abrir detalle del empleo
2. Click en "Aplicar ahora"
3. Escribir mensaje (opcional)
4. Click en "Enviar aplicacion"
5. La aplicacion aparece en "Mis Aplicaciones"

### 3.3 Ver cursos

1. Ir a "Cursos" en el menu
2. Filtrar por categoria y nivel (Principiante/Intermedio/Avanzado)
3. Click para ver detalle (descripcion, duracion, precio, proveedor)

### 3.4 Inscribirse en un curso

1. Abrir detalle del curso
2. Click en "Inscribirme"
3. Confirmar inscripcion
4. Aparece en "Mis Cursos"

### 3.5 Gestionar currículum

1. Ir a "Mi Perfil" > "Curriculum"
2. Editor por secciones: Datos personales, Resumen, Experiencia, Educacion,
   Habilidades, Idiomas, Proyectos, Certificaciones
3. Cada seccion permite anadir, editar y eliminar items
4. Los campos requeridos estan marcados con asterisco
5. Guardar cambios con el boton "Guardar curriculum"

### 3.6 Dashboard personal

1. Ir a "Dashboard"
2. Ver estadisticas: duracion de sesiones (grafico), aplicaciones activas
3. Acceso rapido a empleos y cursos

### 3.7 Configuracion

1. Ir a "Mi Perfil" > "Configuracion"
2. Actualizar nombre, email
3. Cambiar contraseña
4. Eliminar cuenta

---

## 4. Empresas (COMPANY_EMPLOYEES / COMPANY_HYBRID)

### 4.1 Publicar empleo

1. Ir a "Publicar empleo"
2. Completar: titulo, empresa, ubicacion, descripcion, categoria, modalidad
3. Los campos titulo, empresa y ubicacion se validan en tiempo real (on blur)
4. Click en "Publicar empleo"
5. Aparece en el listado publico y en "Mis Empleos"

### 4.2 Gestionar empleos

1. Ir a "Mis Empleos"
2. Ver listado de empleos publicados
3. Editar: modificar cualquier campo
4. Eliminar: confirmar y borrar

### 4.3 Ver aplicaciones recibidas

1. Ir al detalle de un empleo propio
2. Seccion "Aplicaciones" con listado de candidatos
3. Ver mensaje, perfil del candidato
4. Aceptar o rechazar aplicaciones

---

## 5. Instituciones educativas (COMPANY_STUDENTS / COMPANY_HYBRID)

### 5.1 Publicar curso

1. Ir a "Publicar curso"
2. Completar: titulo, proveedor, descripcion, categoria, nivel
3. Campos opcionales: duracion, precio, URL, imagen
4. Click en "Publicar curso"

### 5.2 Gestionar cursos

1. Ir a "Mis Cursos"
2. Ver listado, editar o eliminar cursos propios
3. Gestionar inscripciones de candidatos

---

## 6. Administradores

### 6.1 Panel de administracion

1. Ir al menu "Panel Admin"
2. Dashboard con estadisticas: total usuarios, empleos, cursos, aplicaciones
3. Navegacion interna: Usuarios, Empleos, Cursos, Aplicaciones, Tests

### 6.2 Gestion de usuarios

1. Listado paginado con busqueda por nombre/email
2. Click en usuario para ver detalles
3. Cambiar rol de usuario (dropdown + confirmacion)
4. Eliminar usuario (con confirmacion)

### 6.3 Gestion de empleos y cursos

1. Listados paginados con busqueda
2. Editar cualquier recurso
3. Eliminar cualquier recurso

### 6.4 Gestion de aplicaciones

1. Ver todas las aplicaciones del sistema
2. Cambiar estado (PENDING/ACCEPTED/REJECTED)

### 6.5 Auditoria

1. Ver registro de acciones administrativas
2. Informacion: accion, entidad, admin, fecha

### 6.6 Tests

1. Ejecutar tests del backend desde el panel (solo en desarrollo)
2. Ver resultados en pantalla

---

## 7. Consejos y buenas practicas

- **Contrasenas:** Usar gestor de contrasenas; no reutilizar contrasenas personales
- **Cerrar sesion:** Siempre cerrar sesion en dispositivos compartidos
- **Privacidad:** No incluir datos sensibles en el mensaje de aplicacion
- **Curriculum:** Mantener actualizado; los datos se guardan como JSON en BD
- **Soporte:** Para incidencias, contactar al administrador del sistema

---

## 8. Solucion de problemas comunes

| Problema | Solucion |
|----------|----------|
| No recibo email de recuperacion | Revisar spam; en desarrollo usamos simulacion |
| Error al registrarme | Verificar que la contrasena cumple requisitos (8+ chars, mayus, minus, num, esp) |
| No veo el boton de aplicar | Solo visible para candidatos autenticados |
| La pagina no carga | Verificar conexion a internet; esperar 30s y recargar |
| Error 429 (too many requests) | Esperar 15 minutos antes de reintentar |
| Sesion expirada | Hacer login nuevamente (el refresh es automatico) |

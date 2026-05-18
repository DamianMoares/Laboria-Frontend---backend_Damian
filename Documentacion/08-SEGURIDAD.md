# Seguridad

> **Documento:** 08-SEGURIDAD.md  
> **Versión:** 2.0  
> **Fecha:** Mayo 2026

---

## 1. Autenticacion y autorizacion

### 1.1 JWT (JSON Web Tokens)

| Aspecto | Configuracion |
|---------|---------------|
| Access token | 15 minutos de validez |
| Refresh token | 24 horas de validez |
| Algoritmo | HS256 |
| Payload | `{ userId, role, iat, exp }` |
| Almacenamiento | `localStorage` (frontend) |

**Flujo de refresh:**
1. Interceptor en `api.js` detecta 401
2. Envia refresh token a `/api/users/refresh-token`
3. Obtiene nuevo access + refresh token
4. Reintenta peticion original

### 1.2 Middleware de autorizacion

| Middleware | Funcion |
|------------|---------|
| `authMiddleware.js` | Verifica JWT, busca usuario en BD, adjunta `req.user` |
| `adminMiddleware.js` | Verifica `req.user.role === 'ADMIN'` |
| `ownerMiddleware.js` | Verifica `req.user.id === req.params.id` o admin |

**Pipeline tipico:** `router.use(authMiddleware, adminMiddleware);`

### 1.3 Proteccion de rutas en frontend

| Componente | Funcion |
|------------|---------|
| `<ProtectedRoute>` | Redirige a `/login` si no autenticado; muestra spinner durante verificacion |
| `<ProtectedAdminRoute>` | Redirige a `/` si no es admin |
| Roles check | `isCandidate()`, `isCompany()`, `isAdmin()` desde AuthContext |

---

## 2. Contrasenas

### 2.1 Politica de contrasenas

| Requisito | Valor |
|-----------|-------|
| Longitud minima | 8 caracteres |
| Mayuscula | Al menos 1 |
| Minuscula | Al menos 1 |
| Numero | Al menos 1 |
| Caracter especial | Al menos 1 |
| Hash | bcryptjs (cost factor 10) |
| Almacenamiento | Solo hash, jamas texto plano |

### 2.2 Validacion (frontend + backend)

La validacion se realiza tanto en el formulario frontend (UX inmediata) como
en el controlador backend (seguridad). Reglas definidas en:

- Frontend: `RegisterPage.jsx` (validacion visual en tiempo real)
- Backend: `middleware/validate.js` (reglas express-validator)

---

## 3. Rate limiting

| Limiter | Ventana | Maximo | Rutas |
|---------|---------|--------|-------|
| `authLimiter` | 15 min | 30 | `/login`, `/register`, `/forgot-password`, `/reset-password` |
| `writeLimiter` | 15 min | 60 | Mutaciones (POST, PUT, DELETE) |
| `generalLimiter` | 15 min | 100 | Todas las rutas (global) |

---

## 4. Headers de seguridad (Helmet)

Helmet configura automaticamente headers HTTP de seguridad:

| Header | Valor |
|--------|-------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-XSS-Protection` | `1; mode=block` |
| `Strict-Transport-Security` | `max-age=15552000; includeSubDomains` |
| `Content-Security-Policy` | Valores por defecto de Helmet |

---

## 5. CORS

```javascript
// Configuracion en backend/server.js
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}));
```

---

## 6. Manejo de errores

El error handler global (`middleware/errorHandler.js`) captura todas las
excepciones y devuelve respuestas JSON estructuradas:

```json
{ "error": { "message": "Descripcion", "statusCode": 400 } }
```

En produccion (`NODE_ENV=production`) se omiten los stack traces.

---

## 7. APIs externas

Las claves de APIs externas se configuran via variables de entorno
(`VITE_*` en frontend). Nunca estan hardcodeadas en el codigo fuente.
El frontend se comunica con APIs externas a traves del proxy de Vite
(desarrollo) o Vercel rewrites (produccion), evitando exponer claves
directamente.

---

## 8. Base de datos

- **Contrasenas:** Solo hash bcrypt almacenado
- **SQL Injection:** Prevenido por Prisma ORM (querys parametrizadas)
- **UUIDs:** Identificadores no secuenciales (no exponen informacion)
- **AuditLog:** Registro de todas las acciones administrativas
- **Enums en BD:** Roles y estados validados a nivel de base de datos

---

## 9. Resumen de vulnerabilidades mitigadas

| Vulnerabilidad | Mitigacion |
|----------------|------------|
| Inyeccion SQL | Prisma ORM (parametrizacion automatica) |
| XSS | Helmet + React escape automatico |
| CSRF | SameSite cookies + JWT en headers |
| Fuerza bruta | Rate limiting (auth: 30/15min) |
| Token theft | Refresh token rotativo, expiracion corta (15min) |
| Password cracking | bcrypt (cost 10) |
| Information disclosure | Sin stack traces en produccion |
| Privilege escalation | Middleware de roles en cada ruta |
| Mass assignment | DTOs manuales en controladores |
| Logging inseguro | Sin datos sensibles en logs |

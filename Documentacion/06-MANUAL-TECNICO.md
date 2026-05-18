# Manual Técnico

> **Documento:** 06-MANUAL-TECNICO.md  
> **Versión:** 2.0  
> **Fecha:** Mayo 2026

---

## 1. Requisitos del sistema

| Herramienta | Versión mínima | Recomendada |
|-------------|---------------|-------------|
| Node.js | 20.x | 20.14+ (LTS) |
| npm | 9.x | 10.x |
| PostgreSQL | 14 | 16 |
| Docker | 24.x | 27.x (opcional) |
| Git | 2.x | 2.40+ |

---

## 2. Instalación

### 2.1 Clonar e instalar dependencias

```bash
git clone <repo>
cd Laboria-Frontend---backend_Damian
npm run install:all
```

### 2.2 Configurar variables de entorno

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/laboria?schema=public"
JWT_SECRET="cambiar-por-secreto-seguro-256bits"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="24h"
FRONTEND_URL="http://localhost:5173"
CORS_ORIGINS="http://localhost:5173"
NODE_ENV="development"
PORT=3000
# Opcional: RESEND_API_KEY="re_..."
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL="http://localhost:3000"
# APIs externas (opcionales para desarrollo)
VITE_JCYL_API_URL="..."
VITE_SERPAPI_KEY="..."
VITE_JOBICY_API_URL="..."
VITE_HIMALAYAS_API_URL="..."
VITE_REMOTIVE_API_URL="..."
VITE_ARBEITNOW_API_URL="..."
VITE_KHANACADEMY_API_URL="..."
VITE_YOUTUBE_API_KEY="..."
VITE_GOOGLE_CSE_KEY="..."
VITE_GOOGLE_CSE_CX="..."
VITE_BING_API_KEY="..."
```

### 2.3 Base de datos

```bash
# Con Docker
docker compose up db -d

# O manual (PostgreSQL local)
createdb laboria

# Migraciones y seed
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 2.4 Iniciar en desarrollo

```bash
# Desde la raiz (ambos servidores simultaneamente)
npm run dev

# O por separado
cd backend && npm run dev    # http://localhost:3000
cd frontend && npm run dev   # http://localhost:5173
```

---

## 3. Docker

### 3.1 Iniciar todo

```bash
docker compose up --build
```

Servicios:
- `db`: PostgreSQL 16 (puerto 5432)
- `backend`: Node.js (puerto 3000)
- `frontend`: Nginx sirviendo build (puerto 5173)

### 3.2 Comandos utiles

```bash
# Solo base de datos
docker compose up db -d

# Ver logs de un servicio
docker compose logs -f backend

# Ejecutar migraciones dentro del contenedor
docker compose exec backend npx prisma migrate deploy

# Ejecutar seed dentro del contenedor
docker compose exec backend node prisma/seed.js

# Detener todo
docker compose down

# Detener y eliminar volumenes
docker compose down -v
```

---

## 4. Migraciones de base de datos

```bash
# Crear nueva migracion tras cambios en schema.prisma
npx prisma migrate dev --name descripcion-del-cambio

# Aplicar migraciones en produccion
npx prisma migrate deploy

# Regenerar cliente Prisma
npx prisma generate

# Ver estado de migraciones
npx prisma migrate status
```

---

## 5. Tests

### 5.1 Ejecutar tests

```bash
# Todos los tests (frontend + backend)
npm test

# Solo frontend
cd frontend && npm test

# Solo backend
cd backend && npm test

# Modo watch (desarrollo)
cd frontend && npx vitest
cd backend && npx vitest
```

### 5.2 Tests del backend (por archivo)

```bash
cd backend
npx vitest run src/__tests__/userController.test.js
npx vitest run src/__tests__/jobController.test.js
npx vitest run src/__tests__/courseController.test.js
npx vitest run src/__tests__/applicationController.test.js
npx vitest run src/__tests__/adminController.test.js
npx vitest run src/__tests__/authMiddleware.test.js
```

### 5.3 Tests del frontend (por archivo)

```bash
cd frontend
npx vitest run src/App.test.jsx
npx vitest run src/context/AuthContext.test.jsx
npx vitest run src/components/Navbar/Navbar.test.jsx
npx vitest run src/pages/inicio/Home.test.jsx
npx vitest run src/pages/autenticacion/LoginPage.test.jsx
npx vitest run src/pages/autenticacion/RegisterPage.test.jsx
npx vitest run src/pages/empleos/JobSearchPage.test.jsx
npx vitest run src/pages/cursos/CourseSearchPage.test.jsx
```

---

## 6. Build de produccion

```bash
# Frontend
cd frontend && npm run build
# Output: frontend/dist/

# Backend (compilacion no necesaria, sintaxis JS)
cd backend && node --check server.js
```

---

## 7. Despliegue

### 7.1 Frontend (Vercel)

1. Conectar repositorio a Vercel
2. Framework: Vite
3. Build command: `npm run build`
4. Output: `dist`
5. Variables de entorno: copiar `frontend/.env.example`
6. Vercel ya tiene SPA fallback en `vercel.json`

### 7.2 Backend (Render)

1. Crear Web Service desde `render.yaml` o manual:
   - Build: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start: `node server.js`
2. Crear PostgreSQL database
3. Configurar variables en Render Dashboard

### 7.3 Docker (alternativa unificada)

```bash
docker compose up --build -d
```

---

## 8. Scripts disponibles

### Raiz (`package.json`)
```bash
npm run dev          # Iniciar frontend + backend en desarrollo
npm run build        # Build frontend + sintaxis backend
npm test             # Tests frontend + backend
npm run setup        # Instalar todo + build backend
```

### Frontend (`frontend/package.json`)
```bash
npm run dev          # Vite dev server (puerto 5173)
npm run build        # Vite build produccion
npm run preview      # Preview del build
npm test             # Vitest run
```

### Backend (`backend/package.json`)
```bash
npm start            # Produccion (node server.js)
npm run dev          # Desarrollo (nodemon)
npm run build        # Prisma generate + migrate deploy
npm run seed         # Ejecutar seed
npm test             # Vitest run
```

---

## 9. Estructura de archivos clave

```
backend/
├── server.js                    # Entry point Express
├── prisma/
│   ├── schema.prisma            # Modelo de datos
│   ├── seed.js                  # Datos de ejemplo
│   └── migrations/              # Migraciones SQL
└── src/
    ├── config/database.js       # Singleton PrismaClient
    ├── controllers/             # Logica de negocio
    ├── routes/                  # Definicion de rutas
    ├── middleware/              # Auth, admin, rate-limit, validacion
    ├── services/                # Email, auditoria
    ├── utils/jwt.js             # JWT generation/verification
    └── __tests__/               # Tests unitarios

frontend/
├── src/
│   ├── App.jsx                  # Router principal (BrowserRouter)
│   ├── pages/                   # 30 paginas (lazy loaded)
│   ├── components/              # 11 componentes compartidos
│   ├── services/                # 13 servicios API
│   ├── context/                 # AuthContext, ConfirmContext
│   ├── hooks/                   # Custom hooks
│   └── config/                  # Enums, configuracion APIs externas
├── vite.config.js               # Proxy APIs externas, build config
└── vercel.json                  # SPA fallback + API rewrites
```

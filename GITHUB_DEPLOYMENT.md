# 🚀 Guía de Despliegue desde GitHub

## 📋 ESTRUCTURA DEL REPOSITORIO

El repositorio está estructurado como monorepo:
```
Laboria-Frontend---backend_Damian/
├── backend/           # API REST (Node.js + Express + Prisma)
├── frontend/          # App React (Vite + React Router)
├── DEPLOYMENT.md      # Guía general de despliegue
├── START_BACKEND.md   # Instrucciones para iniciar backend
├── railway.json       # Configuración Railway
└── README.md          # Documentación del proyecto
```

---

## 🚀 PASO 1: DESPLEGAR BACKEND EN RAILWAY

### 1.1 Conectar Railway a GitHub
1. **Ve a [Railway.app](https://railway.app)**
2. **Login** con tu cuenta GitHub
3. **"New Project" → "Deploy from GitHub repo"**
4. **Selecciona el repositorio**: `DamianMoares/Laboria-Frontend---backend_Damian`
5. **Configura el root directory**: `backend`

### 1.2 Configurar Variables de Entorno en Railway
En el dashboard de Railway, ve a "Settings" → "Variables" y agrega:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=tu-super-secreto-jwt-min-32-caracteres-aqui
JWT_EXPIRES_IN=7d
```

**Nota**: `DATABASE_URL` se configura automáticamente cuando agregas el servicio PostgreSQL.

### 1.3 Agregar Base de Datos PostgreSQL
1. **"New Project" → "Add PostgreSQL"**
2. **Conectar al proyecto del backend**
3. **Railway generará automáticamente** `DATABASE_URL`

### 1.4 Configurar Build Command
En "Settings" → "Build & Deploy Settings":
```
Build Command: npm run build
Start Command: npm start
Root Directory: backend
```

### 1.5 Ejecutar Migraciones
El build command incluye automáticamente:
```bash
npx prisma generate && npx prisma migrate deploy
```

---

## 🌐 PASO 2: DESPLEGAR FRONTEND EN NETLIFY

### 2.1 Conectar Netlify a GitHub
1. **Ve a [Netlify.com](https://netlify.com)**
2. **Login** con tu cuenta GitHub
3. **"Add new site" → "Import an existing project"**
4. **Selecciona el repositorio**: `DamianMoares/Laboria-Frontend---backend_Damian`
5. **Configura el root directory**: `frontend`

### 2.2 Configurar Build Settings
```
Build command: npm run build
Publish directory: dist
Node version: 18
Root directory: frontend
```

### 2.3 Configurar Variables de Entorno en Netlify
En "Site settings" → "Environment variables":

```env
VITE_API_URL=https://tu-backend-url.railway.app
VITE_ADMIN_KEY=laboria2024
VITE_BASE_PATH=/
```

### 2.4 Obtener URL del Backend
1. **Ve a Railway dashboard**
2. **Copia la URL del proyecto backend** (ej: `https://laboria-backend.up.railway.app`)
3. **Usa esta URL** en las variables de entorno de Netlify

---

## 🔧 PASO 3: ACTUALIZAR CONFIGURACIÓN

### 3.1 Actualizar netlify.toml
Cambia `tu-backend-url.railway.app` por la URL real de tu backend Railway:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://laboria-backend.up.railway.app/api/:splat"
  status = 200
  force = true

[context.production]
  [context.production.environment]
    VITE_API_URL = "https://laboria-backend.up.railway.app"
```

### 3.2 Actualizar frontend .env.production
```env
VITE_API_URL=https://laboria-backend.up.railway.app
VITE_ADMIN_KEY=laboria2024
VITE_BASE_PATH=/
```

---

## ✅ PASO 4: VERIFICACIÓN

### 4.1 Backend Tests
```bash
# Test endpoint principal
curl https://tu-backend.railway.app/

# Debe responder:
{"message": "¡Backend de Laboria funcionando!"}

# Test de registro
curl -X POST https://tu-backend.railway.app/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test User"}'
```

### 4.2 Frontend Tests
1. **Visita tu sitio Netlify**
2. **Intenta registrar un usuario**
3. **Intenta iniciar sesión**
4. **Busca empleos y cursos**
5. **Verifica que todo funcione en móvil**

---

## 🔄 PASO 5: AUTOMATIZACIÓN

### 5.1 Automatic Deploys
Ambos servicios están configurados para despliegue automático:
- **Railway**: Se despliega con cada push a `main`
- **Netlify**: Se despliega con cada push a `main`

### 5.2 Workflow de Desarrollo
```bash
# 1. Hacer cambios
git add .
git commit -m "Update feature"
git push origin main

# 2. Esperar despliegues automáticos
# Railway: ~2-3 minutos
# Netlify: ~1-2 minutos

# 3. Verificar funcionamiento
```

---

## 🚨 TROUBLESHOOTING

### Backend Issues
- **Database connection failed**: Verifica `DATABASE_URL`
- **JWT errors**: Verifica `JWT_SECRET` tiene 32+ caracteres
- **Build failed**: Verifica `package.json` y dependencias

### Frontend Issues
- **API connection failed**: Verifica `VITE_API_URL`
- **Build failed**: Verifica `vite.config.js`
- **CORS errors**: Verifica configuración CORS en backend

### Common Solutions
```bash
# Forzar nuevo despliegue en Railway
git commit --allow-empty -m "Trigger Railway deploy"
git push origin main

# Forzar nuevo despliegue en Netlify
git commit --allow-empty -m "Trigger Netlify deploy"
git push origin main
```

---

## 🎯 URLs FINALES

Una vez completado el despliegue:

**Backend**: `https://tu-proyecto.railway.app`
**Frontend**: `https://tu-proyecto.netlify.app`
**Admin**: `https://tu-proyecto.netlify.app/admin`

---

## 📞 SOPORTE

Si tienes problemas:
1. **Revisa los logs** en Railway y Netlify
2. **Verifica variables de entorno**
3. **Confirma que el backend responda**
4. **Testea endpoints individualmente**

¡Tu aplicación Laboria está lista para producción! 🚀

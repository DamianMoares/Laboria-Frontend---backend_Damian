# 🚀 Guía de Despliegue - Laboria

## 📋 Requisitos Previos

- Cuenta en [Railway](https://railway.app) para el backend
- Cuenta en [Netlify](https://netlify.com) para el frontend
- Repositorio GitHub con el código del proyecto

---

## 🔧 Despliegue del Backend (Railway)

### 1. Preparar el Repositorio

```bash
# Asegurarse de que todo esté commiteado
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Configurar Railway

1. **Crear nuevo proyecto en Railway**
   - Inicia sesión en Railway
   - Click "New Project" → "Deploy from GitHub repo"
   - Selecciona tu repositorio

2. **Configurar Variables de Entorno**
   ```env
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgresql://username:password@host:port/database
   JWT_SECRET=tu-super-secreto-jwt-min-32-caracteres
   JWT_EXPIRES_IN=7d
   ```

3. **Configurar Build Command**
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`

4. **Desplegar Base de Datos**
   ```bash
   # Railway ejecuta automáticamente las migraciones
   # Si necesitas datos de prueba:
   railway run npx prisma db seed
   ```

---

## 🌐 Despliegue del Frontend (Netlify)

### 1. Preparar el Frontend

```bash
# Instalar dependencias
cd frontend
npm install

# Construir para producción
npm run build
```

### 2. Configurar Netlify

1. **Conectar Repositorio GitHub**
   - Ve a Netlify Dashboard
   - "Add new site" → "Import an existing project"
   - Conecta tu cuenta GitHub
   - Selecciona el repositorio

2. **Configurar Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   Node version: 18
   ```

3. **Configurar Variables de Entorno**
   ```
   VITE_API_URL=https://tu-backend-url.railway.app
   VITE_ADMIN_KEY=laboria2024
   VITE_BASE_PATH=/
   ```

4. **Configurar Redirects**
   ```toml
   # netlify.toml (ya está configurado)
   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```

---

## ✅ Verificación del Despliegue

### Checklist de Producción

- [ ] Backend responde en `https://tu-backend.railway.app`
- [ ] Frontend funciona en `https://tu-frontend.netlify.app`
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Crear empleo como empresa funciona
- [ ] Buscar empleos funciona
- [ ] Aplicar a empleo funciona
- [ ] Panel de administración funciona
- [ ] Todo funciona en móvil
- [ ] No hay errores en consola del navegador

### Tests de Integración

```bash
# Probar endpoints del backend
curl https://tu-backend.railway.app/
# Debe retornar: {"message": "¡Backend de Laboria funcionando!"}

# Probar registro
curl -X POST https://tu-backend.railway.app/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test User"}'

# Probar login
curl -X POST https://tu-backend.railway.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

---

## 🔍 Troubleshooting

### Problemas Comunes

**"Cannot find module"**
```bash
# En Railway: verificar package.json
# En local: npm install
```

**"Database connection failed"**
```bash
# Verificar DATABASE_URL en Railway
# Asegurarse que PostgreSQL está corriendo
```

**"CORS errors"**
```bash
# Verificar que el frontend URL esté permitido
# Revisar middleware CORS en backend
```

**"Build failed"**
```bash
# Verificar vite.config.js
# Asegurarse que todas las dependencias están instaladas
```

---

## 📊 Monitoreo

### Railway Dashboard
- Logs del backend
- Métricas de rendimiento
- Estado de la base de datos

### Netlify Dashboard
- Logs del frontend
- Métricas de visitas
- Deploy history

---

## 🔄 Actualizaciones

### Para actualizar el backend
```bash
git add .
git commit -m "Update backend"
git push origin main
# Railway despliega automáticamente
```

### Para actualizar el frontend
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Netlify despliega automáticamente
```

---

## 🎉 ¡Listo!

Tu aplicación Laboria está ahora desplegada en producción:

- **Backend**: `https://tu-backend.railway.app`
- **Frontend**: `https://tu-frontend.netlify.app`
- **Admin**: `https://tu-frontend.netlify.app/admin`

Usuarios pueden registrarse, buscar empleos/cursos y empresas pueden publicar ofertas.

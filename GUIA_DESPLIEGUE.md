# 🚀 Guía de Despliegue

## Frontend → Vercel · Backend → Render

---

## FRONTEND: Vercel (gratis y automático)

Vercel se conecta a tu GitHub, detecta que es un proyecto Vite y lo despliega solo.

### Paso 1: Ir a Vercel

1. Abre [vercel.com](https://vercel.com)
2. Crea una cuenta (puedes usar GitHub)
3. Haz clic en **Add New → Project**
4. Conecta tu repositorio `DamianMoares/Laboria-Frontend---backend_Damian`
5. Vercel detecta automáticamente:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. En **Environment Variables**:
   - `VITE_API_URL` → `https://laboria-backend.onrender.com` (la URL de Render, que tendrás después)

7. Haz clic en **Deploy**

### Paso 2: Obtener la URL

Cuando termine, Vercel te da una URL tipo:
```
https://laboria-frontend-backend-damian.vercel.app
```

Guarda esa URL. La necesitarás para configurar CORS en Render.

---

## BACKEND: Render (Node.js + PostgreSQL)

### Paso 3: Conectar repositorio en Render

1. Abre [render.com](https://render.com)
2. Crea una cuenta (puedes usar GitHub)
3. Dashboard → **New → Blueprint**
4. Conecta el mismo repositorio
5. Render detecta `render.yaml` y muestra:
   - **Web Service**: `laboria-backend` (Node.js)
   - **PostgreSQL**: `laboria-db`
6. Haz clic en **Apply**

### Paso 4: Esperar a que termine

Render tarda unos 3-5 minutos en:
1. Crear la base de datos PostgreSQL
2. Hacer build del backend (genera Prisma Client + migraciones)
3. Iniciar el servidor

### Paso 5: Ejecutar el Seed (crear usuarios demo)

1. Dashboard de Render → `laboria-backend` → pestaña **Shell**
2. Escribe:
   ```bash
   node prisma/seed.js
   ```
3. Verás que se crean 5 cuentas demo

### Paso 6: Obtener la URL del backend

Render te da una URL tipo:
```
https://laboria-backend.onrender.com
```

---

## CONECTAR FRONTEND CON BACKEND

### Paso 7: Actualizar variables

**En Vercel:**
1. Ve a tu proyecto en Vercel → **Settings → Environment Variables**
2. `VITE_API_URL` → `https://laboria-backend.onrender.com`

**En Render:**
1. Ve a `laboria-backend` → **Environment**
2. `CORS_ORIGINS` → añade la URL de Vercel (separada por comas si hay varias):
   ```
   https://laboria-frontend-backend-damian.vercel.app
   ```

### Paso 8: Redeploy

- **Vercel**: Ve a tu proyecto → **Deployments** → ... → **Redeploy**
- O simplemente haz push a main:

```bash
git add .
git commit -m "actualizar VITE_API_URL y CORS"
git push origin main
```

---

## VERIFICAR

1. Abre la URL de Vercel
2. Deberías ver Laboria funcionando
3. Prueba a registrarte o iniciar sesión
4. Prueba a crear un empleo/curso

---

## Resumen visual

```
┌─────────────────────┐      ┌─────────────────────┐
│                     │      │                     │
│  Vercel             │      │  Render             │
│  (Frontend React)   │─────>│  (Backend Node.js)  │
│                     │ API  │                     │
│  laboria.vercel.app │      │  laboria-backend    │
│                     │      │  .onrender.com      │
└─────────────────────┘      └────────┬────────────┘
                                      │
                                      ▼
                              ┌─────────────────────┐
                              │                     │
                              │  PostgreSQL          │
                              │  (Render Managed)    │
                              │                     │
                              └─────────────────────┘
```

# 🚀 Cómo conectar el Backend en Render

## El mapa de tu app

```
[Frontend en Vercel]  ──llama a──>  [Backend en Render]  ──usa──>  [Base de Datos]
  (botones bonitos)                   (Node.js + Prisma)             (PostgreSQL)
  laboria.vercel.app                  laboria-backend                laboria-db
                                      .onrender.com
```

## Requisitos antes de empezar

- Una cuenta en [render.com](https://render.com) (conectada con GitHub)
- Tu repositorio en GitHub con el `render.yaml` correcto
- El frontend ya desplegado en Vercel (para saber la URL)

---

## PASO 1: Configurar el archivo `render.yaml`

Este archivo le dice a Render **qué crear**. Está en la raíz de tu proyecto. Así debe verse:

```yaml
services:
  - type: web
    name: laboria-backend
    runtime: node
    plan: free
    buildCommand: cd backend && npm install && npm run build
    startCommand: cd backend && node server.js
    healthCheckPath: /
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: laboria-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_EXPIRES_IN
        value: 7d
      - key: CORS_ORIGINS
        value: https://laboria-frontend-backend-damian.vercel.app,*.vercel.app
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000

databases:
  - name: laboria-db
    plan: free
    databaseName: laboria
```

### Explicación (para que entiendas qué hace cada línea):

| Línea | ¿Qué hace? |
|---|---|
| `buildCommand: cd backend && npm install && npm run build` | Entra a la carpeta `backend/`, instala las librerías (express, prisma, etc.) y ejecuta el build (genera Prisma + crea las tablas en la DB) |
| `startCommand: cd backend && node server.js` | Cuando termine el build, arranca el servidor |
| `healthCheckPath: /` | Render le pega a `https://tuapp.onrender.com/` cada pocos segundos para ver si está viva |
| `DATABASE_URL` → `fromDatabase` | Render conecta automáticamente el web service con la base de datos. No tienes que escribir la URL |
| `JWT_SECRET` → `generateValue: true` | Render genera una clave secreta aleatoria para los tokens de login |
| `CORS_ORIGINS` | La lista de "quién puede hablar con mi backend" |
| `*.vercel.app` | Acepta cualquier subdominio de Vercel (así no importa si la URL cambia) |

---

## PASO 2: Subir los cambios a GitHub

Si modificaste el `render.yaml` u otros archivos, súbelos:

```bash
git add render.yaml
git commit -m "config: render.yaml listo para deploy"
git push origin main
```

---

## PASO 3: Borrar servicios viejos en Render (si los hay)

Si ya intentaste desplegar antes y falló, la base de datos puede estar **sucia** (tablas a medio crear). Hay que empezar limpio.

1. Abre [dashboard.render.com](https://dashboard.render.com)
2. Busca **`laboria-db`** — haz clic en **... → Delete Database**
   - Escribe el nombre para confirmar
3. Busca **`laboria-backend`** — haz clic en **... → Delete Service**

---

## PASO 4: Crear todo desde el Blueprint

1. En el Dashboard de Render, haz clic en **New + → Blueprint**
2. Conecta tu repositorio de GitHub
3. Render va a leer el `render.yaml` y te va a mostrar un resumen:
   - **Web Service**: `laboria-backend` (Node.js, Free)
   - **PostgreSQL**: `laboria-db` (Free)
4. Haz clic en **Apply**

### Lo que pasa automáticamente (sin que hagas nada):

Render hace esto en orden:

```
1. Crea la base de datos PostgreSQL  ────────────────  (30 segundos)
2. cd backend && npm install         ──── instala      (6 segundos)
   express, prisma, bcrypt, etc.
3. npx prisma generate               ──── prepara      (1 segundo)
   el traductor para hablar con la DB
4. npx prisma db push                ──── crea las     (2 segundos)
   tablas: usuarios, trabajos, cursos...
5. cd backend && node server.js      ──── arranca      (1 segundo)
   el servidor en el puerto 10000
```

Si todo sale bien, verás el servicio en verde con **"Live"** ✅

---

## PASO 5: Sembrar datos de prueba (seed)

Cuando el servicio ya esté **Live** (verde):

1. Ve a **Dashboard → laboria-backend → Shell**
2. Escribe este comando y presiona Enter:

```bash
cd backend && node prisma/seed.js
```

Esto crea 5 cuentas de prueba (admin, candidato, empresa, etc.) para que puedas hacer login.

---

## PASO 6: Verificar que funciona

1. Abre en tu navegador: `https://laboria-backend.onrender.com`
2. Deberías ver este mensaje:

```json
{"message":"¡Backend de Laboria funcionando!"}
```

3. Prueba el login desde el frontend de Vercel
4. Si ves errores de CORS, ve al Dashboard de Render:
   - `laboria-backend` → **Environment**
   - Revisa que `CORS_ORIGINS` tenga la URL de Vercel

---

## Solución de problemas comunes

### ❌ "Exited with status 1 while building your code"

**Causa**: El build falló por algún error.

**Qué hacer**: Haz clic en el deploy fallido → **View build logs**. Busca la línea en rojo que dice `Error:`.

### ❌ "migrate found failed migrations"

**Causa**: Un intento anterior dejó la base de datos a medias.

**Solución**: Borra la base de datos (`laboria-db`) y el servicio (`laboria-backend`) y vuelve a crear desde el Blueprint (Paso 3 y 4).

### ❌ "No 'Access-Control-Allow-Origin' header"

**Causa**: El backend no reconoce la URL del frontend.

**Solución**: En Render Dashboard → `laboria-backend` → **Environment** → edita `CORS_ORIGINS` y agrega la URL exacta de Vercel.

### ❌ "Type Role already exists" / Error 42710

**Causa**: La migración se ejecutó a medias y dejó objetos en la DB.

**Solución**: Borra la base de datos y vuelve a crearla desde el Blueprint.

### ❌ Error al hacer Sync del Blueprint: "ipAllowList"

**Causa**: Render Blueprint no acepta el formato de IPs que pusiste.

**Solución**: Asegúrate de que `render.yaml` **no tenga** `ipAllowList` (las conexiones internas de Render no lo necesitan).

---

## Resumen visual del flujo completo

```
GitHub                          Render
──────                          ──────
render.yaml  ──Blueprint──>   laboria-db (PostgreSQL)
                              laboria-backend (Node.js)
                                  │
                                  │ buildCommand:
                                  │ cd backend && npm install && npm run build
                                  │   → npm install (descarga librerías)
                                  │   → prisma generate (prepara Prisma)
                                  │   → prisma db push (crea tablas)
                                  │
                                  │ startCommand:
                                  │ cd backend && node server.js
                                  ▼
                              🟢 LIVE en https://laboria-backend.onrender.com
```

---

## Notas importantes

- **No necesitas IP Allow List**: La base de datos y el web service están en la misma red de Render, se conectan solos
- **Usa `prisma migrate deploy` en Render**: Es el comando recomendado para producción (ya configurado en `render.yaml`)
- **El seed se corre UNA SOLA VEZ** después del deploy, desde el Shell de Render
- **CORS con `*.vercel.app`**: Acepta cualquier URL de Vercel (producción y previsualizaciones)
- **Si algo falla**: Borra DB + servicio y vuelve a crear desde Blueprint. Es más rápido que debuggear

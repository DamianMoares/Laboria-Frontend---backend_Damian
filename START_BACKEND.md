# 🚀 Instrucciones para Iniciar el Backend Laboria

## ❌ PROBLEMA ACTUAL
PowerShell está bloqueando la ejecución de scripts debido a políticas de seguridad.

## ✅ SOLUCIONES

### Opción 1: Usar PowerShell como Administrador
1. **Abrir PowerShell como Administrador**
   - Click derecho en PowerShell → "Ejecutar como administrador"

2. **Ejecutar comando para habilitar scripts**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Responder "S" (Sí) cuando pregunte**

4. **Iniciar el backend**
   ```powershell
   cd "c:\Users\DMoares\Documents\Central de proyectos Webs\lab-css-recipes-clone-Damian\Laboria-Frontend---backend_Damian\backend"
   npm run dev
   ```

### Opción 2: Usar Command Prompt (cmd)
1. **Abrir Command Prompt** (Win + R → cmd → Enter)

2. **Navegar a la carpeta del backend**
   ```cmd
   cd "c:\Users\DMoares\Documents\Central de proyectos Webs\lab-css-recipes-clone-Damian\Laboria-Frontend---backend_Damian\backend"
   ```

3. **Iniciar el backend**
   ```cmd
   npm run dev
   ```

### Opción 3: Usar Terminal de VS Code
1. **Abrir VS Code**
2. **Abrir terminal integrado** (Ctrl + `)
3. **Navegar al backend**
   ```bash
   cd backend
   ```
4. **Iniciar el servidor**
   ```bash
   npm run dev
   ```

## 📋 ¿QUÉ DEBERÍAS VER?

Cuando el backend inicie correctamente, verás algo como:
```
> backend@1.0.0 dev
> nodemon server.js

[nodemon] starting `node server.js`
Servidor corriendo en http://localhost:3000
[nodemon] watching for changes...
```

## 🔍 VERIFICACIÓN

1. **Backend corriendo**: Abre http://localhost:3000 en tu navegador
   - Deberías ver: `{"message": "¡Backend de Laboria funcionando!"}`

2. **Frontend conectado**: En el frontend, presiona "Verificar conexión APIs"
   - Debería mostrar: "✅ Conectado al backend"

## 🛠️ SI SIGUE FALLANDO

### Verificar dependencias
```bash
cd backend
npm install
```

### Verificar variables de entorno
Asegúrate que existe el archivo `.env` con:
```env
DATABASE_URL=tu-url-postgresql
JWT_SECRET=tu-secreto-jwt
PORT=3000
```

### Iniciar directamente con Node
```bash
cd backend
node server.js
```

## 📞 AYUDA ADICIONAL

Si nada funciona, intenta:
1. Reiniciar tu computadora
2. Reinstalar Node.js
3. Usar una terminal diferente (Git Bash, WSL, etc.)

---

## 🎯 PASOS SIGUIENTES

Una vez que el backend esté corriendo:
1. ✅ Verifica que http://localhost:3000 responde
2. ✅ En el frontend, presiona "Verificar conexión APIs"
3. ✅ Prueba el registro y login
4. ✅ ¡Listo para desplegar en producción!

# 👥 **USUARIOS DE DEMOSTRACIÓN - LABORIA**

## 🎉 **USUARIOS CREADOS EXITOSAMENTE**

He creado 5 usuarios de demostración en la base de datos SQLite para que puedas probar el sistema con diferentes roles y funcionalidades.

---

## 📋 **CREDENCIALES DE DEMOSTRACIÓN**

| 📧 EMAIL | 🔐 CONTRASEÑA | 👤 ROL | 📋 NOMBRE |
|-----------|---------------|----------|-----------|
| **admin@laboria.com** | **admin123** | ADMIN | Administrador Laboria |
| **candidate@laboria.com** | **candidate123** | CANDIDATE | Juan Pérez |
| **company@laboria.com** | **company123** | COMPANY_EMPLOYEES | Tech Solutions S.A. |
| **recruiter@laboria.com** | **recruiter123** | COMPANY_STUDENTS | María González |
| **hybrid@laboria.com** | **hybrid123** | COMPANY_HYBRID | Carlos Rodríguez |

---

## 🎯 **FUNCIONALIDADES POR ROL**

### **👑 ADMIN (admin@laboria.com)**
- ✅ Acceso completo al sistema
- ✅ Gestión de todos los usuarios
- ✅ Configuración del sistema
- ✅ Panel de administración
- ✅ Estadísticas y reportes

### **👤 CANDIDATE (candidate@laboria.com)**
- ✅ Buscar y aplicar a trabajos
- ✅ Ver cursos disponibles
- ✅ Gestionar perfil personal
- ✅ Historial de aplicaciones
- ✅ Dashboard personal

### **🏢 COMPANY_EMPLOYEES (company@laboria.com)**
- ✅ Publicar ofertas de trabajo
- ✅ Ver aplicaciones recibidas
- ✅ Gestionar candidatos
- ✅ Panel de reclutamiento
- ✅ Estadísticas de contratación

### **🎓 COMPANY_STUDENTS (recruiter@laboria.com)**
- ✅ Publicar cursos y capacitación
- ✅ Gestionar estudiantes
- ✅ Ver progreso de cursos
- ✅ Panel educativo
- ✅ Certificaciones

### **🔄 COMPANY_HYBRID (hybrid@laboria.com)**
- ✅ Funciones de COMPANY + STUDENTS
- ✅ Publicar trabajos y cursos
- ✅ Gestión integral
- ✅ Panel combinado
- ✅ Reportes completos

---

## 🚀 **CÓMO USAR LOS USUARIOS DEMO**

### **1. Iniciar el Backend:**
```bash
cd backend
npm run dev
```

### **2. Iniciar el Frontend:**
```bash
cd frontend
npm run dev
```

### **3. Probar Login:**
1. Abre http://localhost:5173 en tu navegador
2. Usa cualquiera de las credenciales de la tabla
3. Explora las funcionalidades según el rol

### **4. Probar API Directamente:**
```bash
# Ejemplo de login con admin
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@laboria.com","password":"admin123"}'
```

---

## 🔧 **SCRIPTS CREADOS**

### **📄 scripts/seedDemoUsers.js**
- Script para crear usuarios de demostración
- Elimina usuarios existentes y crea nuevos
- Encripta contraseñas con bcrypt

### **📄 testDemoUsers.js**
- Script para verificar que todos los usuarios funcionen
- Prueba login para cada usuario
- Muestra tokens JWT generados

---

## ✅ **VERIFICACIÓN COMPLETADA**

Todos los usuarios de demostración han sido:
- ✅ **Creados** en la base de datos SQLite
- ✅ **Verificados** con login exitoso
- ✅ **Probados** con tokens JWT generados
- ✅ **Documentados** con credenciales claras

---

## 🎯 **PRÓXIMOS PASOS RECOMENDADOS**

1. **Probar cada rol** en el frontend
2. **Verificar permisos** según el rol
3. **Explorar funcionalidades** específicas
4. **Probar flujo completo** de usuario
5. **Documentar comportamiento** del sistema

---

## 📞 **COMANDOS ÚTILES**

```bash
# Recrear usuarios demo
node scripts/seedDemoUsers.js

# Verificar usuarios demo
node testDemoUsers.js

# Ver base de datos
npx prisma studio

# Reiniciar servidor
npm run dev
```

---

**¡Los usuarios de demostración están listos para usar!** 🎊

Ahora puedes probar el sistema Laboria con diferentes roles y funcionalidades completas.

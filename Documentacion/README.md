# Laboria — Documentación del Proyecto

> **Versión:** 2.0.0  
> **Fecha:** Mayo 2026  
> **PM:** Administrador del Proyecto  
> **Estado:** ✅ Producción — Todos los módulos críticos verificados

---

## 📋 Índice de documentos

| Documento | Descripción |
|-----------|-------------|
| [`01-VISION-ALCANCE.md`](01-VISION-ALCANCE.md) | Visión del producto, objetivos, alcance funcional |
| [`02-ARQUITECTURA.md`](02-ARQUITECTURA.md) | Arquitectura del sistema, stack tecnológico, diagramas |
| [`03-MODELO-DATOS.md`](03-MODELO-DATOS.md) | Esquema de base de datos, relaciones, índices |
| [`04-API-REFERENCIA.md`](04-API-REFERENCIA.md) | Referencia completa de la API REST |
| [`05-MANUAL-USUARIO.md`](05-MANUAL-USUARIO.md) | Manual de uso por rol (candidato, empresa, admin) |
| [`06-MANUAL-TECNICO.md`](06-MANUAL-TECNICO.md) | Instalación, configuración, despliegue, CI/CD |
| [`07-PLAN-PRUEBAS.md`](07-PLAN-PRUEBAS.md) | Estrategia de pruebas, cobertura, resultados |
| [`08-SEGURIDAD.md`](08-SEGURIDAD.md) | Arquitectura de seguridad, JWT, rate limiting |
| [`09-ROADMAP.md`](09-ROADMAP.md) | Mejoras futuras, items pendientes, hoja de ruta |
| [`10-GLOSARIO.md`](10-GLOSARIO.md) | Definiciones, roles, términos técnicos |
| [`USUARIOS_DEMO.md`](USUARIOS_DEMO.md) | Credenciales de usuarios de prueba |

---

## 📊 Resumen ejecutivo

Laboria es una plataforma full-stack que conecta candidatos con empresas y cursos de formación en el mercado español. Proporciona:

- **Búsqueda y aplicación a empleos** con agregación de múltiples APIs externas
- **Catálogo de cursos** con datos estáticos, propios y externos
- **Gestión de currículum vitae** con editor interactivo por secciones
- **Panel de administración** con estadísticas, auditoría y gestión completa
- **Autenticación JWT** con refresh tokens y 5 roles de usuario

| Métrica | Valor |
|---------|-------|
| Tests totales | **86** (57 frontend + 29 backend) |
| Archivos de test | **14** (8 frontend + 6 backend) |
| Hallazgos corregidos | **~90/95** (~95%) |
| Hallazgos pendientes | **~9** (todos baja prioridad 🟢) |
| Tiempo de build | **~7s** (838 módulos) |
| Chunks generados | **~70** (code splitting + vendor) |

---

## 🚀 Inicio rápido

```bash
# 1. Clonar
git clone <repo>
cd Laboria-Frontend---backend_Damian

# 2. Instalar dependencias
npm run install:all

# 3. Configurar variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Iniciar con Docker (recomendado)
docker compose up

# 5. O manualmente
npm run dev
```

---

## 🧪 Verificación rápida

```bash
# Tests completos
npm test

# Build producción
npm run build:frontend

# Health check backend
curl http://localhost:3000/health
```

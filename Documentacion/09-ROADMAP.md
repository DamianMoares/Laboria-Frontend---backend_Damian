# Roadmap y Mejoras Futuras

> **Documento:** 09-ROADMAP.md  
> **Versión:** 2.0  
> **Fecha:** Mayo 2026

---

## 1. Estado actual

| Aspecto | Estado |
|---------|--------|
| Core funcional | ✅ Completo |
| Autenticacion JWT | ✅ Completo |
| CRUD empleos/cursos | ✅ Completo |
| Aplicaciones | ✅ Completo |
| Curriculum vitae | ✅ Completo |
| Panel admin | ✅ Completo |
| Dashboard candidato | ✅ Completo |
| APIs externas | ✅ Completo |
| Tests (86) | ✅ Pasando |
| Build produccion | ✅ Exitoso |
| Docker | ✅ Configurado |
| Seguridad | ✅ Auditoria completa |
| Documentacion | ✅ Completa |

---

## 2. Pendientes inmediatos 🟢 (baja prioridad, ~4-6h)

| # | ID | Tarea | Esfuerzo | Impacto |
|---|----|-------|----------|---------|
| 1 | R-05 | Optimizar imagenes (logo WebP/SVG) | 30min | Bajo |
| 2 | R-06 | Anadir bundle analyzer | 30min | Bajo |
| 3 | UX-10 | Home.jsx "..." a Spinner | 15min | Medio |
| 4 | UX-11 | Eliminar codigo comentado en Home | 5min | Bajo |
| 5 | C-14 | Poblar o eliminar hooks/ vacio | 5min | Bajo |
| 6 | C-15 | Mover ConexionApi.jsx a services/ | 15min | Bajo |
| 7 | C-16 | ConfirmContext estilos inline a CSS Module | 30min | Bajo |
| 8 | C-02 | Anadir .editorconfig | 10min | Bajo |
| 9 | T-07 | Script test:coverage | 15min | Medio |

---

## 3. Proximas iteraciones

### Iteracion 3.1 — Calidad y dx (2-3 dias)

| Tarea | Descripcion |
|-------|-------------|
| Tests de integracion (supertest) | Probar API real sin mock de BD |
| Coverage reporting | Configurar nyc/c8 o vitest --coverage |
| Husky + lint-staged | Pre-commit hooks para lint y tests |
| Editorconfig | Estandarizar formato de archivos |

### Iteracion 3.2 — UX avanzada (3-4 dias)

| Tarea | Descripcion |
|-------|-------------|
| Modo oscuro | Toggle claro/oscuro con CSS custom properties |
| Notificaciones toast persistentes | Historial de notificaciones |
| Paginacion con scroll infinito | Mejorar UX de listados |
| Skeletons en lugar de Spinner | Loading mas natural |
| Filtros guardados en URL | Compartir resultados de busqueda |

### Iteracion 3.3 — Funcionalidades nuevas (4-5 dias)

| Tarea | Descripcion |
|-------|-------------|
| Mensajeria interna | Chat entre candidatos y empresas |
| Favoritos / Guardados | Marcar empleos/cursos para despues |
| Compartir ofertas | Enlaces a redes sociales / WhatsApp |
| Historial de visualizaciones | Empleos y cursos vistos recientemente |
| Exportar curriculum a PDF | Descargar CV en formato PDF |

### Iteracion 3.4 — Administracion avanzada (2-3 dias)

| Tarea | Descripcion |
|-------|-------------|
| Exportar datos a CSV/Excel | Usuarios, empleos, aplicaciones |
| Dashboard con graficos avanzados | Tendencia temporal, predicciones |
| Gestion de logs | Filtrar, buscar, limpiar audit logs |
| Roles personalizados | Permisos granulares por rol |

### Iteracion 3.5 — Internacionalizacion (3-4 dias)

| Tarea | Descripcion |
|-------|-------------|
| i18n con react-intl | Soporte multi-idioma |
| Traduccion al ingles | Contenido completo |
| Selector de idioma | Persistente en localStorage |
| URLs localizadas | Rutas por idioma (/es/empleos, /en/jobs) |

---

## 4. Vision a largo plazo (v3.0)

### 4.1 Plataforma

| Iniciativa | Descripcion |
|------------|-------------|
| Aplicacion movil | React Native o PWA avanzada |
| Marketplace de cursos | Pagos integrados (Stripe) |
| Bolsa de trabajo inteligente | Matching IA candidato-empleo |
| Comunidad | Foros, grupos, eventos |

### 4.2 Tecnico

| Iniciativa | Descripcion |
|------------|-------------|
| Migracion a TypeScript | Tipado completo frontend + backend |
| Microservicios | Separar auth, jobs, courses en servicios independientes |
| GraphQL API | Alternativa a REST para consultas complejas |
| Cache (Redis) | Sesiones, consultas frecuentes, rate limiting |
| CI/CD completo | GitHub Actions + tests automaticos + deploy |

### 4.3 Datos

| Iniciativa | Descripcion |
|------------|-------------|
| ML para recomendaciones | Empleos y cursos sugeridos segun perfil |
| Analitica avanzada | Embudos de conversion, retencion |
| Datos abiertos | API publica para terceros |

---

## 5. Changelog

### v2.0.0 (Mayo 2026)
- [x] Refactor normalizeJobDetails a strategy pattern
- [x] BrowserRouter en lugar de HashRouter
- [x] Componentes Spinner y EmptyState reutilizables
- [x] Tests para adminController y applicationController
- [x] Restauracion require.cache en tests backend
- [x] CONTRIBUTING.md
- [x] ~90/95 hallazgos de auditoria corregidos
- [x] 86 tests pasando (57 + 29)

### v1.0.0 (Anterior)
- [x] CRUD completo usuarios, empleos, cursos
- [x] Autenticacion JWT con refresh tokens
- [x] Panel de administracion completo
- [x] Integracion con APIs externas (6 jobs + 6 courses)
- [x] Editor de curriculum vitae
- [x] Code splitting + lazy loading
- [x] Docker compose
- [x] 75 tests pasando

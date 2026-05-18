# TAREAS — Laboria

**Tests:** 75/75 pasando (18 backend + 57 frontend)
**Correcciones:** 73/95 (77%) — última actualización: 18 mayo 2026

---

## ✅ Completado (esta sesión)

### Prioridad alta — los 4 grandes
- [x] **R-03**: Code splitting + lazy loading (28 rutas con `React.lazy` + vendor chunks en `vite.config.js`)
- [x] **UX-05**: CurriculumPage refactor (1005 → 120 líneas). Hook `useCurriculumSection` + componente `SectionEditor` reutilizable
- [x] **S-06/07**: Refresh tokens JWT + rate limit login. `generateRefreshToken()`, endpoint `/refresh-token`, frontend interceptor con cola de refresco
- [x] **CF-05**: Docker compose (`docker-compose.yml` + `Dockerfile` frontend/backend con nginx)

### Docs/Config (5)
- [x] DB-07: USUARIOS_DEMO.md sincronizado con seed.js passwords
- [x] CF-07: `*.log` añadido a backend/.gitignore + `git rm --cached server_output.log`
- [x] D-03: README actualizado con URLs Vercel
- [x] D-04: auditoria-completa.md archivado → `.old`
- [x] NF-02: GUIA_DESPLIEGUE.md corregido (migrate deploy, no db push)

### Seguridad (4)
- [x] S-06: `adminController.runTests()` bloqueado en producción
- [x] S-07: JWT expiración reducida 7d → 1d
- [x] S-08: console → `logger` silenciado en prod (nuevo `utils/logger.js`)
- [x] S-10: CORS `!origin` deniega en producción

### Base de datos (2)
- [x] DB-05: `@@index([status])` en Application y CourseApplication
- [x] DB-06: `AuditLog.adminId` con `@relation` a User (+ migración)

### Código (2)
- [x] R-02: Update/delete optimizados — admin bypass + select mínimo (1 query/campo)
- [x] CF-08: CI/CD ahora testea backend + frontend en paralelo

---

## 🟡 Pendientes (~8)

| Prioridad | Item | Esfuerzo |
|-----------|------|----------|
| Media | C-13: Refactor normalizeJobDetails (134 líneas) | 1h |
| Media | A-02: Skip links / landmark regions | 1h |
| Media | UX-01: Skeletons/spinners en estados de carga (Home.jsx) | 1h |
| Media | T-01/T-02: Tests adminController + applicationController | 4h |
| Baja | C-08: HashRouter → BrowserRouter | 1h |
| Baja | UX-06: Filtros duplicados en search pages | 30min |
| Baja | D-02: CONTRIBUTING.md | 1h |
| Baja | R-04: CSS sin purgar | 30min |

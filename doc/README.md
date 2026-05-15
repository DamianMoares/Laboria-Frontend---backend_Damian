# Documentación Técnica - Laboria

Plataforma de empleos y cursos desarrollada con React + Node.js + PostgreSQL.

## Volúmenes de documentación

| Volumen | Título | Cubre |
|---|---|---|
| 01 | [Configuración del proyecto](./volumen-01-configuracion/README.md) | Env files, vite.config, index.html, package.jsons, index.css |
| 02 | [Base de datos](./volumen-02-base-de-datos/README.md) | Modelos Prisma (User, Job, Course, Application), enums, migraciones, seed, estrategia de perfil |
| 03 | [Backend API](./volumen-03-backend-api/README.md) | server.js, middlewares (auth, owner, admin, error handler, rate limiter), controllers (user, job, course, application, admin), JWT utils, email service, rutas, diagrama de flujo |
| 04 | [Frontend](./volumen-04-frontend/README.md) | Estructura de proyecto, Vite config, HashRouter, AuthContext, servicios API, componentes, páginas, estrategia de perfil en localStorage, diagrama de autenticación |
| 05 | [Despliegue](./volumen-05-despliegue/README.md) | GitHub Pages + GitHub Actions, HashRouter, Base Path, workflow CI/CD, procedimiento paso a paso, troubleshooting |

## Guías adicionales

- [Guía de Despliegue (DEPLOY.md)](../DEPLOY.md) — Pasos rápidos para hacer deploy
- [API Reference (API_REFERENCIA.md)](../API_REFERENCIA.md) — Endpoints para Postman

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS 4, React Router 6 (HashRouter), Axios |
| Backend | Node.js, Express, Prisma ORM, JWT, bcrypt, Resend (email) |
| Base de datos | PostgreSQL |
| CI/CD | GitHub Actions (frontend → GitHub Pages) + Render Blueprint (backend + DB) |

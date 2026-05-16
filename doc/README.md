# Documentación Técnica - Laboria

Plataforma de empleos y cursos desarrollada con React + Node.js + PostgreSQL.

## Volúmenes de documentación

| Volumen | Título | Cubre |
|---|---|---|
| 01 | [Configuración del proyecto](./volumen-01-configuracion/README.md) | Env files, vite.config, index.html, package.jsons, index.css |
| 02 | [Base de datos](./volumen-02-base-de-datos/README.md) | Modelos Prisma (User, Job, Course, Application), enums, migraciones, seed, estrategia de perfil |
| 03 | [Backend API](./volumen-03-backend-api/README.md) | server.js, middlewares (auth, owner, admin, error handler, rate limiter, validate), controllers, JWT utils, email service, rutas, diagrama de flujo |
| 04 | [Frontend](./volumen-04-frontend/README.md) | Estructura de proyecto, Vite config, HashRouter, AuthContext, servicios API, componentes, páginas, CSS Modules, estrategia de perfil, diagrama de autenticación |
| 05 | [Despliegue](./volumen-05-despliegue/README.md) | Vercel + Render, vercel.json, render.yaml, CORS, troubleshooting, seed en producción |

## Guías adicionales

- [Guía de Despliegue (DEPLOY.md)](../DEPLOY.md) — Pasos rápidos para hacer deploy
- [API Reference (API_REFERENCIA.md)](../API_REFERENCIA.md) — Endpoints para Postman

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18, Vite, CSS Modules, React Router 6 (HashRouter), Fetch API |
| Backend | Node.js, Express 5, Prisma ORM, JWT, bcrypt, express-validator, Resend (email) |
| Base de datos | PostgreSQL |
| Frontend Tests | Vitest + jsdom + Testing Library (59 tests) |
| Backend Tests | Vitest (18 tests) |
| CI/CD | Vercel (frontend) + Render Blueprint (backend + DB) |

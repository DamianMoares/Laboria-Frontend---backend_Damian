# Contribuir a Laboria

## Requisitos

- Node.js 20+
- PostgreSQL 16+
- npm

## Setup

```bash
git clone <repo>
cd Laboria-Frontend---backend_Damian

# Backend
cd backend
cp .env.example .env   # configurar DB y JWT
npm install
npx prisma migrate deploy
npm run seed
npm run dev

# Frontend (otra terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Tests

```bash
# Todos
npm test

# Solo backend
cd backend && npm test

# Solo frontend
cd frontend && npm test
```

## Convenciones

- **JavaScript plano** — no TypeScript
- **CSS Modules** para estilos de componentes
- **ES Modules** en frontend, **CommonJS** en backend
- Nombres de archivo en camelCase o PascalCase para componentes
- Mensajes de commit en español o inglés, descriptivos

## Pull Requests

1. Crear rama desde `main`
2. Asegurar que `npm test` pase (75 tests)
3. Verificar build: `cd frontend && npm run build`
4. Crear PR con descripción clara

## Estructura

```
backend/         - API Express + Prisma
  src/controllers/
  src/routes/
  src/__tests__/
frontend/        - React + Vite SPA
  src/pages/
  src/components/
  src/services/
  src/context/
```

## Reportar bugs

Usar GitHub Issues con:
- Descripción del bug
- Pasos para reproducir
- Comportamiento esperado vs actual

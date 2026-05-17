# USUARIOS DE DEMOSTRACIÓN - LABORIA

---

## CREDENCIALES

| Email | Contraseña | Nombre | Rol |
|---|---|---|---|
| `admin@laboria.com` | `admin123` | Admin Laboria | ADMIN |
| `carlos@email.com` | `carlos123` | Carlos García López | CANDIDATE |
| `maria@email.com` | `maria123` | María Rodríguez Pérez | CANDIDATE |
| `javier@email.com` | `javier123` | Javier Martínez Ruiz | CANDIDATE |
| `info@techcorp.com` | `techcorp123` | TechCorp Solutions | COMPANY_EMPLOYEES |
| `info@edunext.com` | `edunext123` | EduNext Academy | COMPANY_STUDENTS |
| `info@innovagroup.com` | `innova123` | InnovaGroup | COMPANY_HYBRID |
| `info@datasoft.com` | `datasoft123` | DataSoft Technologies | COMPANY_EMPLOYEES |
| `info@cursosalfa.com` | `alfa123` | Cursos Alfa | COMPANY_STUDENTS |

---

## FUNCIONALIDADES POR ROL

### ADMIN (`admin@laboria.com`)
- Panel de administración con estadísticas
- Gestión de usuarios, empleos, cursos y aplicaciones
- Cambio de roles y eliminación de usuarios

### CANDIDATE (`carlos@email.com`, `maria@email.com`, `javier@email.com`)
- Buscar y aplicar a empleos
- Ver cursos disponibles
- Gestionar perfil personal
- Historial de aplicaciones

### COMPANY_EMPLOYEES (`info@techcorp.com`, `info@datasoft.com`)
- Publicar y gestionar ofertas de empleo
- Ver candidatos que aplicaron
- Gestionar aplicaciones (aceptar/rechazar)

### COMPANY_STUDENTS (`info@edunext.com`, `info@cursosalfa.com`)
- Publicar y gestionar cursos
- Contenido formativo

### COMPANY_HYBRID (`info@innovagroup.com`)
- Publicar empleos y cursos
- Gestión integral

---

## DATOS DE EJEMPLO CREADOS

### Empleos (8)
| Título | Empresa | Ubicación | Modalidad |
|---|---|---|---|
| Desarrollador Full Stack | TechCorp Solutions | Madrid | HYBRID |
| Data Scientist Senior | DataSoft Technologies | Barcelona | REMOTE |
| Diseñador UX/UI | InnovaGroup | Valencia | ONSITE |
| DevOps Engineer | TechCorp Solutions | Madrid | REMOTE |
| Profesor de Programación Web | EduNext Academy | Online | REMOTE |
| Analista de Ciberseguridad | DataSoft Technologies | Barcelona | HYBRID |
| Técnico de Marketing Digital | InnovaGroup | Valencia | ONSITE |
| Coordinador de Formación Online | EduNext Academy | Online | REMOTE |

### Cursos (8)
| Título | Proveedor | Categoría | Precio |
|---|---|---|---|
| React desde Cero | EduNext Academy | Desarrollo Web | Gratis |
| Node.js Avanzado | EduNext Academy | Desarrollo Web | 49€ |
| Python para Data Science | Cursos Alfa | Datos e IA | 79€ |
| Diseño UX/UI Profesional | Cursos Alfa | Diseño | 59€ |
| Ciberseguridad Práctica | EduNext Academy | Ciberseguridad | 89€ |
| Cloud Computing con AWS | Cursos Alfa | Cloud | 99€ |
| Marketing Digital Completo | EduNext Academy | Marketing | Gratis |
| Inglés Técnico para TI | Cursos Alfa | Idiomas | 39€ |

### Postulaciones (5)
| Candidato | Empleo | Estado |
|---|---|---|
| Carlos García | Desarrollador Full Stack | PENDING |
| María Rodríguez | Data Scientist Senior | PENDING |
| Javier Martínez | Diseñador UX/UI | PENDING |
| Carlos García | DevOps Engineer | PENDING |
| María Rodríguez | Analista de Ciberseguridad | PENDING |

---

## CÓMO PROBAR

### Local
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

Abrir http://localhost:5173

### Producción
- **Frontend**: https://laboria-frontend-backend-damian.vercel.app
- **Backend**: https://laboria-backend.onrender.com

### API Directa
```bash
# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@laboria.com","password":"admin123"}'

# Probar en producción
curl -X POST https://laboria-backend.onrender.com/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@laboria.com","password":"admin123"}'
```

---

## EJECUTAR SEED

Si necesitas recargar los datos (se borra y recrea todo automáticamente):

```bash
cd backend && node prisma/seed.js
```

Es seguro ejecutarlo múltiples veces (usa `findFirst` + `create` para empleos/cursos y `upsert` para usuarios).

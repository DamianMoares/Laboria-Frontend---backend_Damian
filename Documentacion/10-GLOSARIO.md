# Glosario

> **Documento:** 10-GLOSARIO.md  
> **Versión:** 2.0  
> **Fecha:** Mayo 2026

---

## A

| Termino | Definicion |
|---------|------------|
| **Access Token** | JWT de corta duracion (15 min) que autentica peticiones API |
| **ADMIN** | Rol de super-administrador con acceso completo al sistema |
| **Application** | Solicitud de un candidato a una oferta de empleo |
| **AuditLog** | Registro de acciones administrativas para trazabilidad |

## B

| Termino | Definicion |
|---------|------------|
| **bcrypt** | Algoritmo de hashing de contrasenas |
| **BrowserRouter** | Router de React Router DOM que usa la API History de HTML5 |

## C

| Termino | Definicion |
|---------|------------|
| **CANDIDATE** | Rol de usuario que busca empleo o formacion |
| **COMPANY_EMPLOYEES** | Rol de empresa que publica ofertas de empleo |
| **COMPANY_HYBRID** | Rol de empresa que publica empleos y cursos |
| **COMPANY_STUDENTS** | Rol de institucion educativa que publica cursos |
| **Course** | Recurso formativo publicado en la plataforma |
| **CourseApplication** | Inscripcion de un candidato a un curso |
| **Curriculum** | Datos del curriculum vitae de un candidato (JSON) |
| **CSS Modules** | Sistema de estilos con ambito local por componente |

## D

| Termino | Definicion |
|---------|------------|
| **DTO** | Data Transfer Object — objeto para transferencia de datos |

## E

| Termino | Definicion |
|---------|------------|
| **Enum** | Tipo de dato que restringe valores a un conjunto definido |
| **Error Boundary** | Componente React que captura errores en el arbol de componentes |
| **Express** | Framework web para Node.js |

## H

| Termino | Definicion |
|---------|------------|
| **Helmet** | Middleware Express que configura headers de seguridad HTTP |

## J

| Termino | Definicion |
|---------|------------|
| **Job** | Oferta de empleo publicada en la plataforma |
| **JWT** | JSON Web Token — estandar para autenticacion basada en tokens |

## L

| Termino | Definicion |
|---------|------------|
| **Lazy loading** | Carga diferida de componentes bajo demanda |
| **LoginSession** | Registro de inicio y cierre de sesion con duracion |

## M

| Termino | Definicion |
|---------|------------|
| **Middleware** | Funcion que se ejecuta en el pipeline de peticion/respuesta |

## N

| Termino | Definicion |
|---------|------------|
| **Normalizer** | Funcion que transforma datos de APIs externas al formato interno |

## O

| Termino | Definicion |
|---------|------------|
| **ORM** | Object-Relational Mapping — capa de abstraccion de BD |

## P

| Termino | Definicion |
|---------|------------|
| **Prisma** | ORM para Node.js/TypeScript con schema declarativo |
| **ProtectedRoute** | Componente que restringe acceso segun autenticacion/rol |

## R

| Termino | Definicion |
|---------|------------|
| **Rate limiting** | Limitacion de peticiones para prevenir abuso |
| **Refresh Token** | JWT de larga duracion (24h) para renovar access token |
| **Resend** | Servicio de envio de emails via API |

## S

| Termino | Definicion |
|---------|------------|
| **Seed** | Script que pobla la BD con datos de ejemplo |
| **SPA** | Single Page Application — aplicacion de una sola pagina |
| **Strategy pattern** | Patron de diseno que permite intercambiar algoritmos |
| **Suspense** | Componente React para manejo de estados de carga |

## U

| Termino | Definicion |
|---------|------------|
| **UUID** | Universal Unique Identifier — identificador unico universal |

## V

| Termino | Definicion |
|---------|------------|
| **Vite** | Build tool para frontend (alternativa moderna a Webpack) |
| **Vitest** | Framework de testing para Vite (compatible con Jest API) |

---

## Roles de usuario (resumen)

```
CANDIDATE           -> Busca empleo y formacion
COMPANY_EMPLOYEES   -> Publica empleos
COMPANY_STUDENTS    -> Publica cursos
COMPANY_HYBRID      -> Publica empleos y cursos
ADMIN               -> Gestiona todo el sistema
```

## Estados de aplicacion

```
PENDING   -> Solicitud pendiente de revision
ACCEPTED  -> Solicitud aceptada
REJECTED  -> Solicitud rechazada
```

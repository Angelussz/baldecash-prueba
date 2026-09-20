# BaldeCash — Prueba Técnica

Módulo de solicitudes de financiamiento para BaldeCash. Aplicación fullstack que permite registrar solicitudes, calcular la cuota mensual mediante el sistema de amortización francés y consultar las solicitudes existentes con paginación y filtro por estado.

## Stack tecnológico

| Capa          | Tecnología              |
|---------------|------------------------|
| Monorepo      | pnpm Workspace          |
| Backend       | NestJS + TypeScript     |
| Frontend      | Next.js 16 + TypeScript |
| Base de datos | PostgreSQL              |
| ORM           | Prisma 7                |
| Estilos       | Tailwind CSS v4         |
| Pruebas       | Jest                    |
| Node.js       | v24                     |

## Estructura del proyecto

```
baldecash-prueba/
├── apps/
│   ├── backend/
│   │   ├── prisma/
│   │   │   ├── migrations/       # Migraciones versionadas
│   │   │   ├── schema.prisma     # Esquema de base de datos
│   │   │   └── seed.ts           # Datos iniciales de prueba
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   ├── filters/
│   │   │   │   │   └── http-exception.filter.ts  # Filtro global de errores
│   │   │   │   └── pipes/
│   │   │   │       └── validation.pipe.ts        # Pipe de validación HTTP 422
│   │   │   ├── database/
│   │   │   │   ├── prisma.module.ts              # Módulo global de Prisma
│   │   │   │   └── prisma.service.ts             # Servicio NestJS para Prisma
│   │   │   ├── modules/
│   │   │   │   └── requests/
│   │   │   │       ├── dto/
│   │   │   │       │   ├── create-request.dto.ts
│   │   │   │       │   └── query-requests.dto.ts
│   │   │   │       ├── entities/
│   │   │   │       │   └── request.entity.ts
│   │   │   │       ├── requests.controller.ts
│   │   │   │       ├── requests.service.ts
│   │   │   │       └── requests.module.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── prisma7.config.ts     # Configuración de Prisma
│   │   ├── .env
│   │   └── package.json
│   │
│   └── frontend/
│       ├── src/app/
│       │   ├── page.tsx
│       │   ├── layout.tsx
│       │   └── globals.css
│       └── package.json
│
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── opencode.json
├── AGENT.md
└── README.md
```

## Requisitos previos

- [Node.js](https://nodejs.org/) v24 o superior
- [pnpm](https://pnpm.io/) v11 o superior
- [PostgreSQL](https://www.postgresql.org/) ejecutándose localmente

## Configuración del entorno

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de entorno

**Backend** — crea el archivo `apps/backend/.env`:

```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/baldecash?schema=public"
PORT=3001
```

**Frontend** — crea el archivo `apps/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 3. Base de datos

Ejecuta las migraciones para crear las tablas:

```bash
pnpm --filter backend prisma:migrate
```

Carga los datos iniciales de prueba:

```bash
pnpm --filter backend prisma:seed
```

El seed crea 3 solicitudes con diferentes estados: pendiente, aprobada y rechazada.

### 4. Ejecutar en desarrollo

```bash
# Backend (puerto 3001)
pnpm dev:backend

# Frontend (puerto 3000)
pnpm dev:frontend
```

## Base de datos

### Schema

La tabla `solicitudes` almacena las solicitudes de financiamiento:

| Columna        | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| `id`           | UUID           | Identificador único (generado automáticamente) |
| `nombres`      | Text           | Nombres del solicitante              |
| `apellidos`    | Text           | Apellidos del solicitante            |
| `dni`          | Text           | Documento de identidad (8 dígitos)   |
| `correo`       | Text           | Correo electrónico                   |
| `telefono`     | Text           | Teléfono (9 dígitos, inicia con 9)   |
| `monto`        | Decimal(10,2)  | Monto solicitado en soles            |
| `plazo`        | Int            | Plazo en meses (6, 12, 18 o 24)     |
| `cuota_mensual`| Decimal(10,2)  | Cuota mensual calculada              |
| `estado`       | Enum           | `pendiente`, `aprobada` o `rechazada`|
| `created_at`   | DateTime       | Fecha de creación                    |
| `updated_at`   | DateTime       | Fecha de última actualización        |

### Seed

El seed (`apps/backend/prisma/seed.ts`) inserta 3 registros de ejemplo:

- **Juan Carlos Pérez** — S/ 3,500 a 12 meses — Estado: pendiente
- **María Elena Rodríguez** — S/ 5,000 a 18 meses — Estado: aprobada
- **Luis Alberto Mendoza** — S/ 2,000 a 6 meses — Estado: rechazada

Para ejecutar el seed:

```bash
pnpm --filter backend prisma:seed
```

## Decisiones técnicas

### Prisma con adapter-pg

Se utiliza `@prisma/adapter-pg` para conectar Prisma con un pool de conexiones de `pg`. Esto permite un mejor control de las conexiones a la base de datos en comparación con el cliente HTTP por defecto.

### Sistema de amortización francés

La cuota mensual se calcula con la fórmula:

```
cuota = P × (i × (1 + i)^n) / ((1 + i)^n - 1)
```

Donde:
- `P` = monto financiado
- `n` = cantidad de meses
- `i` = tasa de interés mensual (24% anual / 12 = 2%)

**Ejemplo:** S/ 3,000 a 12 meses → cuota = S/ 283.68

La cuota se redondea a dos decimales y se almacena como `Decimal` en la base de datos para evitar problemas de precisión.

### pnpm Workspace

Monorepositorio con pnpm Workspace permite:
- Instalar dependencias de forma centralizada
- Ejecutar scripts de múltiples aplicaciones desde la raíz
- Compartir configuraciones de TypeScript y ESLint
- Mantener una estructura preparada para agregar nuevos paquetes

## Scripts principales

Desde la raíz del monorepositorio:

| Comando                | Descripción                          |
|------------------------|--------------------------------------|
| `pnpm dev:backend`     | Ejecutar backend en modo desarrollo  |
| `pnpm dev:frontend`    | Ejecutar frontend en modo desarrollo |
| `pnpm build:backend`   | Compilar el backend                  |
| `pnpm build:frontend`  | Compilar el frontend                 |

Scripts específicos del backend:

| Comando                           | Descripción                          |
|-----------------------------------|--------------------------------------|
| `pnpm --filter backend prisma:migrate` | Ejecutar migraciones de Prisma  |
| `pnpm --filter backend prisma:seed`    | Cargar datos iniciales           |
| `pnpm --filter backend prisma:generate`| Generar cliente de Prisma        |
| `pnpm --filter backend lint`           | Ejecutar linter (oxlint)         |
| `pnpm --filter backend test`           | Ejecutar pruebas con Jest        |

## API

### Crear una solicitud

```http
POST /solicitudes
Content-Type: application/json
```

Body:

```json
{
  "nombres": "Ana María",
  "apellidos": "Pérez Quispe",
  "dni": "71234567",
  "correo": "ana.perez@example.com",
  "telefono": "987654321",
  "monto": 3000,
  "plazo": 12
}
```

Respuesta `201`:

```json
{
  "id": "uuid",
  "nombres": "Ana María",
  "apellidos": "Pérez Quispe",
  "dni": "71234567",
  "correo": "ana.perez@example.com",
  "telefono": "987654321",
  "monto": 3000,
  "plazo": 12,
  "cuotaMensual": 283.68,
  "estado": "pendiente",
  "createdAt": "2026-09-20T14:00:00.000Z",
  "updatedAt": "2026-09-20T14:00:00.000Z"
}
```

### Listar solicitudes

```http
GET /solicitudes?page=1&limit=10&estado=pendiente
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `page` | number | Número de página. Por defecto: `1` |
| `limit` | number | Registros por página. Por defecto: `10` |
| `estado` | string | `pendiente`, `aprobada` o `rechazada` |

Respuesta `200`:

```json
{
  "data": [
    {
      "id": "uuid",
      "nombres": "Ana María",
      "apellidos": "Pérez Quispe",
      "dni": "71234567",
      "correo": "ana.perez@example.com",
      "telefono": "987654321",
      "monto": 3000,
      "plazo": 12,
      "cuotaMensual": 283.68,
      "estado": "pendiente",
      "createdAt": "2026-09-20T14:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

## Validaciones

La API aplica las siguientes validaciones:

- **DNI:** exactamente 8 dígitos numéricos
- **Correo:** formato email válido
- **Teléfono:** 9 dígitos que empiecen en 9
- **Monto:** entre 1,000 y 10,000
- **Plazo:** 6, 12, 18 o 24 meses
- **Estado:** pendiente, aprobada o rechazada

Los errores de validación responden con HTTP **422**:

```json
{
  "statusCode": 422,
  "message": "Error de validación",
  "errors": [
    {
      "field": "dni",
      "message": "El DNI debe contener exactamente 8 dígitos"
    },
    {
      "field": "monto",
      "message": "El monto debe estar entre S/ 1,000 y S/ 10,000"
    }
  ],
  "timestamp": "2026-09-20T14:00:00.000Z",
  "path": "/solicitudes"
}
```

Los errores no controlados son procesados por un filtro global para evitar exponer trazas o detalles internos al consumidor de la API.

## Cálculo de la cuota

Se utiliza el sistema de amortización francés, con una tasa anual fija del `24%`.

La tasa mensual se obtiene de la siguiente forma:

```text
i = 0.24 / 12 = 0.02
```

La fórmula aplicada es:

```text
cuota = P × (i × (1 + i)^n) / ((1 + i)^n - 1)
```

Donde:

- `P` = monto financiado
- `n` = cantidad de meses
- `i` = tasa de interés mensual

**Ejemplo:** S/ 3,000 a 12 meses → cuota = S/ 283.68

La cuota se redondea a dos decimales y se almacena como `Decimal` en la base de datos para evitar problemas de precisión.

## Estado actual

### Completado

- [x] Configuración del monorepo con pnpm Workspace
- [x] Schema de base de datos (Prisma)
- [x] Migración inicial (`solicitudes`)
- [x] Seed con 3 solicitudes de prueba
- [x] Configuración de NestJS con Prisma y ConfigModule
- [x] Servicio Prisma con pool de conexiones
- [x] API REST de solicitudes (POST y GET)
- [x] Validaciones de entrada (DTOs con class-validator)
- [x] Filtro global de errores HTTP 422
- [x] Cálculo de cuota mensual (sistema francés)

### Pendiente

- [ ] Frontend: formulario de registro de solicitudes
- [ ] Frontend: listado con paginación y filtros
- [ ] Pruebas unitarias del cálculo de cuota
- [ ] Integración frontend-backend

## Uso de IA

Para desarrollar esta solución se utilizó **OpenCode** como herramienta de apoyo en:

- Revisión de la estructura del monorepositorio
- Generación inicial de tipos y DTOs
- Revisión de validaciones
- Verificación de la fórmula de amortización francesa
- Sugerencias de pruebas unitarias
- Revisión de redacción y organización del README

Todo el código generado o sugerido fue revisado, adaptado y probado manualmente. Las decisiones técnicas y el funcionamiento de la solución son comprendidos por el autor y pueden ser explicados durante la defensa técnica.

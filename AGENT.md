# BaldeCash — Módulo de solicitudes de financiamiento
Monorepositorio desarrollado para BaldeCash, esto es una aplicación fullStack.

La aplicación permite registrar solicitudes de financiamiento, calcular la cuota mensual mediante el sistema de amortización francés y consultar las solicitudes existentes con paginación y filtro por estado.

## Tecnologías

- **Monorepo:** pnpm Workspace
- **Backend:** NestJS + TypeScript
- **Frontend:** Next.js + TypeScript
- **Base de datos:** PostgreSQL
- **ORM:** Prisma
- **Validación:** class-validator y class-transformer
- **Estilos:** Tailwind CSS
- **Pruebas:** Jest
- **Gestión de paquetes:** pnpm

## Estructura del proyecto

```
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   ├── filters/
│   │   │   │   ├── interceptors/
│   │   │   │   └── pipes/
│   │   │   ├── database/
│   │   │   ├── modules/
│   │   │   │   └── requests/
│   │   │   │       ├── dto/
│   │   │   │       ├── entities/
│   │   │   │       ├── requests.controller.ts
│   │   │   │       ├── requests.service.ts
│   │   │   │       └── requests.module.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── frontend/
│       ├── app/
│       │   ├── requests/
│       │   ├── page.tsx
│       │   └── layout.tsx
│       ├── components/
│       ├── lib/
│       │   ├── api.ts
│       │   └── types.ts
│       ├── .env.example
│       └── package.json
│
├── packages/
│   ├── eslint-config/
│   └── tsconfig/
│
├── pnpm-workspace.yaml
├── package.json
├── pnpm-lock.yaml
└── README.md
```
## Variables de entorno

### Backend

Crea el archivo `apps/api/.env` si no lo hay a partir del ejemplo:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Contenido sugerido:

```env
NODE_ENV=development
PORT=3001

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/baldecash?schema=public"

FRONTEND_URL="http://localhost:3000"

ANNUAL_INTEREST_RATE=0.24
```

Descripción de las variables:

| Variable | Descripción |
|---|---|
| `NODE_ENV` | Entorno de ejecución |
| `PORT` | Puerto de la API |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL |
| `FRONTEND_URL` | Origen permitido para CORS |
| `ANNUAL_INTEREST_RATE` | Tasa anual utilizada para calcular la cuota |

### Frontend

Crea el archivo `apps/frontend/.env.local`:

```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```

Contenido sugerido:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Base de datos

Las tablas se crean mediante migraciones versionadas de Prisma.

Ejecuta las migraciones:

```bash
pnpm --filter backend prisma:migrate
```

Para cargar las solicitudes de ejemplo:

```bash
pnpm --filter backend prisma:seed
```

El seeder crea al menos tres solicitudes con diferentes estados para probar el listado, la paginación y el filtro.

En un entorno de producción o CI también puede utilizarse:

```bash
pnpm --filter backend prisma:deploy
```

## Ejecución en desarrollo

Los servicios estarán disponibles en:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)

La documentación interactiva de la API estará disponible en:

- Swagger: [http://localhost:3001/api](http://localhost:3001/api)

Puedes ejecutar cada aplicación por separado:

```bash
pnpm dev:backend
```

```bash
pnpm dev:frontend
```

## Scripts principales

Desde la raíz del monorepositorio:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm format
```

Scripts específicos:

```bash
pnpm --filter backend dev
pnpm --filter backend build
pnpm --filter backend test
pnpm --filter backend test:watch
pnpm --filter backend prisma:migrate
pnpm --filter backend prisma:seed
pnpm --filter frontend dev
pnpm --filter frontend build
pnpm --filter frontend lint
```

## Funcionalidades

### Registro de solicitudes

La vista de formulario permite ingresar:

- Nombres y apellidos del estudiante.
- DNI.
- Correo electrónico.
- Teléfono.
- Monto solicitado.
- Plazo de financiamiento.

Al enviar el formulario, el backend:

1. Valida los datos recibidos.
2. Usa el estado `pendiente` por defecto.
3. Calcula la cuota mensual.
4. Persiste la solicitud.
5. Devuelve el registro creado junto con la cuota calculada.

La interfaz muestra estados de carga, errores de validación y confirmación de éxito.

### Listado de solicitudes

La vista de listado permite:

- Visualizar las solicitudes en una tabla.
- Cambiar de página.
- Filtrar por estado.
- Consultar el total de registros.
- Visualizar el monto, plazo, estado y cuota mensual.

## API

### Crear una solicitud

```http
POST /solicitudes
Content-Type: application/json
```

Ejemplo de solicitud:

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

Ejemplo de respuesta:

```json
{
  "id": 1,
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
GET /solicitudes
```

Parámetros disponibles:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `page` | number | Número de página. Por defecto: `1` |
| `limit` | number | Registros por página. Por defecto: `10` |
| `estado` | string | `pendiente`, `aprobada` o `rechazada` |

Ejemplo:

```http
GET /solicitudes?page=1&limit=10&estado=pendiente
```

Ejemplo de respuesta:

```json
{
  "data": [
    {
      "id": 1,
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

- El monto debe estar entre S/ 1,000 y S/ 10,000.
- El plazo solo puede ser `6`, `12`, `18` o `24` meses.
- El DNI debe contener exactamente 8 dígitos numéricos.
- El correo debe tener un formato válido.
- El teléfono debe contener 9 dígitos y comenzar con `9`.
- El estado solo puede ser `pendiente`, `aprobada` o `rechazada`.
- El estado inicial de una nueva solicitud es `pendiente`.

Los errores de validación responden con HTTP `422` y un cuerpo estructurado:

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

Se utiliza el sistema de amortización francés, con una tasa anual configurable de `24%`.

La tasa mensual se obtiene de la siguiente forma:

```text
i = 0.24 / 12 = 0.02
```

La fórmula aplicada es:

```text
cuota = P * (i * (1 + i)^n) / ((1 + i)^n - 1)
```

Donde:

- `P`: monto financiado.
- `n`: cantidad de meses.
- `i`: tasa de interés mensual.

Para un monto de `S/ 3,000` a `12` meses:

```text
cuota = S/ 283.68
```

La cuota se redondea a dos decimales antes de almacenarse y devolverse al cliente.

Para evitar problemas comunes de precisión con valores monetarios:

- La cuota se calcula con precisión decimal suficiente.
- La respuesta se redondea a dos decimales.
- La columna monetaria utiliza un tipo decimal en la base de datos.
- No se utiliza `float` como tipo principal para persistir importes.

## Decisiones técnicas

### Monorepositorio con pnpm Workspace

Se utiliza pnpm Workspace para mantener frontend y backend en un mismo repositorio, compartir configuraciones y ejecutar comandos desde la raíz.

Esto permite:

- Instalar dependencias de forma centralizada.
- Ejecutar scripts de varias aplicaciones.
- Compartir configuraciones de TypeScript y ESLint.
- Mantener una estructura preparada para agregar nuevos paquetes.

### Separación por módulos

El backend está organizado por módulos de negocio. La funcionalidad de solicitudes se separa en:

- Controller: recibe las peticiones HTTP.
- DTO: define y valida los datos de entrada.
- Service: contiene las reglas de negocio.
- Repository o Prisma Service: gestiona la persistencia.
- Entity o tipos de respuesta: define la forma de los datos expuestos.

El controlador no contiene reglas de cálculo ni acceso directo a la base de datos.

### Cálculo aislado

El cálculo de la cuota se mantiene en una función o servicio independiente para facilitar:

- Pruebas unitarias.
- Reutilización.
- Modificación futura de la tasa.
- Lectura y revisión durante la defensa técnica.

### API centralizada en el frontend

Las llamadas HTTP del frontend pasan por:

```text
apps/frontend/lib/api.ts
```

Los componentes no realizan llamadas `fetch` directamente. Esto centraliza:

- La URL base.
- La serialización de parámetros.
- El tratamiento de errores.
- La tipificación de las respuestas.

### Migraciones versionadas

El esquema se crea y modifica mediante migraciones de Prisma. No se utiliza SQL manual como mecanismo principal de creación de tablas.

Esto permite reproducir el esquema en un entorno limpio y mantener el historial de cambios de la base de datos.

## Pruebas

Ejecuta todas las pruebas con:

```bash
pnpm test
```

El cálculo de la cuota incluye pruebas para:

- Monto de `S/ 3,000` y plazo de `12` meses.
- Todos los plazos permitidos.
- Valores mínimos y máximos del monto.
- Redondeo a dos decimales.
- Validación de entradas no permitidas.

Para ejecutar únicamente las pruebas del backend:

```bash
pnpm --filter api test
```
## Alcance y pendientes

### Implementado

- API para crear solicitudes.
- API para listar solicitudes.
- Paginación.
- Filtro por estado.
- Cálculo de cuota mensual.
- Validaciones de entrada.
- Respuestas de error estructuradas.
- Persistencia en PostgreSQL.
- Migraciones versionadas.
- Seeder con solicitudes de ejemplo.
- Formulario web.
- Vista de listado.
- Estados de carga, error y éxito.
- Pruebas unitarias del cálculo.

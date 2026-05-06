# World-Forge Backend

Backend API del proyecto **World-Forge**.

Este backend:

- Consume el paquete interno `@world-forge/domain`
- Expone endpoints HTTP con Express
- Implementa persistencia real con MongoDB Atlas
- Mantiene arquitectura limpia: `domain` define contratos, `infra` implementa

---

## Stack

- Node.js
- Express
- TypeScript
- tsx
- dotenv
- cors
- mongoose

---

## Cómo arrancar el backend

```bash
cd apps/backend
npm install
npm run start
```

Servidor:
<http://localhost:3001>

Salida esperada:

- `Using DNS servers: 8.8.8.8, 1.1.1.1` (si aplica el fallback DNS)
- `Mongo connected. Database: worldforge | Host: ...`
- `Server running in development mode`
- `http://localhost:3001`

### Scripts disponibles

```bash
npm run start
npm run dev
npm run start:test
npm run dev:test
```

- `start`: arranca el servidor usando `.env`
- `dev`: arranca el servidor usando `.env` en modo watch
- `start:test`: arranca el servidor usando `.env.test`
- `dev:test`: arranca el servidor usando `.env.test` en modo watch

### Variables de entorno

Archivo `.env`:

```env
PORT=3001
DNS_SERVERS=8.8.8.8,1.1.1.1
MONGO_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER_HOST>/worldforge
```

Archivo `.env.test`:

```env
PORT=3002
DNS_SERVERS=8.8.8.8,1.1.1.1
MONGO_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER_HOST>/worldforge_test
```

`DNS_SERVERS` se usa como fallback local cuando Node no logra resolver el registro SRV de MongoDB Atlas con el DNS del sistema.

## Health Check

`GET /health`

Response

```json
{
  "status": "ok",
  "service": "world-forge-backend"
}
```

## Domain

El backend consume `@world-forge/domain` como librería interna.

- No modifica modelos del dominio
- No redefine entidades
- No contiene lógica de negocio de persistencia
- `domain` define contratos, interfaces y tipos
- La lógica de aplicación vive en `application/services`

## Estructura actual

```text
apps/backend/src
├─ application/
│  ├─ dtos/
│  │  ├─ character/
│  │  └─ universe/
│  ├─ errors/
│  ├─ ids/
│  ├─ mappers/
│  ├─ services/
│  └─ validators/
├─ controllers/
│  ├─ character.controller.ts
│  └─ universe.controller.ts
├─ infra/
│  ├─ db/
│  │  ├─ mongo.bootstrap.ts
│  │  └─ mongo.connection.ts
│  ├─ mappers/
│  │  ├─ character.mongo-mapper.ts
│  │  └─ universe.mongo-mapper.ts
│  ├─ repositories/
│  │  └─ mongo/
│  │     ├─ mongo-character.repository.ts
│  │     └─ mongo-universe.repository.ts
│  └─ schemas/
│     ├─ character.schema.ts
│     └─ universe.schema.ts
├─ middlewares/
│  └─ error-handler.middleware.ts
├─ routes/
│  ├─ character.routes.ts
│  ├─ health.route.ts
│  └─ universe.routes.ts
├─ app.ts
└─ server.ts
```

## Persistencia real con MongoDB Atlas

El backend conecta a MongoDB Atlas sin cambiar controllers, routes ni services; sólo cambia el wiring de infraestructura.

### Configuración

- Cluster: `AniverseDB`
- Bases de datos usadas: `worldforge` y `worldforge_test`
- Conexión por variable de entorno: `MONGO_URI`

En `.env`:

```env
PORT=3001
DNS_SERVERS=8.8.8.8,1.1.1.1
MONGO_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER_HOST>/worldforge?retryWrites=true&w=majority
```

Notas:

- El URI se obtiene en MongoDB Atlas → Connect → Drivers
- No commitear credenciales reales
- Si Node falla con `querySrv ECONNREFUSED`, revisar `DNS_SERVERS` o el DNS del sistema

## Conexión y arranque

La conexión a Mongo se ejecuta antes de levantar el servidor.

Archivos clave:

- `src/infra/db/mongo.connection.ts`
- `src/infra/db/mongo.bootstrap.ts`
- `src/server.ts`

Integración:

- `src/server.ts` carga `.env` o `.env.test` según `NODE_ENV`
- `src/server.ts` aplica `DNS_SERVERS` antes de conectarse a MongoDB
- `bootstrapMongoDB()` se ejecuta antes de `app.listen()`
- Si Mongo falla, el backend no arranca

## Persistencia de Character y Universe

Infraestructura disponible:

- Schemas: `character.schema.ts`, `universe.schema.ts`
- Mappers: `character.mongo-mapper.ts`, `universe.mongo-mapper.ts`
- Repositorios: `mongo-character.repository.ts`, `mongo-universe.repository.ts`

En `Character`:

- `_id` es string
- `categories` se guarda como `string[]`
- `notes` puede venir como `null` desde Mongo y se normaliza en el mapper
- `archive` cambia el `status` a `ARCHIVED`

## Endpoints

### Character

Base:
<http://localhost:3001/characters>

Crear: `POST /characters`

```json
{
  "name": "Hu Tao",
  "status": "DRAFT",
  "categories": ["Caótico", "Emocional"],
  "identity": "Equilibra humor y muerte.",
  "inspirations": ["Genshin Impact"],
  "notes": "Primer character persistido en Mongo"
}
```

Obtener por ID: `GET /characters/:id`

Listar: `GET /characters`

Actualizar: `PATCH /characters/:id`

```json
{
  "status": "ACTIVE",
  "notes": "Actualizada"
}
```

Archivar: `POST /characters/:id/archive`

### Universe

Base:
<http://localhost:3001/universes>

El backend también expone rutas para `universe` con el mismo esquema de persistencia Mongo.

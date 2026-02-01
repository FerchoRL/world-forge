 # World-Forge Backend

Backend API del proyecto **World-Forge**.

Este backend:

- Consume el paquete interno `@world-forge/domain`
- Expone endpoints HTTP (Express)
- Implementa persistencia real con MongoDB Atlas (FASE 4)
- Mantiene arquitectura limpia: domain define contratos, infra implementa

---

## 🚀 Stack

- Node.js
- Express
- TypeScript
- tsx (dev server con hot reload)
- dotenv
- cors
- mongoose (MongoDB Atlas)

---

## ▶️ Cómo arrancar el backend

```bash
cd apps/backend
npm install
npm run dev
```

Servidor:
<http://localhost:3001>

Salida esperada:
🟢 MongoDB connected
Server is running on <http://localhost:3001>

## ❤️ Health Check

`GET /health`

Response

```json
{
  "status": "ok",
  "service": "world-forge-backend"
}
```

## 📦 Domain

El backend consume @world-forge/domain como librería interna.

- No modifica modelos del dominio
- No redefine entidades
- No contiene lógica de negocio
- El domain define contratos (interfaces/tipos)
- La lógica vive en Application/Services (cuando toque)

## 🧱 Estructura actual

```text
apps/backend/src
├─ application/
│  ├─ dtos/
│  │  ├─ character/
│  │  ├─ location/
│  │  └─ universe/
│  ├─ errors/
│  ├─ ids/
│  ├─ mappers/
│  └─ services/
├─ controllers/
│  └─ character.controller.ts
├─ infra/
│  ├─ db/
│  │  ├─ mongo.bootstrap.ts
│  │  └─ mongo.connection.ts
│  ├─ mappers/
│  │  └─ character.mongo-mapper.ts
│  ├─ repositories/
│  │  ├─ in-memory/
│  │  └─ mongo/
│  │     └─ mongo-character.repository.ts
│  └─ schemas/
│     └─ character.schema.ts
├─ routes/
│  ├─ character.routes.ts
│  └─ health.route.ts
├─ app.ts
└─ server.ts

```

## 🟠 FASE 4 — Persistencia real (MongoDB Atlas)

Esta fase conecta el backend a MongoDB Atlas y reemplaza repositorios in-memory por repositorios reales,
sin cambiar controllers, routes ni services (solo wiring).

### ✅ Configuración (Atlas)

- Cluster: AniverseDB (existente)
- Base de datos: worldforge
- Collection: characters (primer agregado persistente)
- Conexión por variable de entorno: MONGO_URI

En .env:

```env
PORT=3001
MONGO_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER_HOST>/worldforge?retryWrites=true&w=majority
```

Nota:

- El URI se obtiene en MongoDB Atlas → Connect → Drivers
- No commitear credenciales

## 🔌 Conexión y arranque

La conexión a Mongo se ejecuta antes de levantar el servidor.

Archivos:

- src/infra/db/mongo.connection.ts
- src/infra/db/mongo.bootstrap.ts

Integración:

- src/server.ts ejecuta bootstrapMongo() antes de app.listen()
- Si Mongo falla → el backend no arranca

## 📦 Character persistente (schema + mapper + repo)

### Schema (ODM)

Archivo:

- src/infra/schemas/character.schema.ts

Decisiones:

- _id es string (compatible con CharacterId)
- categories se guarda como string[]
- notes puede venir como null desde Mongo
- timestamps activados

### Mapper (Domain ↔ Mongo)

Archivo:

- src/infra/mappers/character.mongo-mapper.ts

Decisiones:

- Mongo → domain: normaliza notes: null a undefined
- Mongo devuelve categories: string[]; el domain usa CategoryName[] (se mapea sin lógica)

### Repositorio Mongo (infra)

Archivo:

- src/infra/repositories/mongo/mongo-character.repository.ts

Implementa el contrato del domain:

- getById(id): RepoResult<Character | null>
- list(): RepoResult<Character[]>
- create(input): RepoResult<Character>
- update(id, patch): RepoResult<Character>
- archive(id): RepoResult<void> (status → ARCHIVED)

## 🔁 Switch de implementación (sin romper nada)

- Antes: repositorio in-memory

- Ahora: repositorio mongo

Solo cambió la instancia inyectada/creada del repositorio

## 🌐 Endpoints

### Character

Base:
<http://localhost:3001/characters>

Crear: POST /characters

body

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

Obtener por ID: GET /characters/:id

Listar: GET /characters

Actualizar (patch): PATCH /characters/:id

body

```json
{
  "status": "ACTIVE",
  "notes": "Actualizada"
}
```

Archivar: POST /characters/:id/archive

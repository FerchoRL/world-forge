# World-Forge Backend

Backend API del proyecto **World-Forge**.

Este backend:

- Consume el paquete interno `domain`
- Sirve como esqueleto para casos de uso futuros

---

## 🚀 Stack

- Node.js
- Express
- TypeScript
- tsx (dev server con hot reload)
- dotenv
- cors

---

## ▶️ Cómo arrancar el backend

Desde la raíz del proyecto o directamente en `apps/backend`:

```bash
cd apps/backend
npm install
npm run dev
```

El servidor corre por defecto en:

<http://localhost:3001>

❤️ Health Check

Endpoint disponible para validar que el backend está activo:

```ts
//GET /health
{
  "status": "ok",
  "service": "world-forge-backend"
}

```

Puedes probarlo en:

- Navegador
- Postman
- curl

📦 Domain

El backend consume el paquete domain como librería interna:

No modifica modelos del dominio

No redefine entidades

No contiene lógica del dominio

Toda la lógica de negocio se implementará en la Application Layer (FASE 3).

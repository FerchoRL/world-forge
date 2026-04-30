# World-Forge Frontend

Frontend UI del proyecto **World-Forge**.

Este frontend:

- Consume la API HTTP del backend
- Renderiza la UI principal con React + Vite
- Usa Zustand para estado de cliente
- Usa Tailwind CSS y componentes UI internos
- Incluye automatización E2E con Playwright

---

## 🚀 Stack

- Node.js
- React 19
- TypeScript
- Vite
- React Router DOM
- Zustand
- Tailwind CSS 4
- Radix Slot
- Lucide React
- ESLint
- Playwright

---

## 🧱 Estructura actual

```text
apps/frontend
├─ e2e/
│  ├─ data/         # Datos auxiliares para pruebas E2E
│  ├─ fixtures/     # Fixtures reutilizables
│  ├─ pages/        # Page Objects / helpers de UI
│  ├─ tests/        # Specs de Playwright
│  └─ utils/        # Utilidades de automatización
├─ public/          # Assets públicos servidos por Vite
├─ src/
│  ├─ app/          # Router, layout, pages, services y wiring principal
│  ├─ components/   # Componentes UI reutilizables
│  ├─ features/     # Estado, tipos y lógica por feature
│  ├─ shared/       # Config compartida e infraestructura liviana
│  ├─ styles/       # Estilos globales, tema y fuentes
│  ├─ main.tsx      # Entrada principal
│  └─ index.css     # Hoja global inicial
├─ .env             # Fallback general de Vite
├─ .env.development # Front apuntando a backend dev
├─ .env.test        # Front apuntando a backend test
├─ playwright.config.ts
├─ vite.config.ts
└─ package.json
```

---

## 🌐 Entornos

Este frontend usa **modes de Vite** para seleccionar a qué backend conectarse.

- `development` → lee `.env.development`
- `test` → lee `.env.test`

Variables actuales:

```env
# .env.development
VITE_API_BASE_URL=http://localhost:3001
```

```env
# .env.test
VITE_API_BASE_URL=http://localhost:3002
```

Notas:

- `npm run dev` usa el modo por defecto de Vite y termina conectando al backend de desarrollo
- `npm run dev:test` usa el modo `test` y conecta al backend de pruebas
- El valor efectivo lo consume `src/shared/config/env.ts`

---

## ▶️ Inicialización desde cero

Si clonas el proyecto por primera vez, este frontend no usa workspaces automáticos ni scripts globales desde la raíz. La instalación se hace por paquete.

### 1. Instalar dependencias del frontend

```bash
cd apps/frontend
npm install
```

### 2. Instalar dependencias del backend

```bash
cd ../backend
npm install
```

### 3. Instalar navegadores de Playwright

Desde `apps/frontend`:

```bash
npx playwright install
```

### 4. Verificar entornos

Antes de correr UI o E2E, confirma que existan estos archivos:

- `.env.development`
- `.env.test`
- `apps/backend/.env`
- `apps/backend/.env.test`

El flujo típico de trabajo local es:

1. Levantar backend `dev` o `dev:test`
2. Levantar frontend `dev` o `dev:test`
3. Correr Playwright contra los servicios ya levantados

---

## ▶️ Cómo arrancar el frontend

### Modo desarrollo

```bash
cd apps/frontend
npm run dev
```

Servidor:

<http://localhost:5173>

Este modo usa `VITE_API_BASE_URL=http://localhost:3001`.

### Modo pruebas

```bash
cd apps/frontend
npm run dev:test
```

Servidor:

<http://localhost:5173>

Este modo usa `VITE_API_BASE_URL=http://localhost:3002`.

---

## 🧪 Automatización UI con Playwright

La automatización E2E ya está configurada en este frontend.

Configuración actual:

- `playwright.config.ts` usa `baseURL = http://localhost:5173`
- Playwright **no levanta** frontend ni backend automáticamente
- Los servicios deben estar corriendo antes de ejecutar los tests

Para ejecutar los tests contra el ambiente de pruebas, normalmente se usa este flujo:

### 1. Levantar backend de pruebas

```bash
cd apps/backend
npm run dev:test
```

Backend esperado:

<http://localhost:3002>

### 2. Levantar frontend en modo test

```bash
cd apps/frontend
npm run dev:test
```

Frontend esperado:

<http://localhost:5173>

### 3. Ejecutar Playwright

```bash
cd apps/frontend
npm run e2e
```

Si prefieres modo interactivo:

```bash
npm run e2e:ui
```

Notas importantes:

- Si `5173` no está levantado, Playwright fallará con `ERR_CONNECTION_REFUSED`
- Si el frontend fue levantado con `npm run dev` en lugar de `npm run dev:test`, la UI consumirá `http://localhost:3001`
- Si el backend no está levantado en `3002`, la UI cargará pero las requests del ambiente de test fallarán

---

## 📜 Scripts disponibles

Desde `apps/frontend/package.json`:

- `npm run dev`: levanta Vite en modo desarrollo
- `npm run dev:test`: levanta Vite en modo test
- `npm run build`: genera build de producción del frontend
- `npm run build:test`: genera build usando variables del modo test
- `npm run preview`: sirve localmente el build generado en modo normal
- `npm run preview:test`: sirve localmente el build generado con modo test
- `npm run lint`: ejecuta ESLint sobre el frontend
- `npm run e2e`: corre toda la suite de Playwright
- `npm run e2e:ui`: abre Playwright UI mode
- `npm run e2e:headed`: corre Playwright con navegador visible
- `npm run e2e:debug`: corre Playwright en modo debug
- `npm run e2e:smoke`: corre únicamente los smoke tests

---

## 🧭 Convenciones útiles

- La navegación principal vive en `src/app/router.tsx`
- La configuración de entorno vive en `src/shared/config/env.ts`
- El cliente HTTP base vive en `src/app/api/httpClient.ts`
- Los servicios de dominio UI consumen endpoints desde `src/app/services/`
- El estado de features se concentra en `src/features/`
- Los tests E2E viven en `e2e/tests/`

---

## ✅ Checklist rápido de arranque local

Para alguien que llega por primera vez al proyecto:

1. Instalar dependencias en `apps/backend`
2. Instalar dependencias en `apps/frontend`
3. Ejecutar `npx playwright install` en `apps/frontend`
4. Levantar backend con `npm run dev:test` si quieres usar la base de pruebas
5. Levantar frontend con `npm run dev:test` para apuntar al backend de pruebas
6. Abrir <http://localhost:5173>
7. Ejecutar `npm run e2e` o `npm run e2e:ui`

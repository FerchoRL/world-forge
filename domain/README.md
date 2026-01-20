# 🧠 Domain

El `domain` contiene el **modelo central del sistema**.
Aquí se define qué existe y cómo se relaciona, sin depender
de frameworks ni infraestructura.

---

## 🎯 Propósito

- Definir entidades narrativas (Character, Story, Arc, etc.)
- Definir relaciones entre conceptos
- Definir vocabularios compartidos (types)
- Definir contratos que la infraestructura debe cumplir

El domain representa **el lenguaje del sistema** y es la base sobre la cual
se construyen backend, frontend y persistencia.

---

## 🧱 Qué contiene

- `models/`  
  Entidades y estructuras principales del sistema.

- `types/`  
  Tipos compartidos, uniones, vocabularios y utilidades de tipado  
  usados por múltiples modelos.

- `contracts/`  
  Contratos (interfaces) que definen **cómo se accede o persiste el dominio**,  
  sin conocer implementaciones concretas  
  (repositorios, gateways, etc.).

---

## 🚫 Qué NO contiene

- Express
- Mongo / Mongoose
- React
- Fetch
- Validaciones de input
- Lógica de UI
- Lógica de base de datos
- Estado global
- Side effects

---

## 🔗 Cómo se usa

El domain es **importado directamente** por:

- `apps/backend`
- `apps/frontend`

No se compila de forma independiente.
Es compilado junto con la app que lo consume.

---

## 🧠 Regla de oro

Si algo requiere:

- HTTP
- base de datos
- estado global
- UI

👉 **NO pertenece al domain.**

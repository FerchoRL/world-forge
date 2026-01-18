# 🌍 World-Forge

World-Forge es un **laboratorio de modelado narrativo y de personajes**, enfocado en
diseñar universos, historias y personajes de forma estructurada y reutilizable.

El proyecto sigue un enfoque **domain-first**, donde el núcleo del sistema se modela
antes de cualquier implementación técnica.

---

## 🧠 Filosofía del proyecto

- El **Domain** es la fuente de verdad
- Las historias no pertenecen a los personajes
- Un personaje puede existir en múltiples universos
- La infraestructura **no contamina** el dominio

---

## 🧱 Estructura del proyecto

world-forge/  
├─ domain/ # Núcleo del sistema (TS puro)  
│ ├─ models/ # Entidades: Character, Story, Arc, etc.  
│ ├─ types/ # Tipos compartidos y enums  
│ └─ contracts/ # Contratos (repositorios, servicios)  
│  
├─ apps/  
│ ├─ backend/ # API (Express)  
│ └─ frontend/ # UI (React + Vite)  
│  
├─ package.json  
├─ tsconfig.json  
└─ README.md

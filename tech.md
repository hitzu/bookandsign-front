## Objetivo

Dejar el proyecto con una estructura simple, escalable y con un router “cerrado”:

- **Solo existen rutas** definidas por:
  - **Fuente de verdad privada**: `src/Layouts/MenuData.tsx`
  - **Públicas**: `/reserva/[token]`, `/sales`
  - **Auth**: **solo** `/login`
  - **Home privada**: `/` (por ahora: listado de contratos)
- Eliminar prefijos heredados del template:
  - Quitar `/pages/*` de la URL
  - Quitar `/application/*` de la URL
- Mantener compatibilidad temporal con links viejos mediante **redirects**.

---

## Convenciones (reglas del proyecto)

### 1) Next Page Router (regla clave)

En Next **Page Router**, la URL depende del path en `src/pages/**`.

- Si existe un archivo en `src/pages/...`, **esa URL existe**.
- Para que el router sea “cerrado”, `src/pages/` debe contener **solo** lo oficial.

### 2) Layouts y acceso

- **Privadas**: usan `Layout` (vía `getLayout`).
- **Públicas**: usan `NonLayout`.
- Nota: `Layout` ya está protegido por guard cliente (`withAuth`) porque `src/Layouts/index.tsx` exporta `withAuth(Layout)`.

### 3) “Template” como acelerador

El template NO define el router. Solo se reutiliza como:

- layouts
- componentes de forms / UI
  Pero su demo/rutas deben quedar **fuera** de `src/pages/`.

---

## Whitelist de rutas (esto es lo único que debe existir)

### Públicas

- `/login` (única ruta de auth)
- `/reserva/[token]`
- `/sales`

### Privadas

- `/` (alias de home; **redirect** al home actual)
- `/contracts`
  - `/contracts/new`
  - `/contracts/[sku]`
  - `/contracts/[sku]/receipt` (si aplica)
- `/products`
  - `/products/new`
  - `/products/[id]`
- `/packages`
  - `/packages/new`
  - `/packages/[id]`
- `/terms`
  - `/terms/new`
  - `/terms/[id]`
- `/promotions`
- `/providers`
  - `/providers/new`
  - `/providers/[id]`

> Todo lo demás (register, ui-kit, widgets, forms demo, login variants, forgot-password, etc.) NO debe existir como ruta.

---

## Estructura destino (código)

### `src/pages/` (solo entrypoints de ruta)

Mantenerlo mínimo. Ejemplo:

src/pages/

- index.tsx
- login.tsx
- reserva/[token].tsx
- sales.tsx
- contracts/index.tsx
- contracts/new.tsx
- contracts/[sku].tsx
- contracts/[sku]/receipt.tsx
- products/index.tsx
- products/new.tsx
- products/[id].tsx
- packages/index.tsx
- packages/new.tsx
- packages/[id].tsx
- terms/index.tsx
- terms/new.tsx
- terms/[id].tsx
- promotions/index.tsx
- providers/index.tsx
- providers/new.tsx
- providers/[id].tsx

### `src/features/` (implementación real por dominio)

Aquí vive lo que hoy está disperso en `src/views/**` y parte de `src/pages/**`:

src/features/

- contracts/
  - pages/
  - components/
  - services/
  - types.ts
- products/
- packages/
- terms/
- promotions/
- providers/
- booking/ (para `/reserva/[token]`)
- sales/ (para `/sales`)

### `src/shared/` (reusable cross-feature + “facade” del template)

src/shared/

- layouts/ (wrappers oficiales: AppLayout/NonLayout/…)
- forms/ (wrappers de inputs/forms del template)
- ui/ (componentes UI comunes)
- hooks/
- utils/

---

## Migración por fases (paso a paso)

### Fase 0 — Preparación (sin cambios funcionales)

- Crear rama: `chore/new-arch` (o similar).
- Acordar que **`src/app/` NO se usa** (no crear nada ahí).
- Decidir que `MenuData.tsx` es fuente de verdad para privadas.

Checklist:

- [ ] Identificar páginas reales del producto (las del menú + públicas + login + `/`)
- [ ] Confirmar que `/login` es la única auth pública

---

### Fase 1 — Quitar `/pages` de la URL (públicas)

Objetivo: que las canónicas sean:

- `/reserva/[token]` en vez de `/pages/reserva/[token]`
- `/sales` en vez de `/pages/sales`

Acciones:

- [ ] Mover/crear rutas canónicas en `src/pages/`:
  - `src/pages/reserva/[token].tsx`
  - `src/pages/sales.tsx`
- [ ] Mantener redirect desde rutas viejas a las nuevas en `next.config.js`:
  - `/pages/reserva/:token` -> `/reserva/:token`
  - `/pages/sales` -> `/sales`
  - Ajustar `/pages/c/:token` para que termine en `/reserva/:token`
- [ ] Actualizar links internos (ej. listado de contratos) para usar rutas nuevas:
  - de `/pages/reserva/${token}` a `/reserva/${token}`

Resultado esperado:

- [ ] Links viejos siguen funcionando (redirigen)
- [ ] Links nuevos ya apuntan a las canónicas

---

### Fase 2 — Definir `/` como alias del home privado (estable y flexible)

Objetivo: poder cambiar el home sin tocar links.

Decisión:

- `/contracts` es la ruta estable del módulo contratos (y el home actual mientras).
- `/` **redirige** al home actual (por ahora: `/contracts`).

Acciones:

- [ ] Crear `src/pages/contracts/index.tsx` (privado con `Layout`) = listado contratos
- [ ] Agregar redirect en `next.config.js`: `/` -> `/contracts`

Resultado esperado:

- [ ] Al entrar a `/` terminas en `/contracts`
- [ ] Si mañana cambias el home, solo cambias el redirect de `/` (por ejemplo a `/dashboard`)

---

### Fase 3 — Quitar `/application` (privadas)

Objetivo: rutas canónicas sin prefijo del template.

Acciones:

- [ ] Crear nuevas rutas canónicas (ej. `src/pages/contracts/index.tsx` etc.)
- [ ] Agregar redirects en `next.config.js`:
  - `/application/contract-list` -> `/contracts`
  - `/application/contract-edit/:sku` -> `/contracts/:sku`
  - `/application/product-list` -> `/products`
  - etc. (según `MenuData.tsx`)
- [ ] Actualizar `src/Layouts/MenuData.tsx` para apuntar a rutas canónicas (sin `/application`).
- [ ] Revisar deep links internos (botones/links) y llevarlos a canónico.

Resultado esperado:

- [ ] El menú navega SOLO por URLs nuevas
- [ ] URLs viejas siguen funcionando por redirect (temporal)

---

### Fase 4 — “Cerrar” el router (eliminar demos del template)

Objetivo: que no existan rutas extra “por accidente”.

Acciones:

- [ ] Remover de `src/pages/` TODO lo que no sea whitelist:
  - register, forgot-password\*, login-v1/v2, ui-kit, widget, forms demo, etc.
- [ ] Si algo se quiere conservar como referencia, moverlo a una carpeta fuera de `src/pages/` (ej. `src/_archive/` o `src/template/`) para que NO sea ruta.

Resultado esperado:

- [ ] Si una ruta no está en whitelist, devuelve 404.
- [ ] El router refleja el producto real, no el template.

---

### Fase 5 — Reubicar implementación a `features/` + `shared/` (sin tocar URLs)

Objetivo: que `src/pages/*` sea un wrapper fino y la implementación viva por feature.

Patrón:

- `src/pages/<ruta>.tsx` importa y renderiza `src/features/<feature>/pages/<Page>.tsx`
- La UI reusable va a `src/shared/*`

Acciones:

- [ ] Mover `src/views/Booking/*` -> `src/features/booking/components/*`
- [ ] Mover `src/views/Sales/*` -> `src/features/sales/components/*`
- [ ] Crear `src/features/*/pages/*` para cada dominio del menú
- [ ] Crear facades en `src/shared/layouts/*` y `src/shared/forms/*` para no importar template directo en todos lados.

Resultado esperado:

- [ ] Rutas estables, implementación modular
- [ ] “¿Dónde pongo este componente?” se responde solo: `features/<dominio>` o `shared/`

---

## Definición de “done”

- [ ] No existe `/pages/*` ni `/application/*` como canónicas
- [ ] Solo existe `/login` como auth pública
- [ ] `/` es home privada útil
- [ ] `src/pages/` contiene solo whitelist
- [ ] Implementación migrando a `features/` + `shared/`

---

## Notas (seguridad/guard)

- El guard actual es client-side (`withAuth` + `localStorage`). Suficiente para ahora.
- El “redirect por 401” queda como UX fallback, no como criterio de arquitectura.
- Más adelante: evaluar guard en SSR/middleware si hace falta (fuera de este scope).

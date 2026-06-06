# TDD — Extras por marca (Frontend)

> **Tipo:** Technical Design Document
> **Proyecto:** `bookandsign-front`
> **Estado:** Propuesto
> **Relacionado:** TDD backend "Extras por marca para contratos" (`bookandsign-api`)
> **Alcance:** implementar en el frontend el catálogo de extras **por marca** (`brand-scoped`), su selección en el flujo de creación de contratos de `expo-bebe`, y su exposición en la vista pública de reserva — reutilizando los patrones ya probados de `packages` y de las secciones actuales de reserva.

---

## 1. Objetivo

Dar soporte en el frontend a la feature de extras definida en el backend, de modo que:

1. exista una sección de menú para administrar el catálogo de extras (CRUD con `brandId` obligatorio),
2. el flujo de creación de contrato de `expo-bebe` permita seleccionar extras filtrados por marca, calcule su costo con descuento y lo refleje en el resumen financiero,
3. el extra seleccionado viaje en el payload de firma del contrato,
4. la vista pública de reserva (`/reserva/[token]`) muestre los extras contratados.

La meta NO es inventar UI nueva. La meta es **repetir el lenguaje arquitectónico existente**: el CRUD calca `packages` (entidad con `brandId` directo), la selección calca `packages`, y la lectura pública calca la sección de servicios.

---

## 2. Decisiones tomadas

Estas decisiones fueron confirmadas con el equipo y gobiernan el diseño:

| # | Decisión | Implicancia |
|---|----------|-------------|
| D1 | **Se construye contra el contrato del TDD backend** (endpoints aún no desplegados) | El front se implementa usando los shapes documentados; queda listo para conectar. La verificación end-to-end queda pendiente del backend. |
| D2 | **El descuento del extra hereda la promoción de la marca** | Se reusan las `promotions` que ya se cargan por `brandId` (`promotion.brandId === brandId`), igual que packages. |
| D3 | **Selección con cantidad** (botones +/−), igual que packages | El payload manda `quantity` real; el snapshot escala por cantidad. |
| D4 | **Los extras se muestran en un renglón "Extras" aparte** en el resumen financiero | Tanto en `expo-bebe` como en la vista del cliente. Mayor transparencia. |
| D5 | **Cada extra pertenece a una sola marca** | El CRUD usa `brandId` directo. Se elimina cualquier asociación bulk o selector multi-marca. |

### 2.1 Supuesto sobre `basePriceSnapshot`

El ejemplo del TDD backend (`quantity: 2`, `basePriceSnapshot: 2250`) coincide con la convención que ya usa el frontend para packages: el snapshot es el **precio final con descuento ya aplicado y escalado por cantidad**, no el precio base unitario. Se adopta esa misma convención por consistencia.

Referencia real (packages):

- [src/features/expo-bebe/components/ContractView/hooks/useContractForm.ts](../src/features/expo-bebe/components/ContractView/hooks/useContractForm.ts)

```ts
basePriceSnapshot:
  it.pkg.basePrice * it.quantity -
  (it.pkg.basePrice * it.quantity * (it.promotion?.value ?? 0)) / 100,
```

---

## 3. Estado actual verificado en código

### 3.1 Ya existe el patrón de CRUD brand-scoped
`packages` ya modela una entidad administrativa con `brandId` directo desde el formulario de alta. Ese es el espejo correcto para `extras` después del cambio de contrato backend.

Referencias reales:

- [src/pages/package-add.tsx](../src/pages/package-add.tsx)
- [src/api/services/packageService.ts](../src/api/services/packageService.ts)

### 3.2 Ya existe el patrón de catálogo por marca

`packages` se filtra por `brandId` y expone CRUD + statuses, idéntico a lo que necesita `extras`.

Referencias reales:

- [src/api/services/packageService.ts](../src/api/services/packageService.ts)
- [src/pages/package-list.tsx](../src/pages/package-list.tsx), [src/pages/package-add.tsx](../src/pages/package-add.tsx)

### 3.3 El cálculo financiero del contrato vive en un solo hook

`useContractForm` concentra `subtotal`, `discountTotal`, `items`, los handlers de cantidad y el armado del `payload` de firma. Es el único punto que hay que extender para que los extras impacten el precio.

Referencia real:

- [src/features/expo-bebe/components/ContractView/hooks/useContractForm.ts](../src/features/expo-bebe/components/ContractView/hooks/useContractForm.ts)

### 3.4 El front es la fuente de los totales que persiste el backend

Hoy `useContractForm` **envía** `subtotal`, `discountTotal` y `total` en el payload; el backend los persiste tal cual (warning 7.1 del TDD backend). Consecuencia directa: **si los extras no se suman a esos tres montos, se guardarían pero no impactarían el precio**. Por lo tanto los extras deben integrarse al cálculo, no solo al array.

Referencia real:

- `GenerateContractPayload` en [src/interfaces/contracts.ts](../src/interfaces/contracts.ts)

### 3.5 La vista pública ya separa servicios y finanzas

La pantalla de reserva renderiza packages en una sección de servicios y los totales en una sección de finanzas. Los extras se agregan replicando ese mismo layout.

Referencias reales:

- [src/features/booking/components/ReservationServicesSection.tsx](../src/features/booking/components/ReservationServicesSection.tsx)
- [src/features/booking/components/ReservationFinanceSection.tsx](../src/features/booking/components/ReservationFinanceSection.tsx)

---

## 4. Alcance

### Incluye

- Tipos e interfaces de extras y de su snapshot contractual.
- Servicio API `extrasService` contra el contrato del TDD backend.
- Sección de menú + páginas CRUD de extras (listar, crear, editar, elegir una sola marca).
- Selección de extras por marca en el flujo de creación de contrato de `expo-bebe`, con cantidad y descuento por promoción de marca.
- Integración de extras al resumen financiero (renglón aparte) y al payload de firma.
- Exposición de los extras contratados en la vista pública `/reserva/[token]`.

### No incluye

- Cualquier cambio de ownership de precios/totales hacia el backend (warning 7.1 backend).
- Edición de extras de un contrato ya creado.
- Reglas de disponibilidad de extras por venue, temporada o tipo de evento.
- Verificación end-to-end contra backend real (depende de D1).

---

## 5. Diseño propuesto

### 5.1 Tipos e interfaces

#### `src/interfaces/extras.ts` (nuevo)

Calco de `interfaces/packages.ts`.

```ts
export type ExtraStatus = "active" | "inactive";

export interface Extra {
  id: number;
  brandId: number;
  name: string;
  description: string | null;
  price: number;
  status: ExtraStatus;
  brand?: GetBrandsResponse;
}

export interface CreateExtraPayload {
  brandId: number;
  name: string;
  description?: string | null;
  price: number;
  status?: ExtraStatus;
}

export type UpdateExtraPayload = Partial<CreateExtraPayload>;
```

#### `src/interfaces/contracts.ts` (extender)

```ts
// snapshot contractual del extra (espeja ContractPackages)
export interface ContractExtra {
  id: number;
  contractId: number;
  extraId: number;
  promotionId: number | null;
  quantity: number;
  nameSnapshot: string;
  basePriceSnapshot: number;
  extra?: Extra;
  promotion?: Promotion | null;
}

// item de extra en el payload de creación
export interface GenerateContractExtra {
  extraId: number;
  quantity: number;
  promotionId?: number;
  basePriceSnapshot: number;
}

// sumar a las respuestas de detalle
export interface GetContractByIdResponse {
  // ...campos actuales...
  extras: ContractExtra[];
}

// sumar al payload de creación
export interface GenerateContractPayload {
  // ...campos actuales...
  extras: GenerateContractExtra[];
}
```

> Nota de nomenclatura: se usa **una sola** propiedad `extras` en el detalle, evitando repetir la ambigüedad `items`/`packages` que el propio TDD backend marca como deuda (warning 7.3).

### 5.2 Servicio API

#### `src/api/services/extrasService.ts` (nuevo)

Espejo de `packageService`.

```ts
getExtras({ brandId, term }): Promise<Extra[]>      // GET /extras?brandId=&term=
getExtraById(id): Promise<Extra>                     // GET /extras/:id
getExtrasStatuses(): Promise<string[]>               // GET /extras/statuses
createExtra(payload): Promise<Extra>                 // POST /extras
updateExtraById(id, payload): Promise<void>          // PATCH /extras/:id
deleteExtraById(id): Promise<void>                   // DELETE /extras/:id
```

Usa `axiosInstanceWithToken`. `getExtras` con `brandId` devuelve solo extras activos (regla del backend), por lo que el front no debe filtrar status adicionalmente en el flujo de selección.

### 5.3 Sección de menú + CRUD

Páginas nuevas, calco de `package-*`, con selector simple de marca:

| Ruta | Archivo | Base |
|------|---------|------|
| `/extras-list` | `src/pages/extras-list.tsx` | `package-list.tsx` |
| `/extras-add` | `src/pages/extras-add.tsx` | `package-add.tsx` |
| `/extras-edit/[id]` | `src/pages/extras-edit/[id].tsx` | `package-edit/[id].tsx` |

Entrada nueva en [src/Layouts/MenuData.tsx](../src/Layouts/MenuData.tsx) (bloque "Extras" con sub-items Listado / Agregar, siguiendo el formato de los bloques existentes).

El formulario de alta/edición debe pedir:

- marca (`brandId`) obligatoria,
- nombre,
- descripción opcional,
- precio,
- status.

> **Decisión abierta menor:** nomenclatura de rutas `extras-list` / `extras-add` / `extras-edit/[id]`, calcada de packages. Cambiar solo si el equipo define otra convención.

### 5.4 Selección en `expo-bebe`

#### Tipo de línea — `src/features/expo-bebe/types.ts`

```ts
export interface ExtraLineItem {
  extra: Extra;
  quantity: number;
  promotion: Promotion | null;
}
```

#### Hook — `useContractForm.ts`

1. **Carga:** al cambiar `selectedBrandId`, `getExtras({ brandId })` → `extrasCatalog`. (Reusa el mismo efecto/patrón que packages.)
2. **Estado:** `extraItems: ExtraLineItem[]` con handlers `addExtra`, `incExtra`, `decExtra`, `removeExtra` (espejo de los de packages).
3. **Promoción:** al agregar, se hereda `promotions.find(p => p.brandId === extra... )` — misma lógica que packages (D2).
4. **Totales:** extender los `useMemo` existentes para sumar extras:

```ts
const extrasSubtotal = sum(extra.price * quantity)
const extrasDiscount = sum(extra.price * quantity * promo% / 100)

subtotal      += extrasSubtotal
discountTotal += extrasDiscount
total          = subtotal - discountTotal   // ya derivado
```

5. **Payload:** agregar `extras` al `GenerateContractPayload`:

```ts
extras: extraItems.map((it) => ({
  extraId: it.extra.id,
  quantity: it.quantity,
  promotionId: it.promotion?.id,
  basePriceSnapshot:
    it.extra.price * it.quantity -
    (it.extra.price * it.quantity * (it.promotion?.value ?? 0)) / 100,
})),
```

6. **Reset:** limpiar `extraItems` en `resetForm`.
7. **Exportar** el catálogo, items y handlers en el VM (`ContractFormVM`).

#### UI — `src/features/expo-bebe/components/ContractView/ui/ExtrasSection.tsx` (nuevo)

Hermana de `ProductsSection`, ubicada **debajo** de productos/servicios. Mismo markup: select de extra por marca + botón agregar + lista con +/− y eliminar. Reusa `styles` de `expo-bebe.module.css`.

#### Resumen — `PaymentSection.tsx`

Agregar un renglón **"Extras"** (D4) mostrando el subtotal de extras, antes del divisor de precio final. El precio final ya queda correcto porque `subtotal`/`discountTotal` los incluyen.

### 5.5 Vista pública `/reserva/[token]`

1. **Tipo:** `GetContractByIdResponse.extras` ya incluido (5.1).
2. **Servicios:** nueva `ReservationExtrasSection.tsx` (o bloque dentro de la sección de servicios) que renderiza `data.extras` con nombre, cantidad, precio y descuento — calco de `ReservationServicesSection`.
3. **Finanzas:** en `ReservationFinanceSection.tsx`, renglón **"Extras"** aparte (D4). Los totales (`contract.subtotal`/`discountTotal`/`total`) ya reflejan extras porque el front los persistió así.

---

## 6. Plan de ejecución por fases

### Fase 1 — Tipos + servicio (base)
- `interfaces/extras.ts`, extender `interfaces/contracts.ts`.
- `api/services/extrasService.ts`.
- **Ganancia:** contrato de datos cerrado; el resto compila contra tipos reales.

### Fase 2 — CRUD + menú
- Páginas `extras-list/add/edit` + entrada en `MenuData`.
- Selector único de marca en alta/edición.
- **Ganancia:** se administra el catálogo de extras de punta a punta (sujeto a backend, D1).

### Fase 3 — Selección en `expo-bebe`
- `ExtraLineItem`, extensión de `useContractForm`, `ExtrasSection`, renglón en `PaymentSection`.
- **Ganancia:** el extra impacta precio y viaja en el payload de firma.

### Fase 4 — Vista pública
- `ReservationExtrasSection` + renglón en `ReservationFinanceSection`.
- **Ganancia:** lo vendido y lo mostrado al cliente quedan sincronizados.

---

## 7. Warnings

### 7.1 Dependencia del backend (D1)
Hasta que los endpoints existan, la feature no se puede verificar end-to-end. Las páginas CRUD y la selección quedarán construidas pero sin datos reales.

### 7.2 Ownership de totales
El front sigue siendo dueño de `subtotal`/`discountTotal`/`total` (warning 7.1 backend). Sumar extras aquí es correcto **dado el modelo actual**, pero hereda la misma fragilidad: si el backend pasara a recalcular, esta lógica debe removerse para no duplicar.

### 7.3 `brandId` del contrato
En `expo-bebe` la marca siempre está seleccionada (locked por expo), así que el caso `brandId` null del backend (warning 7.2) no aplica a este flujo. Si en el futuro se ofrecen extras en un flujo sin marca, hay que rechazar la selección.

### 7.4 Status de extras en históricos
`getExtras?brandId` devuelve solo activos; pero un extra que pasa a inactivo debe **seguir mostrándose** en contratos históricos vía el snapshot (`ContractExtra`), nunca re-consultando el catálogo. La vista pública debe leer del snapshot, no del catálogo.

---

## 8. Criterios de aceptación

- Existe sección de menú "Extras" con listar / crear / editar usando una única marca por extra.
- El alta y edición de extra obligan a definir `brandId` directo, sin asociación bulk.
- En `expo-bebe`, al elegir marca se listan solo los extras activos de esa marca.
- Seleccionar un extra con cantidad calcula su costo con el descuento de la promoción de marca y lo suma al resumen financiero en un renglón "Extras".
- Al firmar, el payload incluye `extras` con `extraId`, `quantity`, `promotionId` y `basePriceSnapshot` (post-descuento).
- `/reserva/[token]` muestra los extras contratados y un renglón "Extras" en finanzas.
- Un extra inactivo deja de ofrecerse en contratos nuevos pero sigue visible en contratos históricos vía snapshot.
- Si un contrato incluye extras, el `brandId` del contrato debe existir y ser consistente con los extras seleccionados.
- El proyecto compila (`tsc`) sin errores de tipos en los archivos tocados.

---

## 9. Recomendación final

La feature se apoya 100% en patrones ya existentes (`packages` y secciones de reserva), por lo que el riesgo arquitectónico es bajo. El único bloqueo real es la disponibilidad del backend (D1): el frontend puede construirse completo contra el contrato y conectarse cuando los endpoints existan.

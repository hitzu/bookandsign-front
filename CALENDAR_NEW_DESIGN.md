# Calendar New Design (Tabs + Fotos/Mapa/Calendario) — Decisiones

## Contexto

Web/tablet app para vendedores en piso (expo). Se busca una navegación simple y repetible para que el vendedor memorice el flujo, con rendimiento estable aun con mala señal. La sección **Fotos** funciona como apoyo visual para cerrar ventas.

## Objetivo UX (principios)

- **2 touches máximo** para llegar a cualquier sección dentro de Fotos:
  - Touch 1: `Fotos`
  - Touch 2: seleccionar una colección/tab (si no es la primera)
- **Cero sorpresas / “no se mueve”**: al entrar a Fotos el contenido debe estar **ordenado y listo**, evitando saltos de layout, recargas y reacomodos.
- **Repetible para entrenamiento**: siempre abrir la **primera colección por orden** (no “última vista”).
- **Tablet-first**: soportar iPads 2018 y 2023 en horizontal y vertical.

## Navegación global (tabs generales)

Se agregan/estandarizan 3 tabs principales:

- **Calendario | Fotos | Mapa**

Decisiones:

- El tab actual debe ser siempre evidente y con navegación inmediata (sin menús profundos).
- Al volver desde fullscreen (Fotos) se debe poder regresar de forma confiable al tab previo (normalmente `Fotos` → back mantiene contexto de navegación global).

## Fotos: estructura de contenido (tabs configurables N)

Dentro de `Fotos` existen **tabs/colecciones configurables N** (hoy pueden ser 2, pero deben poder pivotear a escenarios como `Glitter | Novias | Quinceañeras`).

Decisiones:

- Los tabs de Fotos **NO se hardcodean** en frontend; vienen de un **manifest**.
- **Orden** de tabs y de items dentro de cada tab se define en el manifest (guion de ventas).
- Al entrar a `Fotos`, se abre siempre la **primera colección por orden**.

## Dónde viven las imágenes y videos

Decisiones:

- **Supabase Storage** como origen de media (owner: desarrollador con acceso a Supabase).
- Contenido **congelado por expo**: una vez definidas las colecciones para la expo, no se mueven.
- Entrega mediante **CDN/caching** (idealmente aprovechando el CDN que haya delante) con políticas agresivas de cache.

Qué NO hacer:

- No almacenar la librería de Fotos/Videos en el repositorio (escala mal, builds pesados, despliegues por contenido, cache pobre).
- No servir media desde la app como proxy si se puede evitar (peor latencia y cache).

## Manifest por Expo (fuente de verdad)

Se propone un **manifest versionado por expo** (p.ej. `expo_id`) que define:

- Tabs/colecciones: `id`, `title`, `order`
- Items por colección (lista ordenada):
  - `type`: `image` | `video`
  - `src/variants`: URLs a variantes de imagen (webp/jpg) o URL de video
  - `poster` (obligatorio para video)
  - `width`, `height` o `aspectRatio` (obligatorio para evitar layout shift)
  - `caption` opcional

Decisiones:

- El frontend consume el manifest y renderiza; **no decide** qué mostrar ni en qué orden.
- Los cambios de contenido se manejan cambiando `expo_id` (cache inmutable por expo).

## Performance: “rápido con mala señal” (no offline real)

Objetivo: entrar a `Fotos` y que el contenido esté listo sin depender de refresh.

### Precarga (estrategia)

- Al abrir la app o estando en `Calendario`, iniciar en background:
  - descarga del **manifest**
  - precarga de **fotos** y **posters** (al menos la **primera colección**)
- Al entrar a `Fotos`:
  - garantía: **primera colección** lista (fotos + posters)
  - resto de colecciones: precarga en background si el presupuesto lo permite

### Videos (silenciosos)

Decisiones:

- Videos son **silenciosos**.
- **No autoplay** (aunque sea silencioso) para evitar distracción y riesgos de performance.
- Carga de video **bajo demanda** (al tocar play / al entrar al item), mostrando poster mientras tanto.

## Optimización de media (formatos, tamaños, límites)

### Fotos

Decisiones:

- Formatos: **WebP** principal + **JPG** fallback.
- Variantes: 3 anchos por foto (tablet): **800 / 1400 / 2000 px**.
- El manifest debe incluir dimensiones/aspect ratio para reservar espacio y evitar “saltos”.

Presupuesto recomendado (para iPad 2018):

- **Por colección/tab**: 12–18 fotos target (máx 25).

### Videos

Decisiones:

- Formato: **MP4 (H.264)** por compatibilidad.
- Duración recomendada: **6–20s**.
- Cantidad: **1–3 videos por colección** (al inicio).
- Poster obligatorio para cada video.

## Responsabilidades: frontend vs contenido

Frontend DEBE:

- Consumir manifest y renderizar tabs/colecciones e items.
- Precargar fotos + posters según estrategia.
- Mantener navegación global estable (`Calendario | Fotos | Mapa`) y retorno (back) consistente.

Frontend NO debe:

- Generar variantes/optimización en cliente.
- Hardcodear colecciones/orden.
- Administrar uploads, aprobaciones o reglas de publicación.
- Resolver invalidaciones complejas: se logra con URLs/versionado por `expo_id`.

## Riesgos / advertencias (deuda técnica)

- No definir presupuesto (peso/cantidad) puede romper la promesa “instantáneo”.
- No versionar por expo puede mezclar contenido viejo/nuevo en cache.
- No incluir dimensiones/aspect ratio provoca layout shift (“se mueve”).
- Tratar videos como fotos (precargar todo) puede degradar experiencia en mala señal / iPad 2018.

## Qué NO automatizar todavía

- Auto-tagging/IA, recortes inteligentes, recomendaciones dinámicas.
- Transformaciones on-the-fly en runtime si se puede evitar (mejor pre-generar variantes).

## Lista de tareas sugeridas (implementación)

1. Definir `expo_id` y convención de publicación (“freeze” por expo).
2. Crear el esquema del manifest (tabs N + items image/video + dimensiones).
3. Definir presupuesto final:
   - fotos por colección y total de colecciones esperado
   - videos por colección, duración objetivo, peso máximo
4. Preparar media:
   - fotos: generar 3 variantes + fallback jpg
   - videos: MP4 H.264 + poster
5. Subir media a Supabase Storage bajo convención por `expo_id`.
6. Implementar navegación global `Calendario | Fotos | Mapa` (si no existe aún o si hay que unificarla).
7. Implementar `Fotos`:
   - tabs configurables desde manifest
   - primera colección por orden como default
   - precarga de primera colección + posters
   - carrusel fullscreen mixto (foto/video) con play explícito

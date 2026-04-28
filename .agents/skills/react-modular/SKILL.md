---
name: react-modular
description: Modular React architecture for this Next.js 14 project. Use this skill whenever the user asks to create a new component or page, refactor an existing component, split a large file, extract logic into hooks or stores, modularize code, or when you notice a component exceeding 300 lines. Triggers on phrases like "refactoriza", "modulariza", "separa la lógica", "este componente está muy grande", "crea un componente", "new page", "extract hook", "move state to store", or any request involving component structure and separation of concerns.
---

# React Modular Architecture

This skill defines how to structure React components and pages in this codebase. It covers two workflows: **building new** components/pages with modular architecture from the start, and **refactoring existing** oversized components into the same target structure — without changing observable behavior.

## When to apply

- A component file exceeds 300 lines.
- A component mixes UI rendering with business logic, effects, or state management.
- A new feature page or complex component needs to be created.
- The user asks to extract hooks, move state to a store, or split a component.

## Project conventions

- **Next.js 14 Pages Router** — routes live in `src/pages/`, kept thin.
- **Zustand** for new state management — stores in `src/stores/` (global) or colocated `stores/` folders.
- **Feature-driven structure** — domain code in `src/features/<domain>/`.
- **CSS Modules** (`.module.css`) for component styles. Bootstrap 5.3 via SCSS.
- **Path aliases**: `@pages/*`, `@assets/*`, `@shared/*`, `@common/*`, `@views/*`, `@slices/*`, `@layout/*`, `@helpers/*`.

## Target structure

When a component or page grows beyond 300 lines, convert it into a colocated folder:

```text
ComponentName/
  index.tsx          ← composition shell, mostly JSX wiring
  hooks/
    useComponentName.ts          ← derived data, handlers, async actions (NO useEffect)
    useComponentNameEffects.ts   ← all useEffect calls, returns void
  stores/
    useComponentNameStore.ts     ← Zustand store: state + actions + reset()
  ui/
    SectionA.tsx     ← presentational, receives data/callbacks via props
    SectionB.tsx
  types.ts           ← shared types for this component tree
```

For Next.js route pages that outgrow their file:

```text
route-segment/
  index.tsx          ← thin entrypoint in src/pages/, imports from feature
```

The implementation moves to `src/features/<domain>/pages/` following the same component folder structure above.

## Building new components

When creating a new component or page:

1. If the implementation will clearly exceed 300 lines, start with the folder structure from the beginning. Otherwise, start with a single file and convert later if it grows.
2. Reusable base components (buttons, inputs, cards) go in `src/shared/` and must not contain business logic.
3. Feature-specific components go in `src/features/<domain>/components/`.
4. Page implementations go in `src/features/<domain>/pages/` and are imported by thin `src/pages/` entrypoints.
5. Keep route files in `src/pages/` as thin wrappers — layout selection, auth guards, and a single feature page import.

## Refactoring existing components

When refactoring, the goal is to separate responsibilities while keeping behavior, exports, styling, persistence keys, and side effects intact.

### Step-by-step workflow

1. **Audit first.** Before changing any structure, read the entire component and catalog: props, exports, local state variables, effects (with their dependency arrays and cleanup), derived values, async flows, persistence (localStorage, cookies), render branches, and any identity keys that reset state.

2. **Preserve the public import surface.** If the file becomes a folder, `index.tsx` becomes the stable entrypoint. Every existing import path must continue to work.

3. **Extract the logic hook** → `hooks/use<ComponentName>.ts`
   Move here: derived data, event handlers, async actions, selectors, view-model shaping.
   This hook must NOT contain any `useEffect` calls.

4. **Extract the effects hook** → `hooks/use<ComponentName>Effects.ts`
   Move here: every `useEffect` from the original component.
   Preserve effect order, dependency arrays, cleanup behavior, and timing.
   This hook returns `void` — it only coordinates side effects.

5. **Extract state to a Zustand store** → `stores/use<ComponentName>Store.ts`
   Move component state that was in `useState`/`useReducer` into a Zustand store.
   The store must expose: state, actions, and a `reset()` function.
   Wire the logic hook to read from and dispatch to the store instead of local state.

6. **Simplify the main component** → `index.tsx`
   It should mostly render JSX, wiring props, handlers, and view-model data from the hook and store.
   Call the logic hook first, then the effects hook.

7. **Split large UI sections** → `ui/*.tsx`
   If `index.tsx` is still over 300 lines after extraction, split by visual section (not arbitrary line chunks).
   Each `ui/` subcomponent is presentational: receives data and callbacks through props, contains no business logic.

8. **Verify behavior is unchanged** unless the user explicitly requested a behavior change.

## Rules

### Hook separation
- `use<ComponentName>.ts` — logic only, no `useEffect`.
- `use<ComponentName>Effects.ts` — effects only, returns `void`.
- `use<ComponentName>Store.ts` — Zustand store with state, actions, and `reset()`.

### Presentational components
- `ui/*` components receive everything through props.
- No business logic, no direct store access, no API calls in `ui/*`.

### Store safety
- If a component can mount multiple times simultaneously, do not use a singleton store. Use a store factory with a provider or another instance-safe pattern.
- If the original state was local (component-scoped), reset the store on unmount or when the component identity key changes, so the lifecycle matches the original behavior.
- Do not add store persistence unless the original component already persisted that state.

### Preserve on refactor
- Prop names, export names, CSS class names, DOM structure.
- Persistence keys (localStorage, etc.).
- Side-effect triggers, async sequencing, cleanup paths, error handling.
- Effect dependency arrays and execution order.

## Completion checklist

- [ ] Entry component (`index.tsx`) is mostly UI composition.
- [ ] Non-effect logic lives in `hooks/use<ComponentName>.ts`.
- [ ] Effects live in `hooks/use<ComponentName>Effects.ts`.
- [ ] State lives in `stores/use<ComponentName>Store.ts` (Zustand).
- [ ] Oversized visual sections split into `ui/*` presentational components.
- [ ] Public import surface is preserved.
- [ ] Runtime behavior is unchanged (unless explicitly requested otherwise).
- [ ] No file exceeds 300 lines.

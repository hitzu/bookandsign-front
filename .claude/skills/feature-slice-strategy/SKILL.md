---
name: feature-slice-strategy
description: "Trigger: nuevo feature, nueva página, new feature, new page, migrar template, sales/ventas page, server-driven render, empezar feature con tests. Incremental strangler-fig slicing strategy for bookandsign-front: keep Next, build new features tests-first."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Feature Slice Strategy

This skill defines HOW and WHERE the codebase is migrating. Read it before building any new feature, new page, or before reimplementing legacy/template functionality. It sets direction; `react-modular` defines the internal component structure of each slice.

## The direction (non-negotiable)

- **Next.js stays.** No framework migration (no React-only, no Angular). Anyone proposing to "leave Next" is out of scope.
- **Grow by vertical slices**, not by microfrontends. We are a single-dev codebase — microfrontends and runtime composition are overkill and forbidden.
- **The old template dies by attrition.** Never do a big-bang removal. Legacy code in `src/views/`, `src/Common/`, `src/template-examples/` stays untouched until a route is rewritten as a clean slice; then its old code dies naturally.
- **Every new feature ships with tests from day 0.** No new feature merges without tests (see Testing).

## Where new code goes

Each new feature is a self-contained vertical slice, same shape as `src/features/party/`:

```text
src/features/<domain>/
  pages/        ← feature page, imported by a thin src/pages/ entrypoint
  components/   ← feature UI (apply react-modular for internal structure)
  services/     ← API calls for this domain
  hooks/        ← feature hooks
  types/        ← domain contracts
  utils/        ← pure helpers
  __tests__/    ← or colocated *.test.ts(x)
```

`src/pages/` entrypoints stay thin: layout, auth guard, single feature import. Do not add logic to `src/views/`.

## Routing: how a new screen replaces an old one

- New screen lives at the **canonical route** (e.g. `/mis-fotos`), NOT a `/v2/...` prefix. The URL must never leak the migration.
- While old and new coexist, gate with a **frontend feature flag** — a typed constant or `NEXT_PUBLIC_*` env var. No backend flag system.
- Rollback = flip the flag and redeploy. A few minutes of rebuild downtime is acceptable.
- When the new screen wins, delete the flag AND the old code path.

## Server-driven features

For features where backend config drives the render (the `mis-fotos`/`party` direction): keep the config→render mapping in a **pure, testable function**. The component receives parsed config and renders; the parsing/mapping logic is unit-tested independently of React.

## Testing

Two runners, by layer:

| Layer | What | Tool |
|-------|------|------|
| Unit (pure logic, config→view mapping, utils) | functions, no React | `node:test` (existing, `npm run test:party`) OR Vitest |
| Component / server-driven render | render a component given props/config, assert output and loading/error/data states | **Vitest + @testing-library/react + @testing-library/jest-dom** |

- Do NOT rewrite existing `node:test` util tests — they stay.
- Capa 2 (render) is mandatory for any server-driven screen: given a backend config JSON, assert the screen renders correctly.
- No E2E yet.

## Execution checklist for a new feature

1. Create `src/features/<domain>/` with the slice structure above.
2. Build internals following `react-modular` (`.claude/skills/react-modular/SKILL.md`).
3. Keep config→render logic in pure functions; unit-test them.
4. Add Vitest component tests for the render and its loading/error/data states.
5. Wire a thin `src/pages/` entrypoint at the canonical route, gated by a frontend feature flag if it replaces a legacy screen.
6. Leave the legacy code in place until the new screen is fully live; then remove flag + old path.

## References

- `.claude/skills/react-modular/SKILL.md` — internal component/hook/store structure for each slice.
- `src/features/party/` — reference implementation of a mature slice.
- `tech.md` — full migration plan and target structure.

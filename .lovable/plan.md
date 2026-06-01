## Problem

Preview is blank because the dev server fails to resolve five npm packages that the VERVE components import but were never actually installed:

- `framer-motion`
- `three`
- `@react-three/fiber`
- `@react-three/drei`
- `canvas-confetti`

Vite logs: `Cannot find module 'framer-motion' imported from '/dev-server/src/components/verve/Nav.tsx'` and the same for the others.

## Fix

Install the missing runtime dependencies plus their TypeScript types in a single step:

```
bun add framer-motion three @react-three/fiber @react-three/drei canvas-confetti
bun add -d @types/three @types/canvas-confetti
```

No code changes needed — the existing components already import them correctly. Once installed, Vite restarts automatically and the preview renders.

## Verification

- Re-check dev-server logs for `ERR_MODULE_NOT_FOUND`.
- Confirm the home route renders in the preview.
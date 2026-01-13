# Future Layout Recommendation

## Current State

- Source files mixed in root (`/app/*.tsx`).
- Components flat or loosely grouped.
- Services and Utils in root folders.

## Target Architecture (Phase 2 Refactor)

### Directory Structure

```
src/
├── assets/          # Static assets
├── components/      # Shared UI components
│   ├── common/      # Buttons, Inputs, Tables
│   ├── layout/      # Shell, Sidebar, Navbar
│   └── domain/      # Feature-specific components (Sales, Inventory)
├── contexts/        # React Contexts (GlobalContext)
├── hooks/           # Custom Hooks (useInventory)
├── services/        # API and Business Logic (Pure TS)
├── types/           # Type Definitions
│   ├── index.ts     # Global exports
│   ├── user.ts
│   └── product.ts
├── utils/           # Helpers and Formatters
├── views/           # Page/Route components (AdminDashboard, Shop)
├── App.tsx
└── main.tsx
```

### Configuration Changes

- **Vite:** Update `root` to `src` or configure aliases.
- **TSConfig:** Set `baseUrl` to `./src` and paths `@/*` to `./src/*`.
- **ESLint:** Scope rules to `src/`.

### Migration Strategy

1.  **Move**: Move all source files to `src/`.
2.  **Alias**: Setup `@/` alias to avoid relative path hell (`../../../`).
3.  **Modularize**: Break down `types.ts` (currently monolithic) into domain files.
4.  **Strict**: Enable `strict: true` in `tsconfig.json` after folder restructure to isolate errors.

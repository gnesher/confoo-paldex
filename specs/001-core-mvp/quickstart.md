# Quickstart: Paldex Core MVP

**Feature Branch**: `001-core-mvp`  
**Created**: 2026-01-17

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm, pnpm, or yarn
- Git

## Project Setup

### 1. Initialize TanStack Start Project

```bash
# Create new TanStack Start project
npx create-tsrouter@latest paldex --template start

cd paldex
```

### 2. Install Dependencies

```bash
# Core TanStack libraries
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install @tanstack/react-virtual
npm install @tanstack/react-table
npm install @tanstack/react-form
npm install @tanstack/react-ranger
npm install @tanstack/store @tanstack/react-store

# Validation
npm install zod

# Dev dependencies
npm install -D tailwindcss postcss autoprefixer
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### 3. Configure Tailwind CSS

```bash
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Create `app/styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Configure Vitest

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
});
```

Create `tests/setup.ts`:

```typescript
import '@testing-library/jest-dom';
```

### 5. Create Directory Structure

```bash
# Create directories
mkdir -p app/schemas
mkdir -p app/stores
mkdir -p app/utils
mkdir -p app/components
mkdir -p app/routes/pals
mkdir -p public/images/pals
mkdir -p tests/unit/stores
mkdir -p tests/integration
```

## Development Workflow

### Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Run Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- tests/unit/stores/team.test.ts
```

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure After Setup

```
paldex/
├── app/
│   ├── routes/
│   │   ├── __root.tsx       # Root layout with DevTools
│   │   ├── index.tsx        # Dashboard (to be created)
│   │   └── pals/
│   │       └── $palId.tsx   # Detail view (to be created)
│   ├── components/          # UI components (to be created)
│   ├── schemas/             # Zod schemas (to be created)
│   ├── stores/              # TanStack Store (to be created)
│   ├── utils/               # Server Functions (to be created)
│   └── styles/
│       └── globals.css      # Tailwind imports
├── public/
│   └── images/
│       └── pals/            # Pal images
├── tests/
│   ├── unit/
│   │   └── stores/
│   └── integration/
├── tailwind.config.js
├── vitest.config.ts
├── package.json
└── tsconfig.json
```

## Verification Checklist

After setup, verify:

- [ ] `npm run dev` starts without errors
- [ ] `http://localhost:3000` loads the default TanStack Start page
- [ ] `npm test` runs without configuration errors
- [ ] Tailwind classes apply correctly (add a test class to verify)
- [ ] TypeScript compilation succeeds (`npx tsc --noEmit`)

## Common Issues

### Issue: TanStack Start version mismatch

TanStack Start is rapidly evolving. If you encounter breaking changes:

```bash
# Check installed versions
npm ls @tanstack/start @tanstack/react-router

# Update to latest
npm update @tanstack/start @tanstack/react-router
```

### Issue: Hydration mismatch with localStorage

The Team Store reads from localStorage on initialization. To avoid hydration mismatches:

```typescript
// In store initialization, check for window
function loadInitialState() {
  if (typeof window === 'undefined') return { pals: [] };
  // ... localStorage logic
}
```

### Issue: Virtual grid not rendering

Ensure the parent container has a fixed height:

```tsx
// ❌ Wrong - no height constraint
<div ref={parentRef}>

// ✅ Correct - explicit height
<div ref={parentRef} className="h-screen overflow-auto">
```

## Next Steps

1. Create Zod schemas in `app/schemas/`
2. Implement mock data in `app/utils/pals.data.ts`
3. Build Server Functions in `app/utils/pals.ts`
4. Setup Team Store in `app/stores/team.ts`
5. Configure root layout with DevTools
6. Build components and routes

See `tasks.md` for detailed implementation tasks.

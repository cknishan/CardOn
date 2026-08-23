# CardOn

A flash card app with spaced repetition (SM-2 algorithm) and markdown import support. Built with React, TypeScript, Vite, and Dexie.js (IndexedDB).

## Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start development server            |
| `npm run build`   | Type-check and build for production |
| `npm run preview` | Preview production build            |
| `npm run lint`    | Run ESLint                          |
| `npm run format`  | Format code with Prettier           |

## Testing

Tests use [Vitest](https://vitest.dev) and are located in the `tests/` directory.

| Command              | Description                                 |
| -------------------- | ------------------------------------------- |
| `npm test`           | Run all tests once                          |
| `npm run test:watch` | Run tests in watch mode (re-runs on change) |
| `npx vitest run`     | Same as `npm test`                          |
| `npx vitest`         | Same as `npm run test:watch`                |

### Test structure

```
tests/
└── utils/
    ├── markdownParser.test.ts   — 20 tests for Q:/A:/Hint:/Note: parsing
    └── sm2.test.ts              — 20 tests for SM-2 spaced repetition algorithm
```

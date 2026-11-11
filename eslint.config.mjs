// Config ESLint « plate » (next lint n'existe plus depuis Next 16).
// Lancer avec : npm run lint
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Site en français : les apostrophes du texte JSX sont voulues.
      'react/no-unescaped-entities': 'off',
    },
  },
  globalIgnores([
    // Ignorés par défaut par eslint-config-next
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

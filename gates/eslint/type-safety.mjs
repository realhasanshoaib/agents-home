// Type-aware rules Semgrep cannot enforce (it only sees syntax, not types).
// Requires typescript-eslint. Spread into the project's flat config:
//   import typeSafety from './gates/type-safety.mjs'
//   export default tseslint.config(...typeSafety, { ...project rules })
import tseslint from "typescript-eslint";

export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: { projectService: true },
    },
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/only-throw-error": "error",
      "no-empty": ["error", { allowEmptyCatch: false }],
    },
  },
];

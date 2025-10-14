import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

import next from "eslint-config-next";

export default [
  ...next.configs.recommended,
  {
    // Overrides for API routes
    files: ["app/api/**/*.ts"],
    rules: {
      // API routes are not React components, so hooks rules don't apply
      "react-hooks/rules-of-hooks": "off",
    },
  },
];

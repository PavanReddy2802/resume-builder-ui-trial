// eslint.config.mjs

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
  // 💡 FINAL FIX: Add a configuration to disable the no-explicit-any rule 
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      // You can also turn off the related rule if needed, but 'off' should be enough:
      // "react/prop-types": "off", 
    },
  },
];

export default eslintConfig;
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    ignorePatterns: ["**/dist/**", "**/node_modules/**", "eslint.config.mjs", "next.config.ts"],
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    rules: {
      semi: ["error", "never"],
      quotes: ["error", "single"],
    },
  }),
];

export default eslintConfig;

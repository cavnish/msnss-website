import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  // Keep the starter on the flat config export that actually runs under the pinned ESLint/Next toolchain.
  ...nextCoreWebVitals,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    rules: {
      // This app intentionally serves dynamic CMS / Supabase / uploaded images
      // (and admin thumbnails) of unknown dimensions via <img>. next/image is
      // not appropriate for arbitrary runtime URLs here, so this rule is off.
      "@next/next/no-img-element": "off",
    },
  },
]);

import globals from "globals"
import pluginJs from "@eslint/js"

export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    files: ["**/*.js"],
    ignores: ["node_modules/**"],
    rules: {
      "no-unused-vars": "warn"
    }
  },
  pluginJs.configs.recommended,
]

// @ts-check
/** @type {import("eslint").ESLint.ConfigData} **/
const esLintConfig = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  plugins: [
    "@typescript-eslint",
    "eslint-custom-rules",
    "react-hooks",
    "jsx-a11y",
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    project: "./tsconfig.json",
  },
  ignorePatterns: ["node_modules/", "generated/", "dist/", "sourcemap/"],
  rules: {
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-ignore": "allow-with-description",
        "ts-expect-error": "allow-with-description",
        "ts-nocheck": "allow-with-description",
        "ts-check": false,
      },
    ],
    "no-restricted-imports": [
      "warn",
      {
        paths: [
          {
            name: "@mui/material",
            importNames: ["Grid"],
            message: "Don't use Grid from @mui/material",
          },
          {
            name: "@mui/material/Grid",
            importNames: ["default"],
            message: "Don't use Grid from @mui/material",
          },
        ],
      },
    ],
    "eslint-custom-rules/no-emotion-styled-import": "error",
    "react-hooks/rules-of-hooks": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "warn",
    "@typescript-eslint/prefer-optional-chain": "warn",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-extra-semi": "off", // clashes with prettier
    "@typescript-eslint/no-unused-vars": "off", // TS will handle it
    "@typescript-eslint/no-extra-parens": "off",
    "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
    "@typescript-eslint/no-non-null-assertion": "off",
    /*[
      "warn", 
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_ "
      }
    ],*/
    complexity: "warn",
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking", // these are a bit too strict for now
    "plugin:jsx-a11y/recommended",
    "prettier",
    "plugin:@next/next/recommended",
    "plugin:@next/next/core-web-vitals",
  ],
  settings: {
    react: {
      version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    next: {
      rootDir: "frontend",
    },
  },
}

module.exports = esLintConfig

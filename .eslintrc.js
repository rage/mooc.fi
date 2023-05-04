// @ts-check
/** @type {import("eslint").ESLint.ConfigData} **/
const esLintConfig = {
  extends: [
    "./eslintrc.base.js",
    "plugin:styled-components-a11y/strict",
    "plugin:@typescript-eslint/recommended",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking", // these are a bit too strict for now
    "prettier",
    "plugin:@next/next/core-web-vitals",
  ],
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
        patterns: [
          {
            group: ["@mui/*/*/*"],
            message:
              "Don't use deep @mui imports - prevents module duplication",
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
    "import/no-anonymous-default-export": "error",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "backend/**/__test__/*",
          "backend/tests/**/*",
          "backend/jest.config.ts",
          "frontend/next.config.js",
          "frontend/codegen.ts",
        ],
        optionalDependencies: false,
        peerDependencies: ["eslint-custom-rules/*"],
        includeInternal: true,
        includeTypes: true,
      },
    ],
    complexity: "warn",
  },
}

module.exports = esLintConfig

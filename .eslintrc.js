module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  plugins: [
    "@typescript-eslint",
    "eslint-custom-rules",
    "react-hooks",
    // "jsx-a11y",
    "styled-components-a11y",
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
    "eslint-custom-rules/ban-ts-ignore-without-comment": "error",
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
        patterns: [{
          group: ["@mui/*/*/*"],
          message: "Don't use deep @mui imports - prevents module duplication"
        }]
      },
    ],
    "no-restricted-modules": [
      "warn",
      {
        paths: [
          {
            name: "@mui/material/Grid",
            message: "Don't use Grid from @mui/material",
          },
        ],
      },
    ],
    "react-hooks/rules-of-hooks": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "warn",
    "@typescript-eslint/prefer-optional-chain": "warn",
    // complexity: "warn",
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
  },
  extends: [
    // "plugin:jsx-a11y/recommended",
    "plugin:@next/next/recommended",
    "plugin:styled-components-a11y/recommended",
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

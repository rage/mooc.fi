// @ts-check
/** @type {import("eslint").ESLint.ConfigData} **/
const esLintConfig = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  plugins: [
    "@typescript-eslint",
    "eslint-custom-rules",
    "react-hooks",
    "styled-components-a11y",
    "eslint-plugin-import",
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    parser: "@typescript-eslint/parser",
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname,
    root: true,
  },
  ignorePatterns: ["node_modules/", "generated/", "dist/", "sourcemap/"],
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

// @ts-check
/** @type {import("eslint").ESLint.ConfigData} **/
const esLintConfig = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  plugins: [
    "@typescript-eslint",
    "eslint-custom-rules",
    "react-hooks",
    "jsx-a11y",
    "eslint-plugin-import",
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
    "no-warning-comments": [
      "error",
      {
        terms: ["debug", "removeme", "remove-me"],
        location: "start",
      },
    ],
  },
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

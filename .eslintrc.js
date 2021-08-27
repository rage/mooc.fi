module.exports = {
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
    "eslint-custom-rules/ban-ts-ignore-without-comment": "error",
    "no-restricted-imports": [
      "warn",
      {
        paths: [
          {
            name: "@material-ui/core",
            importNames: ["Grid"],
            message: "Don't use Grid from @material-ui",
          },
          {
            name: "@material-ui/core/Grid",
            importNames: ["default"],
            message: "Don't use Grid from @material-ui",
          },
        ],
      },
    ],
    "no-restricted-modules": [
      "warn",
      {
        paths: [
          {
            name: "@material-ui/core/Grid",
            message: "Don't use Grid from @material-ui",
          },
        ],
      },
    ],
    "react-hooks/rules-of-hooks": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "warn",
    "@typescript-eslint/prefer-optional-chain": "warn",
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
  },
  extends: ["plugin:jsx-a11y/recommended"],
  settings: {
    react: {
      version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
}

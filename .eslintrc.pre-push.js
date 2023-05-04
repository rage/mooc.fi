// @ts-check
/** @type {import("eslint").ESLint.ConfigData} **/
const esLintConfig = {
  extends: "./eslintrc.base.js",
  rules: {
    "no-warning-comments": [
      "error",
      {
        terms: ["debug", "removeme", "remove-me"],
        location: "start",
      },
    ],
  },
}

module.exports = esLintConfig

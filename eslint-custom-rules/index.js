// @ts-check
const eslint = require("eslint")

/** @type {eslint.ESLint.Plugin} */
const customRules = {
  rules: {
    "ban-ts-ignore-without-comment": {
      meta: {
        type: "problem",
        docs: {
          description:
            'Bans "// @ts-ignore" comments from being used if no comment is specified',
          category: "Best Practices",
          recommended: true,
        },
        schema: [],
        messages: {
          tsIgnoreWithoutCommentComment:
            'Do not use "// @ts-ignore" comments because they suppress compilation errors. If you want to use one, add a comment after it, like // @ts-ignore: this is needed.',
        },
      },
      create: function (context) {
        const tsIgnoreRegExp = /^\/*\s*@ts-ignore(?!:.*)/
        const sourceCode = context.getSourceCode()

        return {
          Program() {
            const comments = sourceCode.getAllComments()

            comments.forEach((comment) => {
              if (comment.type !== "Line") {
                return
              }
              if (tsIgnoreRegExp.test(comment.value)) {
                context.report({
                  node: /** @type{*} */ (comment),
                  messageId: "tsIgnoreWithoutCommentComment",
                })
              }
            })
          },
        }
      },
    },
    "no-restricted-imports-clone":
      new eslint.Linter().getRules().get("no-restricted-imports") ||
      ((..._) => void 0),
    "no-emotion-styled-import": {
      meta: {
        type: "problem",
        fixable: "code",
        docs: {
          description:
            "Errors if `styled` or `css` are imported directly from @emotion/styled",
          category: "Best Practices",
          recommended: true,
        },
        schema: [],
        messages: {
          noEmotionStyledImport:
            "Do not use `styled` or `css` from @emotion/styled; use the ones exported from @mui/material/styles instead.",
        },
      },
      create: function (context) {
        return {
          ImportDeclaration(node) {
            const importedFrom = /** @type {string | null | undefined} */ (
              node.source.value
            )
            if (!importedFrom || importedFrom.indexOf("@emotion/styled") < 0) {
              return
            }
            node.specifiers.forEach((spec) => {
              if (spec.type === "ImportDefaultSpecifier") {
                context.report({
                  node,
                  messageId: "noEmotionStyledImport",
                  fix: function (fixer) {
                    return fixer.replaceText(
                      node,
                      'import { styled } from "@mui/material/styles"',
                    )
                  },
                })
              }
            })
          },
        }
      },
    },
    "no-material-ui-grid-component": {
      meta: {
        type: "problem",
        docs: {
          description: "Warns if Grid component is imported from @mui/material",
          category: "Best Practices",
          recommended: true,
        },
        schema: [],
        messages: {
          noMaterialUiGridImport:
            "Do not use Grid component from @mui/material",
        },
      },
      create: function (context) {
        return {
          ImportDeclaration(node) {
            const importedFrom = /** @type {string | null | undefined} */ (
              node.source.value
            )
            if (!importedFrom || importedFrom.indexOf("@mui/material") < 0) {
              return
            }
            const importedFromGrid = !!importedFrom.match(/Grid$/)

            node.specifiers.forEach((spec) => {
              // if it's a default import, report if it's imported from Grid
              // if it's not, report if what we're importing is actually Grid, even if we alias it
              if (
                (spec.type === "ImportDefaultSpecifier" && importedFromGrid) ||
                (spec.type === "ImportSpecifier" &&
                  spec.imported.name === "Grid")
              ) {
                context.report({
                  node,
                  messageId: "noMaterialUiGridImport",
                })
              }
            })
          },
        }
      },
    },
  },
}

module.exports = customRules

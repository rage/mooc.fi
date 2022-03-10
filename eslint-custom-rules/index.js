module.exports = {
  rules: {
    "ban-ts-ignore-without-comment": {
      meta: {
        type: "problem",
        docs: {
          description:
            'Bans "// @ts-ignore" comments from being used if no comment is specified',
          category: "Best Practices",
          recommended: "error",
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
                  node: comment,
                  messageId: "tsIgnoreWithoutCommentComment",
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
          recommended: "error",
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
            const {
              source: { value: importedFrom },
              specifiers,
            } = node

            if (importedFrom.indexOf("@mui/material") < 0) {
              return
            }
            const importedFromGrid = !!importedFrom.match(/Grid$/)

            specifiers.forEach((spec) => {
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

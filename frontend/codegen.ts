import { CodegenConfig } from "@graphql-codegen/cli"

import { preset as treeShakePreset } from "./lib/graphql-tree-shaking-preset"

const config: CodegenConfig = {
  schema: "schema.graphql",
  documents: ["graphql/**/*.graphql"],
  config: {
    preResolveTypes: true,
    namingConvention: "keep",
    avoidOptionals: {
      field: true,
    },
    nonOptionalTypeName: true,
    documentMode: "documentNode",
    optimizeDocumentNode: true,
    //dedupeFragments: true,
    pureMagicComment: true,
  },
  /*hooks: {
    afterAllFileWrite: ["prettier --write"],
  },*/
  generates: {
    "./graphql/generated/types.ts": {
      config: {
        pluckConfig: {
          modules: [
            {
              name: "@apollo/client",
              identifier: "gql",
            },
          ],
        },
      },
      plugins: [
        {
          add: {
            placement: "prepend",
            content: [
              "/* eslint-disable */",
              "/**",
              " * This is an automatically generated file.",
              " * Run `npm run graphql-codegen` to regenerate.",
              " **/",
            ],
          },
        },
        "time",
        "typescript",
        "typescript-operations",
        "typescript-apollo-client-helpers",
      ],
    },
    "./graphql/generated/": {
      config: {
        pluckConfig: {
          modules: [
            {
              name: "@apollo/client",
              identifier: "gql",
            },
          ],
        },
        typesPrefix: "Types.",
      },
      preset: treeShakePreset,
      presetConfig: {
        typesPath: "./types",
        importTypesNamespace: "Types",
      },
    },
  },
}

export default config

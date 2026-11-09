import { CodegenConfig } from "@graphql-codegen/cli"

import { preset as treeShakePreset } from "./lib/graphql-tree-shaking-preset"

const generatedHeader = {
  add: {
    placement: "prepend" as const,
    content: [
      "/**",
      " * This is an automatically generated file.",
      " * Run `pnpm run graphql-codegen` to regenerate.",
      " **/",
    ],
  },
}

const config: CodegenConfig = {
  schema: "schema.graphql",
  // plugins must resolve from here: pnpm doesn't expose them to the cli package
  pluginLoader: (name) => import(name),
  documents: ["graphql/**/*.graphql"],
  config: {
    preResolveTypes: true,
    namingConvention: "keep",
    avoidOptionals: {
      field: true,
    },
    nonOptionalTypename: true,
    defaultScalarType: "any",
    documentMode: "documentNode",
    optimizeDocumentNode: true,
    //dedupeFragments: true,
    pureMagicComment: true,
  },
  /*hooks: {
    afterAllFileWrite: ["prettier --write"],
  },*/
  generates: {
    "./graphql/generated/schema-types.ts": {
      plugins: [
        generatedHeader,
        "time",
        "typescript",
        "typescript-apollo-client-helpers",
      ],
    },
    "./graphql/generated/types.ts": {
      // resolved from the cwd, not from the output file
      config: { importSchemaTypesFrom: "./graphql/generated/schema-types" },
      plugins: [
        generatedHeader,
        { add: { content: ["export * from './schema-types'"] } },
        "typescript-operations",
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

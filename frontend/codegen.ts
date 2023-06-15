import { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: "schema.graphql",
  documents: ["graphql/**/*.{ts,tsx,graphql}"],
  config: {
    preResolveTypes: true,
    namingConvention: "keep",
    avoidOptionals: {
      field: true,
    },
    nonOptionalTypeName: true,
    dedupeFragments: true,
  },
  /*hooks: {
    afterAllFileWrite: ["prettier --write"],
  },*/
  generates: {
    "./graphql/generated/index.ts": {
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
      /*preset: "client",
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
      },*/
      plugins: [
        {
          add: {
            placement: "prepend",
            content: [
              "/**",
              " * This is an automatically generated file.",
              " * Run `pnpm graphql-codegen` to regenerate.",
              " **/",
            ],
          },
        },
        "time",
        "typescript",
        "typescript-operations",
        "fragment-matcher",
        "typed-document-node",
      ],
    },
    "./graphql/generated/apollo-helpers.ts": {
      plugins: ["typescript-apollo-client-helpers"],
    },
  },
}

export default config

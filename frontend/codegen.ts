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
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
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
      plugins: [
        {
          add: {
            placement: "prepend",
            content: [
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
        "fragment-matcher",
        "typed-document-node",
      ],
    },
  },
}

export default config

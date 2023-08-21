/* eslint-disable import/no-extraneous-dependencies */
import { relative } from "path"

import {
  buildASTSchema,
  concatAST,
  DefinitionNode,
  FragmentDefinitionNode,
  GraphQLSchema,
  Kind,
} from "graphql"
import { zip } from "remeda"

import * as addPlugin from "@graphql-codegen/add"
import { PluginFunction, Types } from "@graphql-codegen/plugin-helpers"
import * as typedDocumentNodePlugin from "@graphql-codegen/typed-document-node"
import {
  ClientSideBaseVisitor,
  LoadedFragment,
} from "@graphql-codegen/visitor-plugin-common"

import { processSources } from "./process-sources"

export type TreeShakePresetConfig = {
  typesPath: string
  importTypesNamespace?: string
  definitionsPath?: string
}

export const preset: Types.OutputPreset<TreeShakePresetConfig> = {
  prepareDocuments: (outputFilePath, outputSpecificDocuments) => [
    ...outputSpecificDocuments,
    `!${outputFilePath}`,
  ],
  buildGeneratesSection: (options) => {
    const schemaObject: GraphQLSchema = options.schemaAst
      ? options.schemaAst
      : buildASTSchema(options.schema, options.config as any)
    const forwardedConfig = {
      scalars: options.config.scalars,
      defaultScalarType: options.config.defaultScalarType,
      strictScalars: options.config.strictScalars,
      namingConvention: options.config.namingConvention,
      useTypeImports: options.config.useTypeImports,
      skipTypename: options.config.skipTypename,
      arrayInputCoercion: options.config.arrayInputCoercion,
      enumsAsTypes: options.config.enumsAsTypes,
      dedupeFragments: options.config.dedupeFragments,
      nonOptionalTypename: options.config.nonOptionalTypename,
      avoidOptionals: options.config.avoidOptionals,
      documentMode: options.config.documentMode,
      typesPrefix: options.config.typesPrefix,
      optimizeDocumentNode: options.config.optimizeDocumentNode,
    }
    const importTypesNamespace =
      options.presetConfig.importTypesNamespace || "Types"

    const { typesPath, definitionsPath = "definitions/" } = options.presetConfig

    const allAst = concatAST(
      options.documents.map((v) => v.document).filter(isDefined),
    )

    const allFragments: LoadedFragment[] = (
      allAst.definitions.filter(
        (d) => d.kind === Kind.FRAGMENT_DEFINITION,
      ) as FragmentDefinitionNode[]
    ).map((fragmentDef) => ({
      node: fragmentDef,
      name: fragmentDef.name.value,
      onType: fragmentDef.typeCondition.name.value,
      isExternal: false,
    }))

    const visitor = new ClientSideBaseVisitor(
      options.schemaAst!,
      allFragments,
      options.config,
      options.config,
    )

    const sourcesWithOperations = processSources(options.documents, (node) => {
      if (node.kind === "FragmentDefinition") {
        return visitor.getFragmentVariableName(node)
      }
      return visitor.getOperationVariableName(node)
    })

    const tdnFinished = createDeferred()

    const pluginMap = {
      ...options.pluginMap,
      [`add`]: addPlugin,
      [`typed-document-node`]: {
        ...typedDocumentNodePlugin,
        plugin: async (...args: Parameters<PluginFunction>) => {
          try {
            return await typedDocumentNodePlugin.plugin(...args)
          } finally {
            tdnFinished.resolve()
          }
        },
      },
    }

    const relativeTypesPath = relative(
      `${options.baseOutputDir}${definitionsPath}`,
      `${options.baseOutputDir}${typesPath}`,
    )
    const plugins: Array<Types.ConfiguredPlugin> = [
      {
        [`add`]: {
          content: `/* eslint-disable */\nimport * as ${importTypesNamespace} from "${relativeTypesPath}"\n`,
        },
      },
      {
        [`typed-document-node`]: {},
      },
      ...options.plugins,
    ]

    const exportMap = new Map<string, string>()
    const outputDocumentConfigs = sourcesWithOperations.flatMap(
      ({ source, operations }): Array<Types.GenerateOptions> => {
        const definitions = filterDefinitions(
          source.document?.definitions ?? [],
        )

        return zip(definitions, operations)
          .map(([definition, operation]) => {
            if (!("name" in definition)) {
              return
            }
            if (!definition.name?.value) {
              return
            }
            const filename = `${options.baseOutputDir}${definitionsPath}${operation.initialName}.ts`

            const documents = [
              {
                ...source,
                document: { ...source.document!, definitions: [definition] },
              },
            ]
            exportMap.set(operation.initialName, filename)

            return {
              filename,
              plugins,
              pluginMap,
              schema: options.schema,
              schemaAst: schemaObject,
              config: {
                ...forwardedConfig,
                externalFragments: allFragments.map((f) => {
                  if (f.name !== definition.name?.value) {
                    return {
                      ...f,
                      isExternal: true,
                    }
                  }
                  return f
                }),
              },
              documents,
              documentTransforms: options.documentTransforms,
              /*               skipDocumentsValidation: {
                skipValidationAgainstSchema: true,
              }, */
            }
          })
          .filter(isDefined)
      },
    )

    const indexFileGenerateConfig: Types.GenerateOptions = {
      filename: `${options.baseOutputDir}index.ts`,
      pluginMap: {
        [`add`]: addPlugin,
      },
      plugins: [
        {
          [`add`]: {
            content: [
              Array.from(exportMap.entries())
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(
                  ([name]) =>
                    `export { ${name} } from "./${definitionsPath}${name}"`,
                )
                .join("\n"),
              "export * from './types'\n",
            ],
          },
        },
      ],
      schema: options.schema,
      config: {},
      documents: [],
      documentTransforms: options.documentTransforms,
    }
    return [...outputDocumentConfigs, indexFileGenerateConfig]
  },
}

const filterDefinitions = (definitions: readonly DefinitionNode[]) => {
  return definitions.filter((definition) => {
    if (
      definition?.kind !== `OperationDefinition` &&
      definition?.kind !== "FragmentDefinition"
    ) {
      return false
    }

    if (!("name" in definition)) {
      return false
    }

    if (definition.name?.kind !== `Name`) {
      if (definition?.kind === `OperationDefinition`) {
        return false
      }
    }

    return true
  })
}

const isDefined = <T>(value: T | null | undefined): value is T => Boolean(value)

type Deferred<T = void> = {
  resolve: (value: T) => void
  reject: (value: unknown) => void
  promise: Promise<T>
}

function createDeferred<T = void>(): Deferred<T> {
  const d = {} as Deferred<T>
  d.promise = new Promise<T>((resolve, reject) => {
    d.resolve = resolve
    d.reject = reject
  })
  return d
}

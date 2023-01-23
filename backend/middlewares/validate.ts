import { GraphQLResolveInfo } from "graphql/type"
import { plugin } from "nexus"
import {
  AllNexusNamedOutputTypeDefs,
  ArgsValue,
  GetGen,
  MaybePromise,
  printedGenTyping,
  printedGenTypingImport,
  SourceValue,
} from "nexus/dist/core"

export type ValidateArgsFieldConfig<
  TypeName extends string = any,
  FieldName extends string = any,
> = {
  type: GetGen<"allOutputTypes", string> | AllNexusNamedOutputTypeDefs
  validateArgs?: (
    root: SourceValue<TypeName>,
    args: ArgsValue<TypeName, FieldName>,
    ctx: GetGen<"context">,
    info: GraphQLResolveInfo,
  ) => void
}

const ValidateArgsResolverImport = printedGenTypingImport({
  module: "middlewares/validate",
  bindings: ["ValidateArgsResolver"],
})

const fieldDefTypes = printedGenTyping({
  optional: true,
  name: "validate",
  description: `Fork of validateArgs from connectionPlugin.`,
  type: "ValidateArgsResolver<TypeName, FieldName>",
  imports: [ValidateArgsResolverImport],
})

export type ValidateArgsResolver<
  TypeName extends string,
  FieldName extends string,
> = (
  root: SourceValue<TypeName>,
  args: ArgsValue<TypeName, FieldName>,
  context: GetGen<"context">,
  info: GraphQLResolveInfo,
) => MaybePromise<void>

export const validateArgsPlugin = () => {
  const ensureError =
    (
      _root: any,
      _args: any,
      _ctx: GetGen<"context">,
      _info: GraphQLResolveInfo,
    ) =>
    (error: Error) => {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Invalid arguments")
    }

  return plugin({
    name: "validateArgPlugin",
    fieldDefTypes,
    onCreateFieldResolver(config) {
      const validate = config.fieldConfig.extensions?.nexus?.config
        ?.validate as ValidateArgsResolver<any, any>

      if (!validate) {
        return
      }
      if (typeof validate !== "function") {
        console.error(new Error("validateArgs must be a function"))
        return
      }

      return function (root, args, ctx, info, next) {
        let toComplete
        try {
          toComplete = validate(root, args, ctx, info)
        } catch (e) {
          toComplete = Promise.reject(e)
        }

        return plugin.completeValue(
          toComplete,
          () => {
            return next(root, args, ctx, info)
          },
          (err) => {
            ensureError(root, args, ctx, info)(err)
          },
        )
      }
    },
  })
}

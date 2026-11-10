import { plugin } from "nexus"

/**
 * Fails the schema build when a `Mutation` field has no `authorize`, so a new
 * mutation cannot ship without an access check.
 */
export const requireMutationAuthorizePlugin = () =>
  plugin({
    name: "requireMutationAuthorize",
    onCreateFieldResolver(config) {
      if (
        config.parentTypeConfig.name === "Mutation" &&
        config.fieldConfig.extensions?.nexus?.config.authorize == null
      ) {
        throw new Error(
          `Mutation.${config.fieldConfig.name} has no authorize check`,
        )
      }
      return undefined
    },
  })

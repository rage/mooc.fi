import { CreateFieldResolverInfo } from "nexus/dist/plugin"

const ROOT_TYPE_NAMES = new Set(["Query", "Mutation", "Subscription"])

/** Whether a field is an operation's entry point rather than a nested field. */
export const isRootField = (config: CreateFieldResolverInfo) =>
  ROOT_TYPE_NAMES.has(config.parentTypeConfig.name)

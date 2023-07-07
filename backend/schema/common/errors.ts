import { GraphQLError } from "graphql/error"
import { NexusGenObjects } from "nexus-typegen"

import { Prisma } from "@prisma/client"

export class ConflictError extends GraphQLError {
  constructor(message: string, extensions?: Record<string, any>) {
    super(message, {
      extensions: {
        ...extensions,
        code: "CONFLICT",
      },
    })

    Object.defineProperty(this, "name", { value: "ConflictError" })
  }
}

type OrphanedEntityErrorExtensions = Record<string, any> & {
  parent: keyof NexusGenObjects | Prisma.ModelName
  entity: keyof NexusGenObjects | Prisma.ModelName
}

export class OrphanedEntityError extends GraphQLError {
  constructor(message: string, extensions?: OrphanedEntityErrorExtensions) {
    super(message, {
      extensions: {
        ...extensions,
        code: "ORPHANED_ENTITY",
      },
    })

    Object.defineProperty(this, "name", { value: "OrphanedEntityError" })
  }
}

export class ConfigurationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: "MISSING_SETTINGS",
      },
    })

    Object.defineProperty(this, "name", { value: "MissingSettingsError" })
  }
}

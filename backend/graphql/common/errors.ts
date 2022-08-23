import { ApolloError } from "apollo-server-express"
import { NexusGenObjects } from "nexus-typegen"

import { Prisma } from "@prisma/client"

export class ConflictError extends ApolloError {
  constructor(message: string, extensions?: Record<string, any>) {
    super(message, "CONFLICT", extensions)

    Object.defineProperty(this, "name", { value: "ConflictError" })
  }
}

type OrphanedEntityErrorExtensions = Record<string, any> & {
  parent: keyof NexusGenObjects | Prisma.ModelName
  entity: keyof NexusGenObjects | Prisma.ModelName
}

export class OrphanedEntityError extends ApolloError {
  constructor(message: string, extensions?: OrphanedEntityErrorExtensions) {
    super(message, "ORPHANED_ENTITY", extensions)

    Object.defineProperty(this, "name", { value: "OrphanedEntityError" })
  }
}

export class ConfigurationError extends ApolloError {
  constructor(message: string) {
    super(message, "MISSING_SETTINGS")

    Object.defineProperty(this, "name", { value: "MissingSettingsError" })
  }
}

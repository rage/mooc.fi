import { EmailTemplate, User } from "@prisma/client"

import { type ExtendedPrismaClient } from "../../../../../prisma"

export type TemplateParams = {
  emailTemplate: EmailTemplate
  user: User
  prisma: ExtendedPrismaClient
}

import { EmailTemplate, User } from "@prisma/client"

import { type ExtendedPrismaClient } from "../../../../../prisma"
import ITemplate from "./ITemplate"
import { TemplateParams } from "./TemplateParams"

export default abstract class Template implements ITemplate {
  emailTemplate: EmailTemplate
  user: User
  prisma: ExtendedPrismaClient

  constructor(params: TemplateParams) {
    this.emailTemplate = params.emailTemplate
    this.user = params.user
    this.prisma = params.prisma
  }
  abstract resolve(): Promise<string>
}

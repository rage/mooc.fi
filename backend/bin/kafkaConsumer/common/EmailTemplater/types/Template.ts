import ITemplate from "./ITemplate"
import { TemplateParams } from "./TemplateParams"
import { PrismaClient, EmailTemplate, User } from "@prisma/client"

export default abstract class Template implements ITemplate {
  emailTemplate: EmailTemplate
  user: User
  prisma: PrismaClient

  constructor(params: TemplateParams) {
    this.emailTemplate = params.emailTemplate
    this.user = params.user
    this.prisma = params.prisma
  }
  abstract resolve(): Promise<string>
}

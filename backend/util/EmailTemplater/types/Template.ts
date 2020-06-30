import { TemplateParams } from "./TemplateParams"
import { PrismaClient, email_template, user } from "@prisma/client"
import ITemplate from "./ITemplate"

export default abstract class Template implements ITemplate {
  emailTemplate: email_template
  user: user
  prisma: PrismaClient

  constructor(params: TemplateParams) {
    this.emailTemplate = params.emailTemplate
    this.user = params.user
    this.prisma = params.prisma
  }
  abstract resolve(): Promise<string>
}

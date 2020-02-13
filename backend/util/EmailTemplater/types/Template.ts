import { TemplateParams } from "./TemplateParams"
import { EmailTemplate, User } from "/generated/prisma-client"
import ITemplate from "./ITemplate"

export default abstract class Template implements ITemplate {
  emailTemplate: EmailTemplate
  user: User

  constructor(params: TemplateParams) {
    this.emailTemplate = params.emailTemplate
    this.user = params.user
  }
  abstract resolve(): Promise<string>
}

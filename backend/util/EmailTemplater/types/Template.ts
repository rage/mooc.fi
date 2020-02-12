import { TemplateParams } from "./TemplateParams"
import { EmailTemplate, User } from "/generated/prisma-client"

export default abstract class Template {
  emailTemplate: EmailTemplate
  user: User

  constructor(params: TemplateParams) {
    this.emailTemplate = params.emailTemplate
    this.user = params.user
  }
  abstract resolve(): string
}

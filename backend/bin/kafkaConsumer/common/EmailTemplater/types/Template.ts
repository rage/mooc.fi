import { EmailTemplate, User } from "@prisma/client"

import ITemplate from "./ITemplate"
import { TemplateContext } from "./TemplateContext"
import { TemplateParams } from "./TemplateParams"

export default abstract class Template implements ITemplate {
  emailTemplate: EmailTemplate
  user: User
  context: TemplateContext

  constructor(params: TemplateParams) {
    this.emailTemplate = params.emailTemplate
    this.user = params.user
    this.context = params.context
  }
  abstract resolve(): Promise<string>
}

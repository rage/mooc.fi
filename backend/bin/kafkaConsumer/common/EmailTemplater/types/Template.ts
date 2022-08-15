import { EmailTemplate, Organization, User } from "@prisma/client"

import ITemplate from "./ITemplate"
import { TemplateContext } from "./TemplateContext"
import { TemplateParams } from "./TemplateParams"

export default abstract class Template implements ITemplate {
  emailTemplate: EmailTemplate
  user: User
  email?: string
  organization?: Organization
  context: TemplateContext

  constructor(params: TemplateParams) {
    this.emailTemplate = params.emailTemplate
    this.user = params.user
    this.organization = params.organization
    this.context = params.context
    this.email = params.email
  }

  abstract resolve(): Promise<string>
}

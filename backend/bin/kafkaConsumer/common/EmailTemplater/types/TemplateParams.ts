import { EmailTemplate, Organization, User } from "@prisma/client"

import { TemplateContext } from "./TemplateContext"

export type TemplateParams = {
  emailTemplate: EmailTemplate
  user: User
  organization?: Organization
  context: TemplateContext
}

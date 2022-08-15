import { EmailTemplate, Organization, User } from "@prisma/client"

import { TemplateContext } from "./TemplateContext"

export type TemplateParams = {
  emailTemplate: EmailTemplate
  user: User
  email?: string
  organization?: Organization
  context: TemplateContext
}

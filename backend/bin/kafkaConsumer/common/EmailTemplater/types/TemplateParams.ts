import { EmailTemplate, User } from "@prisma/client"

import { TemplateContext } from "./TemplateContext"

export type TemplateParams = {
  emailTemplate: EmailTemplate
  user: User
  context: TemplateContext
}

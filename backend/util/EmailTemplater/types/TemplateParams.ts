import { EmailTemplate, User } from "/generated/prisma-client"

export type TemplateParams = {
  emailTemplate: EmailTemplate
  user: User
}

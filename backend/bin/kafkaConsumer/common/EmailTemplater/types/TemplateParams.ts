import { EmailTemplate, PrismaClient, User } from "@prisma/client"

export type TemplateParams = {
  emailTemplate: EmailTemplate
  user: User
  prisma: PrismaClient
}

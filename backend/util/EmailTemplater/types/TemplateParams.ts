import { PrismaClient, email_template, user } from "@prisma/client"

export type TemplateParams = {
  emailTemplate: email_template
  user: user
  prisma: PrismaClient
}

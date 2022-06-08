import { EmailTemplate, Organization, User } from "@prisma/client"

import { sendMail } from "../../../../util/sendMail"
import { EmailTemplater } from "../EmailTemplater/EmailTemplater"
import { TemplateContext } from "./types/TemplateContext"

interface SendEmailTemplateToUserOptions {
  user: User
  organization?: Organization
  template: EmailTemplate
  email?: string
  context: TemplateContext
}

export async function sendEmailTemplateToUser({
  user,
  organization,
  template,
  email,
  context = {} as TemplateContext,
}: SendEmailTemplateToUserOptions) {
  const text = await applyTemplate({ template, user, organization }, context)

  await sendMail(
    {
      to: email ?? user.email,
      subject: template.title ?? undefined,
      text,
      html: template.html_body ?? undefined,
    },
    { logger: context.logger },
  )
}

interface ApplyTemplateParams {
  user: User
  organization?: Organization
  template: EmailTemplate
}

const applyTemplate = async (
  { template, user, organization }: ApplyTemplateParams,
  context: TemplateContext,
) => {
  const templater = new EmailTemplater({
    emailTemplate: template,
    user,
    organization,
    context,
  })

  return await templater.resolve()
}

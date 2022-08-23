import { EmailTemplate, Organization, User } from "@prisma/client"

import { sendMail } from "../../../../util"
import { EmailTemplater } from "../EmailTemplater/EmailTemplater"
import { TemplateContext } from "./types/TemplateContext"

interface SendEmailTemplateToUserArgs {
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
}: SendEmailTemplateToUserArgs) {
  const text = await applyTemplate(
    { template, user, email, organization },
    context,
  )

  await sendMail({
    to: email ?? user.email,
    subject: template.title ?? undefined,
    text,
    html: template.html_body ?? undefined,
  })
}

interface ApplyTemplateArgs {
  user: User
  email?: string
  organization?: Organization
  template: EmailTemplate
}

const applyTemplate = async (
  { template, user, email, organization }: ApplyTemplateArgs,
  context: TemplateContext,
) => {
  const templater = new EmailTemplater({
    emailTemplate: template,
    user,
    email,
    organization,
    context,
  })

  return await templater.resolve()
}

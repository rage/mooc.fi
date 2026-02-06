import { EmailTemplate, Organization, User } from "@prisma/client"

import { emptyOrNullToUndefined, sendMail } from "../../../../util"
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
  const title = template.title
    ? await applyTemplate(
        { template, user, email, organization, field: "title" },
        context,
      )
    : undefined
  const html_body = template.html_body
    ? await applyTemplate(
        { template, user, email, organization, field: "html_body" },
        context,
      )
    : undefined

  if (context.test) {
    const logger = context.logger ?? console
    logger.info(
      `To: ${
        email ?? user.email
      }\nSubject: ${title}\nText: ${text}\nHtml: ${html_body}`,
    )

    return
  }
  await sendMail(
    {
      to: email ?? user.email,
      subject: emptyOrNullToUndefined(title),
      text,
      html: emptyOrNullToUndefined(html_body),
    },
    { logger: context.logger },
  )
}

interface ApplyTemplateArgs {
  user: User
  email?: string
  organization?: Organization
  template: EmailTemplate
  field?: keyof Pick<EmailTemplate, "txt_body" | "title" | "html_body">
}

const applyTemplate = async (
  { template, user, email, organization, field }: ApplyTemplateArgs,
  context: TemplateContext,
) => {
  const templater = new EmailTemplater({
    emailTemplate: template,
    user,
    email,
    organization,
    context,
    field,
  })

  return templater.resolve()
}

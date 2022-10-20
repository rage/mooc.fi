import { EmailTemplate, User } from "@prisma/client"

import prisma from "../../../../prisma"
import { sendMail } from "../../../../util/sendMail"
import { EmailTemplater } from "../EmailTemplater/EmailTemplater"

export async function sendEmailTemplateToUser(
  user: User,
  template: EmailTemplate,
) {
  const text = await applyTemplate(template, user)

  await sendMail({
    to: user.email,
    subject: template.title ?? undefined,
    text,
    html: template.html_body ?? undefined,
  })
}

const applyTemplate = async (email_template: EmailTemplate, user: User) => {
  const templater = new EmailTemplater(email_template, user, prisma)

  return templater.resolve()
}

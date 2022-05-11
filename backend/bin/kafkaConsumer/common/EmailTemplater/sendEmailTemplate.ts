import * as nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"

import { EmailTemplate, User } from "@prisma/client"

import {
  SMTP_FROM,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_USER,
} from "../../../../config"
import { EmailTemplater } from "./EmailTemplater"
import { TemplateContext } from "./types/TemplateContext"

interface SendEmailTemplateToUserOptions {
  user: User
  template: EmailTemplate
  email?: string
  context: TemplateContext
}

export async function sendEmailTemplateToUser({
  user,
  template,
  email,
  context = {} as TemplateContext,
}: SendEmailTemplateToUserOptions) {
  const options: SMTPTransport.Options = {
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || ""),
    secure: false, // true for 465, false for other ports
    auth: {
      user: SMTP_USER, // generated ethereal user
      pass: SMTP_PASS, // generated ethereal password
    },
  }
  const transporter = nodemailer.createTransport(options)
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: SMTP_FROM, // sender address
    to: email ?? user.email, // list of receivers
    subject: template.title ?? undefined, // Subject line
    text: await applyTemplate(template, user, context), // plain text body
    html: template.html_body ?? undefined, // html body
  })

  const logMessage = `Message sent: ${info.messageId}`

  if (context.logger) {
    context.logger.info(logMessage)
  } else {
    console.log(logMessage)
  }
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

const applyTemplate = async (
  email_template: EmailTemplate,
  user: User,
  context: TemplateContext,
) => {
  const templater = new EmailTemplater({
    emailTemplate: email_template,
    user,
    context,
  })
  return await templater.resolve()
}

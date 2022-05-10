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
import prisma from "../../../../prisma"
import { EmailTemplater } from "../EmailTemplater/EmailTemplater"

export async function sendEmailTemplateToUser(
  user: User,
  template: EmailTemplate,
) {
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
    to: user.email, // list of receivers
    subject: template.title ?? undefined, // Subject line
    text: await applyTemplate(template, user), // plain text body
    html: template.html_body ?? undefined, // html body
  })
  console.log("Message sent: %s", info.messageId)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

const applyTemplate = async (email_template: EmailTemplate, user: User) => {
  const templater = new EmailTemplater({
    emailTemplate: email_template,
    user,
    prisma,
  })
  return await templater.resolve()
}

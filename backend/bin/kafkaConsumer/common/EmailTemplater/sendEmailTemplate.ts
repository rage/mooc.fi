require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import { User, EmailTemplate } from "@prisma/client"
import * as nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import { EmailTemplater } from "../EmailTemplater/EmailTemplater"
import prisma from "../../../../prisma"

const email_host = process.env.SMTP_HOST
const email_user = process.env.SMTP_USER
const email_pass = process.env.SMTP_PASS
const email_port = process.env.SMTP_PORT
const email_from = process.env.SMTP_FROM

export async function sendEmailTemplateToUser(
  user: User,
  template: EmailTemplate,
) {
  const options: SMTPTransport.Options = {
    host: email_host,
    port: parseInt(email_port || ""),
    secure: false, // true for 465, false for other ports
    auth: {
      user: email_user, // generated ethereal user
      pass: email_pass, // generated ethereal password
    },
  }
  let transporter = nodemailer.createTransport(options)
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: email_from, // sender address
    to: user.email, // list of receivers
    subject: template.title ?? undefined, // Subject line
    text: await ApplyTemplate(template, user), // plain text body
    html: template.html_body ?? undefined, // html body
  })
  console.log("Message sent: %s", info.messageId)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

const ApplyTemplate = async (email_template: EmailTemplate, user: User) => {
  const templater = new EmailTemplater(email_template, user, prisma)
  return await templater.resolve()
}

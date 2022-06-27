import { PrismaClient } from "@prisma/client"
import { Knex } from "knex"
import { createTransport } from "nodemailer"
import Mail from "nodemailer/lib/mailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import * as winston from "winston"

import {
  SMTP_FROM,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_USER,
} from "../config"

interface SendMailOptions {
  to: Mail.Options["to"]
  text: Mail.Options["text"]
  subject?: Mail.Options["subject"]
  html?: Mail.Options["html"]
}

interface SendMailContext {
  prisma?: PrismaClient
  logger?: winston.Logger
  knex?: Knex
}

export async function sendMail(
  { to, text, subject, html }: SendMailOptions,
  context?: SendMailContext,
) {
  const { logger } = context || {}

  const options: SMTPTransport.Options = {
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || ""),
    secure: false, // true for 465, false for other ports
    auth: {
      user: SMTP_USER, // generated ethereal user
      pass: SMTP_PASS, // generated ethereal password
    },
  }

  const transporter = createTransport(options)

  const info = await transporter.sendMail({
    from: SMTP_FROM, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  })
  ;(logger?.info || console.log)(`Message sent: ${info.messageId}`)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

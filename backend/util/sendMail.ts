import { Knex } from "knex"
import { createTransport } from "nodemailer"
import Mail from "nodemailer/lib/mailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import * as winston from "winston"

import { PrismaClient } from "@prisma/client"

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
  const logger = context?.logger ?? console
  const logInfo = logger.info.bind(logger)

  const options: SMTPTransport.Options = {
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT ?? ""),
    secure: false, // true for 465, false for other ports
    auth: {
      user: SMTP_USER, // generated ethereal user
      pass: SMTP_PASS, // generated ethereal password
    },
    pool: false, // Disable pooling for better retry isolation
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
  }

  await withRetries({
    maxRetries: 3,
    logger,
    logInfo,
    operationName: "SMTP send",
    isTransientError: isTransientSmtpError,
    operation: async (attempt) => {
      const transporter = createTransport(options)
      try {
        const info = await transporter.sendMail({
          from: SMTP_FROM, // sender address
          to, // list of receivers
          subject, // Subject line
          text, // plain text body
          html, // html body
        })
        logInfo(
          `Message sent: ${info.messageId}${
            attempt > 1 ? ` (succeeded on attempt ${attempt})` : ""
          }`,
        )
      } finally {
        transporter.close()
      }
    },
  })
}

interface RetryOptions {
  maxRetries: number
  logger?: winston.Logger
  logInfo?: (message: string) => void
  operationName: string
  operation: (attempt: number) => Promise<void>
  isTransientError: (error: unknown) => boolean
}

async function withRetries({
  maxRetries,
  logger,
  logInfo,
  operationName,
  operation,
  isTransientError,
}: RetryOptions) {
  const BASE_DELAY_MS = 1000
  const jitter = () => Math.floor(Math.random() * 250)
  const log =
    logInfo ?? ((message: string) => console.log(message))

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await operation(attempt)
      return
    } catch (error: any) {
      if (attempt >= maxRetries || !isTransientError(error)) {
        throw error
      }
      log(
        `${operationName} failed (attempt ${attempt}/${maxRetries}, retrying): ${
          error?.message ?? error
        }`,
      )
      const delay =
        Math.min(BASE_DELAY_MS * 2 ** (attempt - 1), 8000) + jitter()
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

function isTransientSmtpError(error: unknown) {
  interface SmtpError {
    responseCode?: number
    response?: string
    message?: string
    code?: string
  }
  const smtpError = error as SmtpError
  const responseCode = Number(smtpError?.responseCode)
  if (responseCode >= 400 && responseCode < 500) {
    return true
  }
  const response = String(smtpError?.response ?? "")
  if (/^4\d\d/.test(response)) {
    return true
  }
  const message = String(smtpError?.message ?? "")
  if (/\b4\d\d/.test(message)) {
    return true
  }
  const code = String(smtpError?.code ?? "")
  return [
    "ECONNRESET",
    "ETIMEDOUT",
    "ESOCKET",
    "EPIPE",
    "ECONNREFUSED",
  ].includes(code)
}

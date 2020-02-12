import micromustache from "micromustache"
import { EmailTemplate } from "/generated/prisma-client"

export class EmailTemplater {
  keyWords = {
    completion_link: this.completionLink(),
  }

  emailTemplate: EmailTemplate
  constructor(emailTemplate: EmailTemplate) {
    this.emailTemplate = emailTemplate
  }

  private completionLink(): string {
    return ""
  }
}

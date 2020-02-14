import Template from "../types/Template"
import { prisma } from "../../../generated/prisma-client"

export class CompletionLink extends Template {
  async resolve() {
    const completion_link_slug = (await prisma.courses({
      where: { completion_email: this.emailTemplate },
    }))[0].slug
    return `https://www.mooc.fi/register-completion/${completion_link_slug}`
  }
}

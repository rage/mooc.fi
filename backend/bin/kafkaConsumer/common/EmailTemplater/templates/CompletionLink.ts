import Template from "../types/Template"

export class CompletionLink extends Template {
  async resolve() {
    const completion_link_slug = (
      await this.prisma.course.findFirst({
        where: { completion_email: { id: this.emailTemplate.id } },
      })
    )?.slug

    const FRONTEND_URL = process.env.FRONTEND_URL ?? "https://www.mooc.fi"

    return `${FRONTEND_URL}/register-completion/${completion_link_slug}`
  }
}

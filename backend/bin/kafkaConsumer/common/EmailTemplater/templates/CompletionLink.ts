import Template from "../types/Template"

export class CompletionLink extends Template {
  async resolve() {
    const completion_link_slug = (
      await this.context.prisma.course.findFirst({
        where: { completion_email: { id: this.emailTemplate.id } },
      })
    )?.slug
    return `https://www.mooc.fi/register-completion/${completion_link_slug}`
  }
}

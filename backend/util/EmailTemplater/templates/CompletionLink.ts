import Template from "../types/Template"

export class CompletionLink extends Template {
  async resolve() {
    const completion_link_slug = (
      await this.prisma.course.findMany({
        where: { completion_email: { id: this.emailTemplate.id } },
      })
    )[0]?.slug
    return `https://www.mooc.fi/register-completion/${completion_link_slug}`
  }
}

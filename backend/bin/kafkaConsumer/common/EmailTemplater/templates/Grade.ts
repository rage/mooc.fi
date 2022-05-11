import Template from "../types/Template"

export class Grade extends Template {
  async resolve() {
    const course = await this.context.prisma.course.findFirst({
      where: { completion_email: { id: this.emailTemplate.id } },
    })

    if (!course) {
      return ""
    }
    const grade = (
      await this.context.prisma.completion.findFirst({
        where: { user: { id: this.user.id }, course: { id: course.id } },
        orderBy: { completion_date: "desc" },
      })
    )?.grade
    return `${grade}`
  }
}

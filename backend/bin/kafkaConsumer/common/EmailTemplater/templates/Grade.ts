import Template from "../types/Template"

export class Grade extends Template {
  async resolve() {
    const course = (
      await this.prisma.course.findMany({
        where: { completion_email: { id: this.emailTemplate.id } },
      })
    )[0]
    if (!course) {
      return ""
    }
    const grade = (
      await this.prisma.completion.findMany({
        where: { user: { id: this.user.id }, course: { id: course.id } },
        orderBy: { completion_date: "desc" },
      })
    )[0]?.grade
    return `${grade}`
  }
}

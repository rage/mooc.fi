import Template from "../types/Template"

export class Grade extends Template {
  async resolve() {
    const course = await this.prisma.course.findFirst({
      where: { completion_email: { id: this.emailTemplate.id } },
    })

    if (!course) {
      return ""
    }
    const grade = (
      await this.prisma.course
        .findUnique({
          where: { id: course.completions_handled_by_id ?? course.id },
        })
        .completions({
          where: {
            user: { id: this.user.id },
          },
          orderBy: { completion_date: "desc" },
          take: 1,
        })
    )?.[0]?.grade
    return `${grade}`
  }
}

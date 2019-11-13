import { prismaObjectType } from "nexus-prisma"
import { stringArg, arg } from "nexus/dist"
import { Course } from "/generated/prisma-client"

const StudyModule = prismaObjectType({
  name: "StudyModule",
  definition(t) {
    t.prismaFields(["*"])
    t.field("description", { type: "String" })
    t.field("courses", {
      type: "Course",
      list: true,
      args: {
        orderBy: arg({ type: "CourseOrderByInput" }),
        language: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const { language, orderBy } = args
        const { prisma } = ctx

        // FIXME: is this Prisma special or not?
        // @ts-ignore
        const courses = await prisma.courses({
          // @ts-ignore
          orderBy: orderBy ?? undefined,
          where: { study_modules_some: { id: parent.id } },
        })

        return language
          ? (await Promise.all(
              courses.map(async (course: Course) => {
                const course_translations = await prisma.courseTranslations({
                  where: { course, language },
                })

                if (!course_translations.length) {
                  return Promise.resolve(null)
                }

                const { name, description, link = "" } = course_translations[0]

                return { ...course, name, description, link }
              }),
            )).filter(v => !!v)
          : courses.map((course: Course) => ({
              ...course,
              description: "",
              link: "",
            }))
      },
    })
  },
})

export default StudyModule

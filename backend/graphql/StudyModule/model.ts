import { omit } from "lodash"
import { arg, objectType, stringArg } from "nexus"

import { Course, CourseTranslation } from "@prisma/client"

import { filterNullFields } from "../../util"

export const StudyModule = objectType({
  name: "StudyModule",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.image()
    t.model.name()
    t.model.order()
    t.model.slug()
    t.model.updated_at()
    t.model.study_module_translations()

    t.string("description")

    t.list.nonNull.field("courses", {
      type: "Course",
      args: {
        orderBy: arg({ type: "CourseOrderByInput" }),
        language: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const { language, orderBy } = args

        const courses: (Course & {
          course_translations?: CourseTranslation[]
        })[] = await ctx.prisma.studyModule
          .findUnique({
            where: { id: parent.id },
          })
          .courses({
            orderBy: filterNullFields(orderBy),
            ...(language && {
              include: {
                course_translations: {
                  where: {
                    language: { equals: language },
                  },
                },
              },
            }),
          })

        const coursesWithDescriptionAndLink = courses.map((course) => ({
          ...omit(course, "course_translations"),
          description: course?.course_translations?.[0]?.description ?? "",
          link: course?.course_translations?.[0]?.link ?? "",
        }))

        return coursesWithDescriptionAndLink
      },
    })
  },
})

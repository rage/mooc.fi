import { omit } from "lodash"
import { arg, booleanArg, list, nonNull, objectType, stringArg } from "nexus"

import { Course, CourseTranslation } from "@prisma/client"

import { filterNullRecursive } from "../../util"

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
        orderBy: list(
          nonNull(
            arg({
              type: "CourseOrderByWithRelationAndSearchRelevanceInput",
            }),
          ),
        ),
        language: stringArg(),
        hidden: booleanArg(),
        statuses: list(nonNull(arg({ type: "CourseStatus" }))),
      },
      resolve: async (parent, { language, orderBy, hidden, statuses }, ctx) => {
        const courses: (Course & {
          course_translations?: CourseTranslation[]
        })[] =
          (await ctx.prisma.studyModule
            .findUnique({
              where: { id: parent.id },
            })
            .courses({
              orderBy: filterNullRecursive(orderBy),
              where: {
                ...(language
                  ? {
                      course_translations: {
                        some: {
                          language,
                        },
                      },
                    }
                  : {}),
                ...(!hidden
                  ? {
                      OR: [
                        {
                          hidden: false,
                        },
                        {
                          hidden: null,
                        },
                      ],
                    }
                  : {}),
                ...(statuses && statuses.length > 0
                  ? {
                      status: { in: statuses },
                    }
                  : {}),
              },
              ...(language
                ? {
                    include: {
                      course_translations: {
                        where: {
                          language,
                        },
                      },
                    },
                  }
                : {}),
            })) ?? []

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

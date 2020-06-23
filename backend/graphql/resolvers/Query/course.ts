import { stringArg, idArg, arg } from "@nexus/schema"
import { schema } from "nexus"
import { course as Course } from "@prisma/client"
import { UserInputError } from "apollo-server-errors"

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("course", {
      type: "course",
      args: {
        slug: stringArg(),
        id: idArg(),
        language: stringArg(),
      },
      nullable: true,
      resolve: async (_, args, ctx) => {
        const { slug, id, language } = args

        if (!slug && !id) {
          throw new UserInputError("must provide id or slug")
        }

        const course = await ctx.db.course.findOne({
          where: {
            slug: slug ?? undefined,
            id: id ?? undefined,
          },
        })

        if (!course) {
          throw new Error("course not found")
        }

        if (language) {
          const course_translations = await ctx.db.course_translation.findMany({
            where: {
              course: course.id,
              language,
            },
          })

          if (!course_translations.length) {
            return Promise.resolve(null)
          }

          // TODO/FIXME: provide language instead of getting the first one
          const { name, description, link = "" } = course_translations[0]
          return {
            ...course,
            name,
            description,
            link,
          }
        }

        return {
          ...course,
          description: "",
          link: "",
        }
      },
    })

    t.crud.courses({
      ordering: true,
    })

    t.list.field("courses", {
      type: "course",
      args: {
        orderBy: arg({ type: "courseOrderByInput" }),
        language: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const { orderBy, language } = args

        const courses = await ctx.db.course.findMany({
          orderBy: orderBy ?? undefined,
        })

        const filtered = language
          ? (
              await Promise.all(
                courses.map(async (course: Course) => {
                  const course_translations = await ctx.db.course_translation.findMany(
                    {
                      where: {
                        course: course.id,
                        language,
                      },
                    },
                  )

                  if (!course_translations.length) {
                    return Promise.resolve(null)
                  }

                  const {
                    name,
                    description,
                    link = "",
                  } = course_translations[0]

                  return { ...course, name, description, link }
                }),
              )
            ).filter((v) => !!v)
          : await Promise.all(
              courses.map((course: Course) => ({
                ...course,
                description: "",
                link: "",
              })),
            )

        // TODO: (?) provide proper typing
        return filtered as (Course & { description: string; link: string })[]
      },
    })

    t.field("course_exists", {
      type: "Boolean",
      args: {
        slug: stringArg({ required: true }),
      },
      resolve: async (_, args, ctx) => {
        const { slug } = args

        return !!(await ctx.db.course.findOne({ where: { slug } }))
      },
    })
  },
})

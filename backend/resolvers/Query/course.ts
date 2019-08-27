import {
  Prisma,
  CourseOrderByInput,
  Course,
} from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, idArg, booleanArg, arg } from "nexus/dist"
import checkAccess from "../../accessControl"

const course = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("course", {
    type: "Course",
    args: {
      slug: stringArg(),
      id: idArg(),
      language: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)

      const { slug, id, language } = args
      const prisma: Prisma = ctx.prisma

      const course = await prisma.course({
        slug: slug,
        id: id,
      })

      if (language) {
        const course_translations = await prisma.courseTranslations({
          where: { course, language },
        })

        if (!course_translations.length) {
          return Promise.resolve(null)
        }

        const { name, description, link = "" } = course_translations[0]
        return { ...course, name, description, link }
      }

      return { ...course, description: "", link: "" }
    },
  })
}

const courses = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("courses", {
    type: "Course",
    args: {
      orderBy: arg({ type: "CourseOrderByInput" }),
      language: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      const { orderBy, language } = args
      const { prisma } = ctx
      // FIXME: this maps as CourseOrderByInput, but still doesn't quite get it
      // @ts-ignore
      const courses = await prisma.courses({ orderBy })

      const filtered = language
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

      return filtered
    },
  })
}

const course_exists = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("course_exists", {
    type: "Boolean",
    args: {
      slug: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)

      const { slug } = args

      return await ctx.prisma.$exists.course({ slug })
    },
  })
}

const addCourseQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  course(t)
  courses(t)
  course_exists(t)
}

export default addCourseQueries

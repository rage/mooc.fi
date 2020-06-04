import {
  Prisma,
  Course,
  CourseOrderByInput,
} from "../../generated/prisma-client"
import { stringArg, idArg, arg } from "@nexus/schema"
import checkAccess from "../../accessControl"
import { NexusGenRootTypes } from "/generated/nexus"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const course = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("course", {
    type: "Course",
    args: {
      slug: stringArg(),
      id: idArg(),
      language: stringArg(),
    },
    nullable: true,
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
        return {
          ...course,
          name,
          description,
          link,
        } as NexusGenRootTypes["Course"]
      }

      return {
        ...course,
        description: "",
        link: "",
      } as NexusGenRootTypes["Course"]
    },
  })
}

const courses = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("courses", {
    type: "Course",
    args: {
      orderBy: arg({ type: "CourseOrderByInput" }),
      language: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      const { orderBy, language } = args
      const { prisma } = ctx

      const courses = await prisma.courses({
        orderBy: orderBy as CourseOrderByInput,
      })

      const filtered = language
        ? (
            await Promise.all(
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
            )
          ).filter((v) => !!v)
        : courses.map((course: Course) => ({
            ...course,
            description: "",
            link: "",
          }))

      return filtered as Array<NexusGenRootTypes["Course"]>
    },
  })
}

const course_exists = (t: ObjectDefinitionBlock<"Query">) => {
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

const addCourseQueries = (t: ObjectDefinitionBlock<"Query">) => {
  course(t)
  courses(t)
  course_exists(t)
}

export default addCourseQueries

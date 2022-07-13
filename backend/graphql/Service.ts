import {
  extendType,
  idArg,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from "nexus"

import { isAdmin } from "../accessControl"

export const Service = objectType({
  name: "Service",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.name()
    t.model.url()
    t.model.exercises()
    t.model.user_course_service_progresses()

    t.list.field("courses", {
      type: "Course",
      resolve: async (parent, _, ctx) => {
        const exerciseCourses = await ctx.prisma.service
          .findUnique({
            where: { id: parent.id },
          })
          .exercises({
            select: {
              course: true,
            },
            distinct: ["course_id"],
          })

        return exerciseCourses.flatMap((ec) => ec.course)
      },
    })
    // t.model.courses()
  },
})

export const ServiceQueries = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("service", {
      type: "Service",
      args: {
        service_id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { service_id }, ctx) =>
        await ctx.prisma.service.findUnique({ where: { id: service_id } }),
    })

    t.nonNull.list.nonNull.field("services", {
      type: "Service",
      args: {
        course_id: nullable(idArg()),
        course_slug: nullable(stringArg()),
        name: nullable(stringArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { course_id, course_slug, name }, ctx) =>
        ctx.prisma.service.findMany({
          where: {
            ...((course_id || course_slug) && {
              courses: {
                some: {
                  id: course_id ?? undefined,
                  slug: course_slug ?? undefined,
                },
              },
            }),
            ...(name && { name: { contains: name, mode: "insensitive" } }),
          },
        }),
    })
  },
})

export const ServiceMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addService", {
      type: "Service",
      args: {
        url: nonNull(stringArg()),
        name: nonNull(stringArg()),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { url, name } = args

        return await ctx.prisma.service.create({
          data: {
            url,
            name,
          },
        })
      },
    })

    t.field("updateService", {
      type: "Service",
      args: {
        id: nonNull(idArg()),
        url: stringArg(),
        name: stringArg(),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const { url, name, id } = args

        return ctx.prisma.service.update({
          where: { id },
          data: {
            url: url ?? "",
            name: name ?? "",
          },
        })
      },
    })
  },
})

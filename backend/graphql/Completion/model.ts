import { objectType } from "nexus"

import { UserCourseProgress } from "@prisma/client"

import { BAIParentCourse, BAITierCourses } from "../../config/courseConfig"
import { GraphQLForbiddenError } from "../../lib/errors"
import {
  checkCertificate,
  checkCertificateForUser,
} from "../../services/certificates"
import { redisify } from "../../services/redis"

export const Completion = objectType({
  name: "Completion",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.completion_language()
    t.model.email()
    t.model.student_number()
    t.model.user_id()
    t.model.user_upstream_id()
    t.model.completions_registered()
    t.model.course_id()
    t.model.grade()
    t.model.certificate_id()
    t.model.eligible_for_ects()
    t.model.course()
    t.model.completion_date()
    t.model.tier()
    t.model.completion_registration_attempt_date()

    // we're not querying completion course languages for now, and this was buggy
    /*     t.field("course", {
      type: "Course",
      args: {
        language: schema.nullable(stringArg()),
      },
      resolve: async (parent, args, ctx) => {
        const { language } = args
        const { prisma } = ctx

        const course = await prisma.course({ id: parent.course })

        if (language) {
          const course_translations = await prisma.courseTranslations({
            where: { course, language },
          })

          if (!course_translations.length) {
            return course
          }

          const { name = course.name, description } = course_translations[0]

          return { ...course, name, description }
        }

        return course
      },
    })
 */
    t.nullable.field("user", {
      type: "User",
      resolve: async (parent, _, ctx) => {
        if (ctx.disableRelations) {
          throw new GraphQLForbiddenError(
            "Cannot query relations when asking for more than 50 objects",
          )
        }
        const user = await ctx.prisma.completion
          .findUnique({ where: { id: parent.id } })
          .user()

        return user
      },
    })

    t.nullable.field("completion_link", {
      type: "String",
      resolve: async (parent, _, ctx) => {
        if (!parent.course_id) {
          return null
        }
        const link = (
          await ctx.prisma.course
            .findUnique({
              where: { id: parent.course_id },
            })
            .open_university_registration_links({
              where: {
                ...(parent.completion_language &&
                parent.completion_language !== "unknown"
                  ? {
                      language: parent.completion_language,
                    }
                  : {}),
              },
            })
        )?.[0]

        return link?.link ?? null
      },
    })

    t.nonNull.field("registered", {
      type: "Boolean",
      resolve: async (parent, _, ctx) => {
        const registered = await ctx.prisma.completion
          .findUnique({
            where: { id: parent.id },
          })
          .completions_registered()

        return registered.length > 0
      },
    })

    t.nonNull.field("project_completion", {
      type: "Boolean",
      resolve: async (parent, _, ctx) => {
        if (!parent.course_id) {
          return false
        }

        if (
          !BAITierCourses.includes(parent.course_id) &&
          parent.course_id !== BAIParentCourse
        ) {
          // we're not a BAI course, no use looking
          return false
        }

        const progresses = await ctx.prisma.userCourseProgress.findMany({
          where: {
            course_id: { in: [BAIParentCourse, ...BAITierCourses] },
            user_id: parent.user_id,
          },
          distinct: ["user_id", "course_id"],
          orderBy: { created_at: "asc" },
        })

        return (
          progresses?.some(
            (p: UserCourseProgress) => (p?.extra as any)?.projectCompletion,
          ) ?? false
        )
      },
    })

    t.nullable.field("certificate_availability", {
      type: "CertificateAvailability",
      resolve: async ({ course_id, user_upstream_id }, _, ctx) => {
        if (!course_id) {
          return null
        }

        const course = await ctx.prisma.course.findUnique({
          where: { id: course_id },
        })

        if (!course) {
          return null
        }

        const accessToken =
          ctx.req?.headers?.authorization?.replace("Bearer ", "") ?? ""

        let certificate_availability
        if (user_upstream_id !== ctx.user?.upstream_id) {
          if (!ctx.user?.administrator) {
            throw new GraphQLForbiddenError(
              "Cannot query other users' certificates",
            )
          }

          if (!user_upstream_id) {
            return null
          }

          certificate_availability = await redisify(
            async () =>
              checkCertificateForUser(
                course.slug,
                user_upstream_id,
                accessToken,
              ),
            {
              prefix: "certificateavailability",
              expireTime: 10,
              key: `${course.slug}-${user_upstream_id}`,
            },
            {
              logger: ctx.logger,
            },
          )
        } else {
          certificate_availability = await redisify(
            async () => checkCertificate(course.slug, accessToken),
            {
              prefix: "certificateavailability",
              expireTime: 10,
              key: `${course.slug}-${ctx.user?.upstream_id}`,
            },
            {
              logger: ctx.logger,
            },
          )
        }

        if (!certificate_availability) {
          return null
        }

        return certificate_availability
      },
    })
  },
})

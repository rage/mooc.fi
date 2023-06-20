import { uniqBy } from "lodash"
import { booleanArg, intArg, list, nonNull, objectType, stringArg } from "nexus"

import { Prisma } from "@prisma/client"

import { isAdmin } from "../../accessControl"
import { GraphQLForbiddenError, GraphQLUserInputError } from "../../lib/errors"

export const Course = objectType({
  name: "Course",
  definition(t) {
    t.model.id()
    t.model.automatic_completions()
    t.model.completion_email_id()
    t.model.completion_email()
    t.model.completions_handled_by_id()
    t.model.completions_handled_by()
    t.model.course_translations()
    t.model.created_at()
    t.model.ects()
    t.model.end_date()
    t.model.exercise_completions_needed()
    t.model.has_certificate()
    t.model.hidden()
    t.model.inherit_settings_from_id()
    t.model.inherit_settings_from()
    t.model.name()
    t.model.order()
    t.model.owner_organization_id()
    t.model.owner_organization()
    t.model.photo_id()
    t.model.photo()
    t.model.points_needed()
    t.model.promote()
    t.model.slug()
    t.model.start_date()
    t.model.start_point()
    t.model.status()
    t.model.study_module_order()
    t.model.study_module_start_point()
    t.model.support_email()
    t.model.teacher_in_charge_email()
    t.model.teacher_in_charge_name()
    t.model.updated_at()
    // t.model.completions()
    // t.model.completions_registered()
    t.model.course_aliases()
    t.model.course_organizations()
    t.model.course_variants()
    // t.model.exercises()
    t.model.open_university_registration_links()
    // t.model.user_course_progresses()
    // t.model.user_course_service_progresses()
    // t.model.user_course_settings()
    t.model.user_course_settings_visibilities()
    t.model.services()
    t.model.study_modules()
    t.model.automatic_completions_eligible_for_ects()
    t.model.upcoming_active_link()
    t.model.tier()
    t.model.handles_completions_for()
    t.model.handles_settings_for()
    t.model.course_stats_email_id()
    t.model.course_stats_email()
    t.model.language()

    t.string("description")
    t.string("instructions")
    t.string("link")

    t.list.nonNull.field("completions", {
      type: "Completion",
      args: {
        user_id: stringArg(),
        user_upstream_id: intArg(),
      },
      authorize: isAdmin,
      validate: (_, { user_id, user_upstream_id }) => {
        if (!user_id && !user_upstream_id) {
          throw new GraphQLUserInputError("needs user_id or user_upstream_id")
        }
      },
      resolve: async (parent, { user_id, user_upstream_id }, ctx) => {
        return ctx.prisma.course
          .findUnique({
            where: {
              id: parent.completions_handled_by_id ?? parent.id,
            },
          })
          .completions({
            where: {
              user: {
                id: user_id ?? undefined,
                upstream_id: user_upstream_id ?? undefined,
              },
            },
            distinct: ["user_id", "course_id"],
            orderBy: { updated_at: "desc" },
          })
      },
    })

    t.list.nonNull.field("exercises", {
      type: "Exercise",
      args: {
        includeDeleted: booleanArg({ default: false }),
        includeNoPointsAwarded: booleanArg({ default: true }),
      },
      resolve: async (
        parent,
        { includeDeleted, includeNoPointsAwarded },
        ctx,
      ) => {
        const exerciseCondition: Prisma.ExerciseWhereInput = {}

        if (!includeNoPointsAwarded) {
          exerciseCondition.max_points = { gt: 0 }
        }
        if (!includeDeleted) {
          exerciseCondition.OR = [{ deleted: false }, { deleted: null }]
        }

        return ctx.prisma.course
          .findUnique({
            where: { id: parent.id },
          })
          .exercises({
            where: exerciseCondition,
          })
      },
    })

    t.nonNull.list.nonNull.field("tags", {
      type: "Tag",
      args: {
        language: stringArg(),
        types: list(nonNull(stringArg())),
        search: stringArg(),
        includeHidden: booleanArg(),
      },
      validate: (_, { includeHidden }, ctx) => {
        if (includeHidden && !isAdmin({}, {}, ctx, {})) {
          throw new GraphQLForbiddenError("no admin rights")
        }
      },
      resolve: async (
        parent,
        { language, types, search, includeHidden },
        ctx,
      ) => {
        const tagsWhere = {} as Prisma.TagWhereInput

        if (language) {
          tagsWhere.tag_translations = {
            some: {
              language,
            },
          }
        }
        if (types) {
          tagsWhere.tag_types = {
            some: {
              name: { in: types },
            },
          }
        }
        if (search) {
          tagsWhere.tag_translations = {
            some: {
              ...(language && { language }),
              OR: [
                {
                  name: { contains: search, mode: "insensitive" },
                },
                {
                  description: { contains: search, mode: "insensitive" },
                },
              ],
            },
          }
        }
        if (!includeHidden) {
          tagsWhere.OR = [{ hidden: false }, { hidden: { not: true } }]
        }

        const res = await ctx.prisma.course.findUnique({
          where: { id: parent.id },
          include: {
            tags: { where: tagsWhere },
            handles_completions_for: {
              include: {
                tags: {
                  where: tagsWhere,
                },
              },
            },
          },
        })

        const tags = uniqBy(
          (res?.tags ?? []).concat(
            res?.handles_completions_for?.flatMap((c) => c.tags ?? []) ?? [],
          ),
          "id",
        )

        return tags.map((t) => ({ ...t, language }))
      },
    })

    t.nonNull.list.nonNull.field("sponsors", {
      type: "Sponsor",
      args: {
        language: stringArg(),
      },
      resolve: async (parent, { language }, ctx) => {
        const sponsors = await ctx.prisma.course
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .sponsors({
            ...(language && {
              where: {
                translations: {
                  some: {
                    language,
                  },
                },
              },
            }),
          })

        return (sponsors ?? []).map((sponsor) => ({ ...sponsor, language }))
      },
    })
  },
})

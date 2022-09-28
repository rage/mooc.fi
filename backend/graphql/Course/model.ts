import { booleanArg, intArg, nullable, objectType, stringArg } from "nexus"

import { isAdmin } from "../../accessControl"
import { mapCompletionsWithCourseInstanceId } from "../../util/db-functions"

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
    t.model.course_stats_email_id()
    t.model.course_stats_email()

    t.string("description")
    t.string("instructions")
    t.string("link")

    t.list.field("completions", {
      type: "Completion",
      args: {
        user_id: nullable(stringArg()),
        user_upstream_id: nullable(intArg()),
      },
      authorize: isAdmin,
      resolve: async (parent, args, ctx) => {
        const { user_id, user_upstream_id } = args

        if (!user_id && !user_upstream_id) {
          throw new Error("needs user_id or user_upstream_id")
        }

        // TODO: if we're querying from the parent course, obviously
        // the course instance id is the same here -- depends on what
        // we need?
        return mapCompletionsWithCourseInstanceId(
          await ctx.prisma.course
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
            }),
          parent.id,
        )
      },
    })

    t.list.field("exercises", {
      type: "Exercise",
      args: {
        includeDeleted: booleanArg({ default: false }),
      },
      resolve: async (parent, args, ctx) => {
        const { includeDeleted } = args

        return ctx.prisma.course
          .findUnique({
            where: { id: parent.id },
          })
          .exercises({
            ...(!includeDeleted && { where: { deleted: { not: true } } }),
          })
      },
    })
  },
})

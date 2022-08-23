import { UserInputError } from "apollo-server-express"
import {
  extendType,
  idArg,
  intArg,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

import { isAdmin } from "../accessControl"

export const EmailTemplate = objectType({
  name: "EmailTemplate",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.html_body()
    t.model.name()
    t.model.title()
    t.model.txt_body()
    t.model.courses()
    t.model.email_deliveries()
    t.model.template_type()
    t.model.triggered_automatically_by_course_id()
    t.model.exercise_completions_threshold()
    t.model.points_threshold()
    t.model.course_stats_subscriptions()
    t.model.joined_organizations()
  },
})

export const EmailTemplateQueries = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("email_template", {
      type: "EmailTemplate",
      args: {
        id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: (_, { id }, ctx) =>
        ctx.prisma.emailTemplate.findUnique({
          where: {
            id,
          },
        }),
    })

    t.list.field("email_templates", {
      type: "EmailTemplate",
      authorize: isAdmin,
      resolve: (_, __, ctx) => ctx.prisma.emailTemplate.findMany(),
    })
  },
})

export const EmailTemplateMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addEmailTemplate", {
      type: "EmailTemplate",
      args: {
        name: nonNull(stringArg()),
        html_body: stringArg(),
        txt_body: stringArg(),
        title: stringArg(),
        template_type: stringArg(),
        triggered_automatically_by_course_id: stringArg(),
        exercise_completions_threshold: intArg(),
        points_threshold: intArg(),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const {
          name,
          html_body,
          txt_body,
          title,
          template_type,
          triggered_automatically_by_course_id,
          exercise_completions_threshold,
          points_threshold,
        } = args

        if (name === "") {
          throw new UserInputError("name is empty", { argumentName: "name" })
        }

        return ctx.prisma.emailTemplate.create({
          data: {
            name,
            html_body,
            txt_body,
            title,
            template_type,
            triggered_automatically_by_course_id,
            exercise_completions_threshold,
            points_threshold,
          },
        })
      },
    })

    t.field("updateEmailTemplate", {
      type: "EmailTemplate",
      args: {
        id: nonNull(idArg()),
        name: stringArg(),
        html_body: stringArg(),
        txt_body: stringArg(),
        title: stringArg(),
        template_type: stringArg(),
        triggered_automatically_by_course_id: stringArg(),
        exercise_completions_threshold: intArg(),
        points_threshold: intArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const {
          id,
          name,
          html_body,
          txt_body,
          title,
          template_type,
          triggered_automatically_by_course_id,
          exercise_completions_threshold,
          points_threshold,
        } = args

        return ctx.prisma.emailTemplate.update({
          where: {
            id,
          },
          data: {
            name,
            html_body,
            txt_body,
            title,
            template_type,
            triggered_automatically_by_course_id,
            exercise_completions_threshold,
            points_threshold,
          },
        })
      },
    })

    t.field("deleteEmailTemplate", {
      type: "EmailTemplate",
      args: {
        id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: (_, { id }, ctx) => {
        return ctx.prisma.emailTemplate.delete({ where: { id } })
      },
    })
  },
})

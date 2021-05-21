import { ApiContext } from "."
import { requireAuth } from "../util/validateAuth"
import { User, UserCourseSetting } from "@prisma/client"

export function getUser(ctx: ApiContext) {
  return async (req: any, res: any) => {
    let auth = await requireAuth(req.headers.authorization, ctx)
    if (auth.error) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Not logged in.",
      })
    }

    const course_id = req.params.course_id

    let user = (
      await ctx.knex
        .select<any, User[]>(
          "id",
          "upstream_id",
          "administrator",
          "username",
          "email",
          "first_name",
          "last_name",
        )
        .from("user")
        .where("id", auth.id)
    )?.[0]

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      })
    }

    let extra_fields = {}
    if (course_id) {
      let user_course_settings = (
        await ctx.knex
          .select<any, UserCourseSetting[]>(
            "language",
            "country",
            "research",
            "marketing",
            "course_variant",
            "other",
          )
          .from("user_course_setting")
          .where("user_id", user.id)
          .where("course_id", course_id)
      )?.[0]

      if (user_course_settings) {
        extra_fields = {
          language: user_course_settings.language,
          country: user_course_settings.country,
          research: user_course_settings.research,
          marketing: user_course_settings.marketing,
          course_variant: user_course_settings.course_variant,
          ...((user_course_settings?.other as object) ?? {}),
        }
      }
    }

    return res.status(200).json({
      administrator: user.administrator,
      email: user.email,
      id: user.upstream_id,
      username: user.username,
      extra_fields,
      user_field: {
        first_name: user.first_name,
        last_name: user.last_name,
      },
    })
  }
}
/*
export function updateUser(ctx: ApiContext) {
    return async (req: any, res: any) => {
        let auth = await requireAuth(req.headers.authorization, ctx)
        if (auth.error) {
            return res.status(403).json({
                status: 403,
                success: false,
                message: "Not logged in.",
            })
        }

        const course_id = req.params.course_id

        let user = (
            await ctx.knex
                .select<any, User[]>("id", "upstream_id", "administrator", "username", "email", "first_name", "last_name")
                .from("user")
                .where("id", auth.id)
        )?.[0]

        if (!user) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found."
            })
        }
    }
}*/

import { ApiContext } from "."
import { requireAuth } from "../util/validateAuth"
import { User, UserCourseSetting } from "@prisma/client"
import { validatePassword, invalidateAuth } from "../util/validateAuth"
import { argon2Hash } from "../util/hashPassword"
import {
  authenticateUser,
  getCurrentUserDetails,
  updateUser,
} from "../services/tmc"

const argon2 = require("argon2")

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
      first_name: user.first_name,
      last_name: user.last_name,
    })
  }
}

export function updatePassword(ctx: ApiContext) {
  return async (req: any, res: any) => {
    let auth = await requireAuth(req.headers.authorization, ctx)
    if (auth.error) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Not logged in.",
      })
    }

    const oldPassword = req.body.oldPassword
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword

    if (!validatePassword(password)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Password is invalid",
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Confirmation password must match new password",
      })
    }

    let user = (
      await ctx.knex
        .select<any, User[]>("id", "upstream_id", "email", "password")
        .from("user")
        .where("id", auth.id)
    )?.[0]
    if (await argon2.verify(user.password, oldPassword)) {
      if (await argon2.verify(user.password, password)) {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "You cannot use your old password.",
        })
      }

      const tmcUser = await authenticateUser(user.email, oldPassword)

      let userDetails = await getCurrentUserDetails(tmcUser.token)
      let updateDetails = {
        ...userDetails,
        old_password: oldPassword,
        password: password,
        password_repeat: confirmPassword,
      }

      await updateUser(user.upstream_id, updateDetails, tmcUser.token)

      const hashPassword = await argon2Hash(password)

      await ctx
        .knex("user")
        .update({ password: hashPassword })
        .where("id", user.id)

      await invalidateAuth(user.id, ctx)

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Password updated. User has been logged out of all devices.",
      })
    } else {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Old password was incorrect",
      })
    }
  }
}

import { Request, Response } from "express"
import { omit } from "lodash"

import { User, UserCourseSetting, VerifiedUser } from "@prisma/client"

import { invalidate } from "../services/redis"
import {
  authenticateUser,
  getCurrentUserDetails,
  getUsersByEmail,
  updateUser as updateTMCUser,
} from "../services/tmc"
import { argon2Hash } from "../util/hashPassword"
import {
  invalidateAuth,
  requireAuth,
  validatePassword,
} from "../util/validateAuth"
import { ApiContext } from "./"

require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

const argon2 = require("argon2")

export function getUser(ctx: ApiContext) {
  return async (req: Request, res: Response) => {
    let auth = await requireAuth(req.headers.authorization ?? "", ctx)
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
  return async (req: Request, res: Response) => {
    const token = req.headers.authorization ?? ""
    let auth = await requireAuth(token, ctx)
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

      if (!tmcUser.token) {
        return res.status(403).json({
          status: 403,
          success: false,
          message: "Could not authenticate user.",
        })
      }

      let userDetails = await getCurrentUserDetails(tmcUser.token)
      let updateDetails = {
        ...userDetails,
        old_password: oldPassword,
        password: password,
        password_repeat: confirmPassword,
      }

      await updateTMCUser(user.upstream_id, updateDetails, tmcUser.token ?? "")

      const hashPassword = await argon2Hash(password)

      await ctx
        .knex("user")
        .update({ password: hashPassword })
        .where("id", user.id)

      await invalidateAuth(user.id, ctx)
      invalidate(["userdetails", "user"], token)

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

interface RegisterUserParams {
  personalUniqueCode: string
  displayName: string
  firstName: string
  lastName: string
  homeOrganization: string
  personAffiliation: string
  mail: string
  organizationalUnit: string
}

export function registerUser(ctx: ApiContext) {
  return async (req: Request<{}, {}, RegisterUserParams>, res: Response) => {
    const {
      personalUniqueCode,
      displayName,
      firstName,
      lastName,
      homeOrganization,
      personAffiliation,
      mail,
      organizationalUnit,
    } = req.body

    const existingUser = await ctx.prisma.user.findFirst({
      where: {
        email: mail,
      },
    })

    const existingVerifiedUser = await ctx.prisma.verifiedUser.findFirst({
      where: {
        mail,
        home_organization: homeOrganization,
      },
      include: {
        user: true,
      },
    })

    const existingTMCUser = (await getUsersByEmail([mail]))?.[0]

    if (existingUser || existingVerifiedUser) {
      const accessToken = await ctx.prisma.accessToken.findFirst({
        where: {
          user_id: existingUser?.id || existingVerifiedUser?.user_id,
          valid: true,
        },
      })

      return res.status(401).json({
        status: 401,
        success: false,
        user: existingUser || existingVerifiedUser?.user,
        verified_user: omit(existingVerifiedUser, "user"),
        tmc_user: existingTMCUser,
        access_token: accessToken?.access_token,
        message: "User or verified user already exists",
      })
    }

    let newUser: User | undefined
    let newVerifiedUser: VerifiedUser | undefined

    try {
      let upstream_id = existingTMCUser?.id

      if (!upstream_id) {
        // assign random unique negative upstream_id for user until has real TMC account
        while (true) {
          upstream_id = -1 - Math.round(Math.random() * 100000)

          if (!(await ctx.prisma.user.findUnique({ where: { upstream_id } }))) {
            break
          }
        }
      }

      const real_student_number = getStudentNumber(personalUniqueCode)

      newUser = await ctx.prisma.user.create({
        data: {
          username: mail,
          email: mail,
          first_name: firstName,
          last_name: lastName,
          administrator: false,
          upstream_id,
          real_student_number,
        },
      })

      newVerifiedUser = await ctx.prisma.verifiedUser.create({
        data: {
          user: { connect: { id: newUser.id } },
          home_organization: homeOrganization,
          mail,
          organizational_unit: organizationalUnit,
          person_affiliation: personAffiliation,
          personal_unique_code: personalUniqueCode,
          display_name: displayName,
        },
      })

      return res.status(200).json({
        status: 200,
        success: true,
        user: newUser,
        verified_user: newVerifiedUser,
        tmc_user: existingTMCUser,
        message: "User created",
      })
    } catch {
      return res.status(500).json({
        status: 500,
        success: false,
        user: newUser,
        verified_user: newVerifiedUser,
        message: "Error creating user",
      })
    }
  }
}

const updateableUserFields = [
  "administrator",
  "email",
  "first_name",
  "last_name",
  "real_student_number",
  "research_consent",
  "student_number",
  "upstream_id",
  "username",
]

export function updateUser(ctx: ApiContext) {
  return async (
    req: Request<
      {},
      {},
      Omit<Partial<User>, "created_at" | "updated_at" | "id"> & {
        secret: string
      }
    >,
    res: Response,
  ) => {
    const token = req.headers.authorization ?? ""
    const auth = await requireAuth(token, ctx)

    if (auth.error) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Not logged in.",
      })
    }

    const data: Partial<User> = Object.entries(req.body)
      .filter(
        ([key, _]) => key !== "secret" && updateableUserFields.includes(key),
      )
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "No data provided",
      })
    }

    const { secret } = req.body

    if (secret !== process.env.UPDATE_USER_SECRET) {
      return res.status(405).json({
        status: 405,
        success: false,
        message: "Not allowed",
      })
    }

    try {
      const updatedUser = await ctx.prisma.user.update({
        where: {
          id: auth.id,
        },
        data,
        select: {
          upstream_id: true,
          email: true,
          first_name: true,
          last_name: true,
          created_at: true,
          updated_at: true,
          real_student_number: true,
          username: true,
        },
      })

      return res.status(200).json({
        status: 200,
        success: true,
        message: "User updated",
        data: updatedUser,
      })
    } catch {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "User update not successful",
      })
    }
  }
}

export function updatePersonAffiliation(ctx: ApiContext) {
  return async (
    req: Request<
      {},
      {},
      {
        personal_unique_code: string
        person_affiliation: string
        home_organization: string
      }
    >,
    res: Response,
  ) => {
    const token = req.headers.authorization ?? ""
    const auth = await await requireAuth(token, ctx)

    if (auth.error) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Not logged in.",
      })
    }

    const {
      person_affiliation,
      personal_unique_code,
      home_organization,
    } = req.body

    if (!personal_unique_code || !home_organization) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "No personal_unique code or home_organization provided",
      })
    }

    try {
      const existing = await ctx.prisma.verifiedUser.findUnique({
        where: {
          user_id_personal_unique_code_home_organization: {
            user_id: auth.id,
            personal_unique_code,
            home_organization,
          },
        },
      })

      if (existing?.person_affiliation === person_affiliation) {
        return res.status(200).json({
          status: 200,
          success: true,
          message: "No change",
        })
      }

      await ctx.prisma.verifiedUser.update({
        where: {
          user_id_personal_unique_code_home_organization: {
            user_id: auth.id,
            personal_unique_code,
            home_organization,
          },
        },
        data: {
          person_affiliation,
          person_affiliation_updated_at: new Date().toISOString(),
        },
      })

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Person affiliation updated",
      })
    } catch (error: any) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Verified user update not successful",
      })
    }
  }
}

function getStudentNumber(personalUniqueCode: string) {
  const codes = personalUniqueCode.split(";").map((code) => code.split(":"))

  const codeWithStudentID = codes.find((code) =>
    code.some((field) => field === "helsinki.fi"),
  )

  return codeWithStudentID?.[codeWithStudentID.length - 1]
}

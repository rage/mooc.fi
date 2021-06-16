import { ApiContext } from "."
import { createUser, getCurrentUserDetails, updateUser } from "../services/tmc"
import { signIn } from "./token"
import { validateEmail, validatePassword } from "../util/validateAuth"
import { argon2Hash } from "../util/hashPassword"
import { User } from "@prisma/client"

const crypto = require("crypto")

export function signUp(ctx: ApiContext) {
  return async (req: any, res: any) => {
    let result = <any>(
      await _signUp(
        req.body.email,
        req.body.password,
        req.body.confirmPassword,
        ctx,
      )
    )
    if (result.success) {
      const user = {
        user: {
          email: req.body.email,
          extra_fields: req.body.extra_fields,
        },
        user_field: {
          email: req.body.email,
          ...req.body.user_fields,
        },
      }

      const auth = await (<any>signIn(req.body.email, req.body.password, ctx))
      if (result.data) {
        await updateUser(result.data.id, user, auth.tmc_token)
      }

      result.auth = auth
    }

    return res.status(result.status).json(result)
  }
}

async function _signUp(
  email: string,
  password: string,
  confirmPassword: string,
  { knex }: ApiContext,
) {
  const username = crypto.randomBytes(8).toString("hex")

  if (email.length > 64 || !validateEmail(email)) {
    return {
      status: 400,
      success: false,
      message: "Email is invalid or too long",
    }
  }

  if (!validatePassword(password)) {
    return {
      status: 400,
      success: false,
      message: "Password is invalid",
    }
  }

  if (password !== confirmPassword) {
    return {
      status: 400,
      success: false,
      message: "Confirmation password must match new password",
    }
  }

  const checkEmail = await knex
    .select<any, User[]>("email")
    .from("user")
    .where("email", email)

  if (checkEmail.length > 0) {
    return {
      status: 401,
      success: false,
      message: "Email is already in use.",
    }
  }

  const accessToken = await createUser(
    email,
    username,
    password,
    confirmPassword,
  )

  if (!accessToken.success) {
    return {
      status: 401,
      success: false,
      message: accessToken.error,
    }
  }

  const userDetails = await getCurrentUserDetails(accessToken.token)

  const hashPassword = await argon2Hash(password)

  let user = (
    await knex
      .select<any, User[]>("id")
      .from("user")
      .where("upstream_id", userDetails.id)
  )?.[0]
  if (!user) {
    user = (
      await knex("user")
        .insert({
          upstream_id: userDetails.id,
          email,
          username,
          password: hashPassword,
          administrator: userDetails.administrator,
        })
        .returning("*")
    )?.[0]
  }

  return {
    status: 200,
    success: true,
    data: userDetails,
  }
}

import { createUser, getCurrentUserDetails, updateUser } from "../services/tmc"

import { signIn } from "./token"

import { validateEmail, validatePassword } from "../util/validateAuth"
import { User } from "@prisma/client"
import Knex from "../services/knex"

const argon2 = require("argon2")
const crypto = require("crypto")

export function signUp() {
  return async (req: any, res: any) => {
    const ipAddress = req.connection.remoteAddress

    let result = <any>(
      await _signUp(req.body.email, req.body.password, req.body.confirmPassword)
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

      const auth = await (<any>(
        signIn(req.body.email, req.body.password, ipAddress)
      ))
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

  const checkEmail = await Knex.select("email")
    .from("user")
    .where("email", email)

  if (checkEmail.length > 0) {
    return {
      status: 400,
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
      status: 500,
      success: false,
      message: `Error creating user.`,
    }
  }
  const userDetails = await getCurrentUserDetails(accessToken.token)

  const hashPassword = await argon2.hash(password, {
    type: argon2.argon2id,
    timeCost: 4,
    memoryCost: 15360,
    hashLength: 64,
  })

  let user = (
    await Knex.select<any, User[]>("id")
      .from("user")
      .where("upstream_id", userDetails.id)
  )?.[0]
  if (!user) {
    try {
      user = (
        await Knex("user")
          .insert({
            upstream_id: userDetails.id,
            email,
            username,
            password: hashPassword,
            administrator: userDetails.administrator,
          })
          .returning("*")
      )?.[0]
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: `Error creating user: ${error}`,
      }
    }
  }

  return {
    status: 200,
    success: true,
    data: userDetails,
  }
}

import { createHash } from "crypto"

import { pick } from "lodash"

import { User } from "@prisma/client"

import { USER_HASH_SECRET } from "../config"

export const hashUser = (user: User) =>
  createHash("sha512")
    .update(
      Object.values(
        pick(user, [
          "upstream_id",
          "administrator",
          "email",
          "first_name",
          "last_name",
          "username",
        ]),
      ).join("-"),
    )
    .digest("hex")

export const hashUserToken = (token: string) =>
  createHash("sha256")
    .update(token + USER_HASH_SECRET)
    .digest("hex")

export default hashUser

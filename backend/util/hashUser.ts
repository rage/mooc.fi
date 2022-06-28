import { createHash } from "crypto"

import { pick } from "lodash"

import { User } from "@prisma/client"

export default (user: User) =>
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

import { pick } from "lodash"
import { createHash } from "crypto"

export default (user: any) =>
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

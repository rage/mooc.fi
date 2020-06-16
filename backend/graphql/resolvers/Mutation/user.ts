import { stringArg } from "@nexus/schema"
import { AuthenticationError } from "apollo-server-core"
import { invalidate } from "../../../services/redis"
import { schema } from "nexus"
import { Context } from "/context"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateUserName", {
      type: "user",
      args: {
        first_name: stringArg(),
        last_name: stringArg(),
      },
      resolve: (_, { first_name, last_name }, ctx: Context) => {
        const {
          user: currentUser,
          headers: { authorization },
        } = ctx

        if (!currentUser) {
          throw new AuthenticationError("not logged in")
        }
        const access_token = authorization?.split(" ")[1]

        invalidate("userdetails", `Bearer ${access_token}`)

        return ctx.db.user.update({
          where: { id: currentUser.id },
          data: {
            first_name,
            last_name,
          },
        })
      },
    })
  },
})

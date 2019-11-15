import { ForbiddenError } from "apollo-server-core"
import { Context } from "/context"

const Completion = async (parent: any, args: any, ctx: Context) => {
  if (ctx.disableRelations) {
    throw new ForbiddenError(
      "Cannot query relations when asking for more than 50 objects",
    )
  }
  return ctx.prisma.completion({ id: parent.id }).user()
}

export default Completion

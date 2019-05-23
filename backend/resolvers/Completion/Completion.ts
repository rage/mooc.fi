import { ForbiddenError } from "apollo-server-core"

const Completion = async (parent, args, ctx) => {
  if (ctx.disableRelations) {
    throw new ForbiddenError(
      "Cannot query relations when asking for more than 50 objects",
    )
  }
  return ctx.prisma.completion({ id: parent.id }).user()
}

export default Completion

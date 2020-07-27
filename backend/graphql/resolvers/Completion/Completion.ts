import { ForbiddenError } from "apollo-server-core"
import { NexusContext } from "../../../context"

// FIXME/DELETE: what's this relic?

const Completion = async (parent: any, _: any, ctx: NexusContext) => {
  if (ctx.disableRelations) {
    throw new ForbiddenError(
      "Cannot query relations when asking for more than 50 objects",
    )
  }
  return ctx.db.completion.findOne({ where: { id: parent.id } }).user()
}

export default Completion

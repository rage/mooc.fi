import { ForbiddenError } from "apollo-server-errors"
import { Context } from "../../../context"

const Completion = async (parent: any, _: any, ctx: Context) => {
  if (ctx.disableRelations) {
    throw new ForbiddenError(
      "Cannot query relations when asking for more than 50 objects",
    )
  }
  return ctx.db.completion.findOne({ where: { id: parent.id } }).user()
}

export default Completion

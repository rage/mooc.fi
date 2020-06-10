import { intArg, idArg } from "@nexus/schema"
import { Prisma } from "../../generated/prisma-client"
import checkAccess from "../../accessControl"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const addExerciseCompletion = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("addExerciseCompletion", {
    type: "exercise_completion",
    args: {
      n_points: intArg(),
      exercise: idArg(),
      user: idArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const { n_points, exercise, user } = args
      const prisma: Prisma = ctx.prisma
      return prisma.createExerciseCompletion({
        n_points: n_points,
        exercise: { connect: { id: exercise } },
        user: { connect: { id: user } },
      })
    },
  })
}

const addExerciseCompletionMutations = (
  t: ObjectDefinitionBlock<"Mutation">,
) => {
  addExerciseCompletion(t)
}

export default addExerciseCompletionMutations

import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { intArg, idArg } from "nexus/dist"
import { Prisma } from "../../generated/prisma-client"
import checkAccess from "../../accessControl"

const addExerciseCompletion = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addExerciseCompletion", {
    type: "ExerciseCompletion",
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
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  addExerciseCompletion(t)
}

export default addExerciseCompletionMutations

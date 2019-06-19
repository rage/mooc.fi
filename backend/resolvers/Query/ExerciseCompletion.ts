import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const exerciseCompletion = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("exerciseCompletion", {
    type: "ExerciseCompletion",
    args: {
      id: idArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const { id } = args
      const prisma: Prisma = ctx.prisma
      return prisma.exerciseCompletion({
        id: id,
      })
    },
  })
}

const exercisesCompletions = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("exerciseCompletions", {
    type: "ExerciseCompletion",
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      return ctx.prisma.exerciseCompletions()
    },
  })
}

const addExerciseCompletionQueries = (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  exerciseCompletion(t)
  exercisesCompletions(t)
}

export default addExerciseCompletionQueries

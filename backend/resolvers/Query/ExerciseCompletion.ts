import { Prisma } from "../../generated/prisma-client"
import { idArg } from "@nexus/schema"
import checkAccess from "../../accessControl"
import { NexusGenRootTypes } from "/generated/nexus"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const exerciseCompletion = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("exerciseCompletion", {
    type: "ExerciseCompletion",
    args: {
      id: idArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
      const { id } = args
      const prisma: Prisma = ctx.prisma

      const completion = await prisma.exerciseCompletion({
        id: id,
      })

      return completion as NexusGenRootTypes["ExerciseCompletion"]
    },
  })
}

const exercisesCompletions = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("exerciseCompletions", {
    type: "ExerciseCompletion",
    resolve: (_, __, ctx) => {
      checkAccess(ctx)
      return ctx.prisma.exerciseCompletions()
    },
  })
}

const addExerciseCompletionQueries = (t: ObjectDefinitionBlock<"Query">) => {
  exerciseCompletion(t)
  exercisesCompletions(t)
}

export default addExerciseCompletionQueries

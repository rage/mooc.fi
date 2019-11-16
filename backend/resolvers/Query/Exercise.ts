import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import { NexusGenRootTypes } from "/generated/nexus"

const exercise = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("exercise", {
    type: "Exercise",
    args: {
      id: idArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
      const { id } = args
      const prisma: Prisma = ctx.prisma

      const exercise = await prisma.exercise({
        id: id,
      })

      return exercise as NexusGenRootTypes["Exercise"]
    },
  })
}

const exercises = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("exercises", {
    type: "Exercise",
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      return ctx.prisma.exercises()
    },
  })
}

const addExerciseQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  exercise(t)
  exercises(t)
}

export default addExerciseQueries

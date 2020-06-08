import { Prisma } from "../../generated/prisma-client"
import { idArg, stringArg } from "@nexus/schema"
import checkAccess from "../../accessControl"
import { NexusGenRootTypes } from "/generated/nexus"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const exercise = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("exercise", {
    type: "exercise",
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

const exercises = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("exercises", {
    type: "exercise",
    resolve: (_, __, ctx) => {
      checkAccess(ctx)
      return ctx.prisma.exercises()
    },
  })
}

const addExerciseQueries = (t: ObjectDefinitionBlock<"Query">) => {
  exercise(t)
  exercises(t)
}

export default addExerciseQueries

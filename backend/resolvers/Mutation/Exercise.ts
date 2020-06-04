import { stringArg, intArg, idArg } from "@nexus/schema"
import { Prisma } from "../../generated/prisma-client"
import checkAccess from "../../accessControl"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const addExercise = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("addExercise", {
    type: "Exercise",
    args: {
      custom_id: stringArg(),
      name: stringArg(),
      part: intArg(),
      section: intArg(),
      max_points: intArg(),
      course: idArg(),
      service: idArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const {
        custom_id,
        name,
        part,
        section,
        max_points,
        course,
        service,
      } = args
      console.log(args)
      const prisma: Prisma = ctx.prisma
      return prisma.createExercise({
        course: { connect: { id: course } },
        service: { connect: { id: service } },
        custom_id: custom_id ?? "",
        name: name,
        max_points: max_points,
        part: part,
        section: section,
      })
    },
  })
}

const addExerciseMutations = (t: ObjectDefinitionBlock<"Mutation">) => {
  addExercise(t)
}

export default addExerciseMutations

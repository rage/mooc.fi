require("dotenv-safe").config()
import { Prisma, Course, Completion } from "../generated/prisma-client"

export default async function fetchCompletions(
  args,
  ctx,
): Promise<Completion[]> {
  const { course } = args
  const startTime = new Date().getTime()
  const data = await getCompletionDataFromDB(args, ctx)
  console.log("FINISHED WITH", course)
  const stopTime = new Date().getTime()
  console.log("used", stopTime - startTime, "time")
  return data
}

async function getCompletionDataFromDB(
  { course, first, after, last, before },
  ctx,
): Promise<Completion[]> {
  const prisma: Prisma = ctx.prisma
  const courseObject: Course = await prisma.course({ slug: course })

  return prisma.completions({
    where: { course: { id: courseObject.id } },
    first: first,
    after: after,
    last: last,
    before: before,
  })
}

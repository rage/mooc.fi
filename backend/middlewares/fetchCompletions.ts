import { Prisma, Course, Completion, Maybe } from "../generated/prisma-client"
import { Context } from "/context"

export default async function fetchCompletions(
  args: any,
  ctx: Context,
): Promise<Completion[]> {
  const { course } = args
  const startTime = new Date().getTime()
  const data = await getCompletionDataFromDB(args, ctx)
  console.log("FINISHED WITH", course)
  const stopTime = new Date().getTime()
  console.log("used", stopTime - startTime, "time")
  return data
}

interface CompletionOptionTypes {
  course: string
  first?: number
  after?: string
  last?: number
  before?: string
}

async function getCompletionDataFromDB(
  { course, first, after, last, before }: CompletionOptionTypes,
  ctx: Context,
): Promise<Completion[]> {
  const prisma: Prisma = ctx.prisma
  const courseObject: Maybe<Course> = await prisma.course({ slug: course })

  return prisma.completions({
    where: { course: { id: courseObject?.id } },
    first: first,
    after: after,
    last: last,
    before: before,
  })
}

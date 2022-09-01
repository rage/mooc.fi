import { Context } from "../context"
import { convertPagination, getCourseOrAlias } from "../util/db-functions"

export default async function fetchCompletions(args: any, ctx: Context) {
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
  skip?: number
}

// probably not used
async function getCompletionDataFromDB(
  { course: slug, first, after, last, before, skip }: CompletionOptionTypes,
  ctx: Context,
) {
  const course = await getCourseOrAlias(ctx)({
    where: {
      slug,
    },
  })
  if (!course) {
    throw new Error("course not found")
  }

  const completions = await ctx.prisma.course
    .findUnique({
      where: { id: course?.completions_handled_by_id ?? course?.id },
    })
    .completions({
      ...convertPagination({ first, after, last, before, skip }),
    })
  return completions
}

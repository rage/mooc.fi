import { Context } from "/context"
import { convertPagination } from "/util/db-functions"

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

async function getCompletionDataFromDB(
  { course, first, after, last, before, skip }: CompletionOptionTypes,
  ctx: Context,
) {
  const completions = await ctx.prisma.course
    .findUnique({
      where: { slug: course },
    })
    .completions({
      ...convertPagination({ first, after, last, before, skip }),
    })
  return completions
}

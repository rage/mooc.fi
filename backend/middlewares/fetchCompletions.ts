import { NexusContext } from "/context"
import { convertPagination } from "/util/db-functions"

export default async function fetchCompletions(args: any, ctx: NexusContext) {
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
  ctx: NexusContext,
) {
  const courseObject = await ctx.db.course.findOne({ where: { slug: course } })

  return ctx.db.completion.findMany({
    ...convertPagination({ first, after, last, before, skip }),
    where: { course: { id: courseObject?.id } },
  })
}

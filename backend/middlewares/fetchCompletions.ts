import { Context } from "../context"

export default async function fetchCompletions(
  args: CompletionOptionTypes,
  ctx: Context,
) {
  return getCompletionDataFromDB(args, ctx)
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
  const course = await ctx.prisma.course.findUniqueOrAlias({
    where: {
      slug,
    },
  })

  if (!course) {
    throw new Error("course not found")
  }

  /*const completions = await ctx.prisma.course
    .findUnique({
      where: { id: course?.completions_handled_by_id ?? course?.id },
    })
    .completions({
      ...convertPagination({ first, after, last, before, skip }),
    })*/
  const completions = await ctx.prisma.completion.findManyWithPagination({
    where: {
      course_id: course?.completions_handled_by_id ?? course.id,
    },
    first,
    before: before ? { id: before } : undefined,
    after: after ? { id: after } : undefined,
    last,
    skip,
  })

  return completions
}

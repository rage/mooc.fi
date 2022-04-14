import { chunk } from "lodash"
import * as yup from "yup"

import { getOrganization } from "../util/server-functions"
import { ApiContext } from "./"

interface RegisterCompletion {
  completion_id: string
  student_number: string
  eligible_for_ects?: boolean
  tier?: number
  registration_date?: string
}

export function registerCompletions(ctx: ApiContext) {
  return async (req: any, res: any) => {
    const { prisma } = ctx
    const organizationResult = await getOrganization(ctx)(req, res)

    if (organizationResult.isErr()) {
      return organizationResult.error
    }

    const org = organizationResult.value

    const { completions }: { completions: RegisterCompletion[] } =
      req.body ?? {}

    if (!completions) {
      return res.status(400).json({ message: "must provide completions" })
    }

    const registerCompletionSchema = yup.array().of(
      yup
        .object()
        .shape({
          completion_id: yup.string().min(32).max(36).required(),
          student_number: yup.string().required(),
        })
        .required(),
    )

    try {
      await registerCompletionSchema.validate(completions)
    } catch (error) {
      return res.status(403).json({ message: "malformed data", error })
    }

    const buildPromises = (data: RegisterCompletion[]) => {
      return data.map(async (entry) => {
        const { course_id, user_id } =
          (await prisma.completion.findUnique({
            where: { id: entry.completion_id },
            select: { course_id: true, user_id: true },
          })) ?? {}

        if (!course_id || !user_id) {
          // TODO/FIXME: we now fail silently if course/user not found
          return Promise.resolve()
        }

        return prisma.completionRegistered.create({
          data: {
            completion: {
              connect: { id: entry.completion_id },
            },
            organization: {
              connect: { id: org?.id },
            },
            course: { connect: { id: course_id } },
            real_student_number: entry.student_number,
            registration_date: entry.registration_date ?? null,
            user: { connect: { id: user_id } },
          },
        })
      })
    }

    const queue = chunk(completions, 500)
    for (const completionChunk of queue) {
      const promises = buildPromises(completionChunk)
      await Promise.all(promises)
    }

    return res.status(200).json({ message: "success" })
  }
}

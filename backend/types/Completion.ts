import { prismaObjectType } from "nexus-prisma"
import * as resolvers from "../resolvers/Completion"
import { Prisma, Course } from "../generated/prisma-client"

const Completion = prismaObjectType({
  name: "Completion",
  definition(t) {
    t.prismaFields([
      "id",
      "created_at",
      "updated_at",
      "course",
      "completion_language",
      "email",
      "student_number",
      "user_upstream_id",
      "completions_registered",
    ])

    t.field("user", {
      type: "User",
      resolve: (parent, args, ctx) => resolvers.Completion(parent, args, ctx), //TODO: tämänkin voisi ehkä kirjoittaa suoraan tähän jotta tyypit saa oikein
    }),
      t.field("completion_link", {
        type: "String",
        nullable: true,
        resolve: async (parent, args, ctx) => {
          const prisma: Prisma = ctx.prisma
          const course: Course = await prisma
            .completion({ id: parent.id })
            .course()
          const avoinLinks = await prisma.openUniversityRegistrationLinks({
            where: {
              course: course,
              language: parent.completion_language,
            },
          })
          if (avoinLinks.length < 1) return null
          return avoinLinks[0].link
        },
      })
  },
})
export default Completion

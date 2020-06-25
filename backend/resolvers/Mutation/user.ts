import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, booleanArg, arg } from "nexus/dist"
import { AuthenticationError } from "apollo-server-core"
import { invalidate } from "../../services/redis"

const updateUserName = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("updateUserName", {
    type: "User",
    args: {
      first_name: stringArg(),
      last_name: stringArg(),
    },
    resolve: (_, { first_name, last_name }, ctx) => {
      const {
        prisma,
        user: currentUser,
        request: {
          headers: { authorization },
        },
      } = ctx

      if (!currentUser) {
        throw new AuthenticationError("not logged in")
      }
      const access_token = authorization.split(" ")[1]

      invalidate("userdetails", `Bearer ${access_token}`)

      return prisma.updateUser({
        where: { id: currentUser.id },
        data: {
          first_name,
          last_name,
        },
      })
    },
  })
}

const updateResearchConsent = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("updateResearchConsent", {
    type: "User",
    args: {
      value: booleanArg({ required: true }),
    },
    resolve: (_, { value }, ctx) => {
      const {
        prisma,
        user: currentUser,
        request: {
          headers: { authorization },
        },
      } = ctx

      if (!currentUser) {
        throw new AuthenticationError("not logged in")
      }
      const access_token = authorization.split(" ")[1]

      invalidate("userdetails", `Bearer ${access_token}`)

      return prisma.updateUser({
        where: { id: currentUser.id },
        data: {
          research_consent: value,
        },
      })
    },
  })
}

const addUser = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addUser", {
    type: "User",
    args: {
      user: arg({
        type: "UserArg",
        required: true,
      }),
    },
    resolve: async (_, { user }, ctx) => {
      const { prisma } = ctx

      const exists = await prisma.$exists.user({
        upstream_id: user.upstream_id,
      })

      if (exists) {
        throw new Error("user with that upstream id already exists")
      }

      return prisma.createUser({ ...user, administrator: false })
    },
  })
}

const addUserMutations = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  updateUserName(t)
  updateResearchConsent(t)
  addUser(t)
}

export default addUserMutations

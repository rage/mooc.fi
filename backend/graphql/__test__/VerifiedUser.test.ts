import { gql } from "graphql-request"
import { getTestContext, fakeTMCCurrent } from "../../tests/__helpers"
import { adminUserDetails, normalUserDetails } from "../../tests/data"
import { seed } from "../../tests/data/seed"
import { VerifiedUser } from "@prisma/client"
import { orderBy } from "lodash"

const ctx = getTestContext()
const tmc = fakeTMCCurrent({
  "Bearer normal": [200, normalUserDetails],
  "Bearer admin": [200, adminUserDetails],
  "Bearer third": [200, { ...normalUserDetails, id: 3 }],
})

const addVerifiedUserMutation = gql`
  mutation addVerifiedUser(
    $display_name: String
    $personal_unique_code: String!
    $home_organization: String!
    $person_affiliation: String!
    $mail: String!
    $organizational_unit: String!
  ) {
    addVerifiedUser(
      verified_user: {
        display_name: $display_name
        personal_unique_code: $personal_unique_code
        home_organization: $home_organization
        person_affiliation: $person_affiliation
        mail: $mail
        organizational_unit: $organizational_unit
      }
    ) {
      id
      personal_unique_code
    }
  }
`

const deleteVerifiedUserMutation = gql`
  mutation deleteVerifiedUser($personal_unique_code: String!, $user_id: ID) {
    deleteVerifiedUser(
      personal_unique_code: $personal_unique_code
      user_id: $user_id
    ) {
      id
      personal_unique_code
    }
  }
`

const verified_user = {
  display_name: "kissa",
  personal_unique_code: "foo:personal:unique:code",
  home_organization: "organization.foo",
  person_affiliation: "foo",
  organizational_unit: "department of foo",
  mail: "kissa@organization.foo",
}

describe("VerifiedUser", () => {
  beforeEach(async () => {
    await seed(ctx.prisma)
  })

  describe("mutations", () => {
    beforeEach(async () => tmc.setup())
    afterAll(() => tmc.teardown())

    describe("addVerifiedUser", () => {
      it("errors on not logged in", async () => {
        return ctx.client
          .request(addVerifiedUserMutation, {
            ...verified_user,
          })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.errors.length).toBe(1)
          })
      })

      it("creates a verified user", async () => {
        // try {
        const res = await ctx.client.request(
          addVerifiedUserMutation,
          {
            ...verified_user,
          },
          {
            Authorization: "Bearer normal",
          },
        )
        expect(res.addVerifiedUser.id).not.toBeNull()
        expect(res.addVerifiedUser.personal_unique_code).toBe(
          "foo:personal:unique:code",
        )

        const userVerifiedUsers = await ctx.prisma.user
          .findUnique({
            where: {
              upstream_id: normalUserDetails.id,
            },
          })
          .verified_users()

        expect(userVerifiedUsers.length).toBe(1)

        Object.entries(verified_user).map(([key, value]) => {
          expect(userVerifiedUsers[0][key as keyof VerifiedUser]).toBe(value)
        })

        // } catch {
        //   done.fail()
        // }
      })

      it("errors on existing verified user", async () => {
        return ctx.client
          .request(
            addVerifiedUserMutation,
            {
              ...verified_user,
              personal_unique_code: "personal:unique:code:university.fi:admin",
              home_organization: "university.fi",
            },
            {
              Authorization: "Bearer admin",
            },
          )
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.errors.length).toBe(1)
            expect(response.errors[0].message).toContain("user already")
          })
      })
    })

    describe("deleteVerifiedUser", () => {
      describe("admin user", () => {
        it("should be able to delete other users with user_id specified, not affecting own connections", async () => {
          const ownBefore = await ctx.prisma.verifiedUser.findMany({
            where: {
              user_id: "20000000000000000000000000000103",
            },
          })

          let res

          try {
            res = await ctx.client.request(
              deleteVerifiedUserMutation,
              {
                user_id: "20000000000000000000000000000104",
                personal_unique_code:
                  "personal:unique:code:second-university.fi:third",
              },
              {
                Authorization: "Bearer admin",
              },
            )
          } catch {
            fail()
          }

          expect(res.deleteVerifiedUser.personal_unique_code).toEqual(
            "personal:unique:code:second-university.fi:third",
          )
          // should not affect own

          const notExisting = await ctx.prisma.verifiedUser.findUnique({
            where: {
              user_id_personal_unique_code: {
                user_id: "20000000000000000000000000000104",
                personal_unique_code:
                  "personal:unique:code:second-university.fi:third",
              },
            },
          })
          expect(notExisting).toBeNull()

          const ownAfter = await ctx.prisma.verifiedUser.findMany({
            where: {
              user_id: "20000000000000000000000000000103",
            },
          })

          expect(orderBy(ownBefore, "id")).toEqual(orderBy(ownAfter, "id"))
        })
      })

      describe("normal user", () => {
        it("should error if user_id specified", async () => {
          return ctx.client
            .request(
              deleteVerifiedUserMutation,
              {
                user_id: "20000000000000000000000000000103",
                personal_unique_code:
                  "personal:unique:code:university.fi:admin",
              },
              {
                Authorization: "Bearer normal",
              },
            )
            .then(() => fail())
            .catch(({ response }) => {
              expect(response.errors.length).toBe(1)
              expect(response.errors[0].message).toContain("must be admin")
            })
        })

        it("should delete own verified_user, not affecting other own connections", async () => {
          const before = await ctx.prisma.verifiedUser.findMany({
            where: {
              user_id: "20000000000000000000000000000104",
            },
          })
          expect(before.length).toBe(2)

          const res = await ctx.client.request(
            deleteVerifiedUserMutation,
            {
              personal_unique_code: "personal:unique:code:university.fi:third",
            },
            {
              Authorization: "Bearer third",
            },
          )
          expect(res.deleteVerifiedUser.personal_unique_code).toEqual(
            "personal:unique:code:university.fi:third",
          )

          const after = await ctx.prisma.verifiedUser.findMany({
            where: {
              user_id: "20000000000000000000000000000104",
            },
          })
          expect(after.length).toBe(1)
          expect(after[0].personal_unique_code).not.toEqual(
            "personal:unique:code:university.fi:third",
          )
        })
      })
    })
  })
})

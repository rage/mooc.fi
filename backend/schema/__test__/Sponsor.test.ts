import { gql } from "graphql-request"

import {
  FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  setupTMCWithDefaultFakeUsers,
} from "../../tests"
import { seed } from "../../tests/data/seed"

jest.mock("../../services/kafkaProducer")

const ctx = getTestContext()

const createSponsorMutation = gql`
  mutation CreateSponsor($data: SponsorCreateInput!) {
    createSponsor(data: $data) {
      id
    }
  }
`

const updateSponsorMutation = gql`
  mutation UpdateSponsor($id: String!, $data: SponsorUpsertInput!) {
    updateSponsor(id: $id, data: $data) {
      id
      name
    }
  }
`

const createSponsorImageMutation = gql`
  mutation CreateSponsorImage($data: SponsorImageUpsertInput!) {
    createSponsorImage(data: $data) {
      sponsor_id
      type
    }
  }
`

const newSponsor = { id: "new-sponsor", name: "new sponsor" }
const updatedSponsor = { id: "sponsor1", name: "renamed" }
const newImage = {
  sponsor_id: "sponsor1",
  type: "new-type",
  width: 1,
  height: 1,
  uri: "https://example.com/image.png",
}

describe("Sponsor mutation authorization", () => {
  setupTMCWithDefaultFakeUsers()

  beforeEach(async () => {
    await seed(ctx.prisma)
  })

  describe.each([
    ["anonymous callers", {}],
    ["normal users", FAKE_NORMAL_USER_AUTHORIZATION_HEADERS],
  ])("refuses %s", (_, headers) => {
    it("createSponsor", async () => {
      await expect(
        ctx.client.request(
          createSponsorMutation,
          { data: newSponsor },
          headers,
        ),
      ).rejects.toThrow(/Not authorized/)
      expect(
        await ctx.prisma.sponsor.findUnique({ where: { id: newSponsor.id } }),
      ).toBeNull()
    })

    it("updateSponsor", async () => {
      await expect(
        ctx.client.request(
          updateSponsorMutation,
          { id: updatedSponsor.id, data: updatedSponsor },
          headers,
        ),
      ).rejects.toThrow(/Not authorized/)
    })

    it("createSponsorImage", async () => {
      await expect(
        ctx.client.request(
          createSponsorImageMutation,
          { data: newImage },
          headers,
        ),
      ).rejects.toThrow(/Not authorized/)
    })
  })

  describe("admins", () => {
    it("can createSponsor", async () => {
      const res = await ctx.client.request<any>(
        createSponsorMutation,
        { data: newSponsor },
        FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
      )

      expect(res.createSponsor.id).toBe(newSponsor.id)
    })

    it("can updateSponsor", async () => {
      const res = await ctx.client.request<any>(
        updateSponsorMutation,
        { id: updatedSponsor.id, data: updatedSponsor },
        FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
      )

      expect(res.updateSponsor.name).toBe("renamed")
    })

    it("can createSponsorImage", async () => {
      const res = await ctx.client.request<any>(
        createSponsorImageMutation,
        { data: newImage },
        FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
      )

      expect(res.createSponsorImage).toMatchObject({
        sponsor_id: "sponsor1",
        type: "new-type",
      })
    })
  })
})

import { getTestContext } from "../../tests/__helpers"
import { seed } from "../../tests/data/seed"
import nock from "nock"
import { syncTMCUsers, Change } from "../syncTMCUsers"
import { TMCError } from "../lib/errors"

const ctx = getTestContext()

const TMC_HOST = process.env.TMC_HOST || "https://fake.tmc.fi"
const fakeGetAccessToken = (reply: [number, string]) =>
  nock(TMC_HOST)
    .post("/oauth/token")
    .reply(() => [reply[0], { access_token: reply[1] }])

const fakeUserDetailReply = (reply: [number, object]) =>
  nock(TMC_HOST)
    .get("/api/v8/users/recently_changed_user_details")
    .reply(reply[0], () => reply[1])

const changes: Array<Change> = [
  {
    id: 1,
    change_type: "email_changed",
    old_value: "a@b.c",
    new_value: "b@b.c",
    created_at: "whatever",
    updated_at: "whenever",
    username: null,
    email: null,
  },
  {
    id: 2,
    change_type: "deleted",
    old_value: "f",
    new_value: "t",
    created_at: "whatever",
    updated_at: "whenever",
    username: "existing_user",
    email: "e@mail.com",
  },
  {
    id: 3,
    change_type: "deleted",
    old_value: "f",
    new_value: "t",
    created_at: "whatever",
    updated_at: "whenever",
    username: "already_deleted_user",
    email: "e@mail.com",
  },
]

describe("syncTMCUsers", () => {
  beforeEach(async () => {
    await seed(ctx.prisma)
    fakeGetAccessToken([200, "admin"])
  })

  afterEach(async () => {
    nock.cleanAll()
  })

  it("deletes user", async () => {
    fakeUserDetailReply([200, { changes }])
    await syncTMCUsers(ctx.prisma)

    const res = await ctx.prisma.user.findMany({
      where: {
        username: "existing_user",
      },
    })

    expect(res.length).toBe(0)
  })

  it("throws error on error", async () => {
    fakeUserDetailReply([403, { error: "asdf" }])

    expect(syncTMCUsers(ctx.prisma)).rejects.toThrowError(TMCError)
  })
})

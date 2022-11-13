import nock from "nock"

import { TMCError } from "../../lib/errors"
import {
  fakeGetAccessToken,
  fakeUserDetailReply,
  getTestContext,
} from "../../tests/__helpers"
import { seed } from "../../tests/data/seed"
import {
  Change,
  deleteUsers,
  syncTMCUsers,
  updateEmails,
} from "../syncTMCUsers"

const ctx = getTestContext()

const changes: Array<Change> = [
  {
    // should not commit this change
    id: 1,
    change_type: "email_changed",
    old_value: "f@mail.com",
    new_value: "new@mail.com",
    created_at: "2018-11-08T20:13:58.443+02:00",
    updated_at: "2020-11-08T20:13:58.443+02:00",
    username: "second_user_admin",
    email: null,
  },
  {
    // should commit this change
    id: 2,
    change_type: "email_changed",
    old_value: "new@mail.com",
    new_value: "newer@mail.com",
    created_at: "2018-11-08T20:13:58.443+02:00",
    updated_at: "2020-11-09T20:13:58.443+02:00",
    username: "second_user_admin",
    email: null,
  },
  {
    // should not update
    id: 3,
    change_type: "email_changed",
    old_value: "asdf@mail.com",
    new_value: "g@mail.com",
    created_at: "2018-11-08T20:13:58.443+02:00",
    updated_at: "2020-11-09T20:13:58.443+02:00",
    username: "third_user",
    email: null,
  },
  {
    id: 4,
    change_type: "email_changed",
    old_value: "foo@foo.foo",
    new_value: "bar@bar.bar",
    created_at: "2018-11-08T20:13:58.443+02:00",
    updated_at: "2020-11-09T20:13:58.443+02:00",
    username: "non_existing_user",
    email: null,
  },
  {
    // shouldn't happen in full test as it's deleted before email update
    id: 5,
    change_type: "email_changed",
    old_value: "g@mail.com",
    new_value: "whatever@mail.com",
    created_at: "2018-11-08T20:13:58.443+02:00",
    updated_at: "2020-11-09T20:13:58.443+02:00",
    username: "existing_user",
    email: null,
  },
  {
    id: 6,
    change_type: "deleted",
    old_value: "f",
    new_value: "t",
    created_at: "whatever",
    updated_at: "whenever",
    username: "existing_user",
    email: "f@mail.com",
  },
  {
    id: 7,
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

  describe("user deletion", () => {
    it("deletes users", async () => {
      const count = await deleteUsers(changes, ctx)

      expect(count).toBe(1)

      const res = await ctx.prisma.user.findMany({
        where: {
          username: "existing_user",
        },
      })

      expect(res.length).toBe(0)
    })
  })
  describe("email update", () => {
    it("updates emails", async () => {
      const prismaUpdateSpy = jest.spyOn(ctx.prisma.user, "update")

      const count = await updateEmails(changes, ctx)

      expect(count).toBe(2)

      const secondUser = await ctx.prisma.user.findFirst({
        where: {
          username: "second_user_admin",
        },
      })
      const thirdUser = await ctx.prisma.user.findFirst({
        where: {
          username: "third_user",
        },
      })

      expect(secondUser?.email).toEqual("newer@mail.com")
      expect(thirdUser?.updated_at?.toISOString()).toEqual(
        "1900-01-01T08:00:00.000Z",
      )
      expect(prismaUpdateSpy).toHaveBeenCalledTimes(2)
      prismaUpdateSpy.mockClear()
    })
  })

  it("full test", async () => {
    fakeUserDetailReply([200, { changes }])

    const { deletedUsers, updatedUsers } = await syncTMCUsers(ctx)

    expect(deletedUsers).toBe(1)
    expect(updatedUsers).toBe(1)
  })

  it("throws error on error", async () => {
    fakeUserDetailReply([403, { error: "asdf" }])

    expect(syncTMCUsers(ctx)).rejects.toThrowError(TMCError)
  })
})

import nock from "nock"

type FakeTMCRecord = Record<string, [number, object]>

export function fakeTMCCurrent(
  users: FakeTMCRecord,
  url = "/api/v8/users/current?show_user_fields=1&extra_fields=1",
) {
  return {
    setup() {
      nock(process.env.TMC_HOST || "")
        .persist()
        .get(url)
        .reply(function () {
          const auth = this.req.headers.authorization

          return users[auth]
        })
    },
    teardown() {
      nock.cleanAll()
    },
  }
}

export function fakeTMCSpecific(users: Record<number, [number, object]>) {
  return {
    setup() {
      for (const [user_id, reply] of Object.entries(users)) {
        nock(process.env.TMC_HOST || "")
          .persist()
          .get(`/api/v8/users/${user_id}?show_user_fields=1&extra_fields=1`)
          .reply(function () {
            return reply
          })
      }
    },
    teardown() {
      nock.cleanAll()
    },
  }
}

export const fakeGetAccessToken = (reply: [number, string]) =>
  nock(process.env.TMC_HOST || "")
    .post("/oauth/token")
    .reply(() => [reply[0], { access_token: reply[1] }])

export const fakeUserDetailReply = (reply: [number, object]) =>
  nock(process.env.TMC_HOST || "")
    .get("/api/v8/users/recently_changed_user_details")
    .reply(reply[0], () => reply[1])

export const fakeTMCUserCreate = (reply: [number, object]) =>
  nock(process.env.TMC_HOST || "")
    .post("/api/v8/users")
    .reply(() => [reply[0], reply[1]])

export const fakeTMCUserEmailNotFound = (reply: [number, object]) =>
  nock(process.env.TMC_HOST || "")
    .post(
      "/oauth/token",
      JSON.stringify({
        username: "incorrect-email@user.com",
        password: "password",
        grant_type: "password",
        client_id:
          "59a09eef080463f90f8c2f29fbf63014167d13580e1de3562e57b9e6e4515182",
        client_secret:
          "2ddf92a15a31f87c1aabb712b7cfd1b88f3465465ec475811ccce6febb1bad28",
      }),
    )
    .reply(() => [reply[0], reply[1]])

export const fakeTMCUserWrongPassword = (reply: [number, object]) =>
  nock(process.env.TMC_HOST || "")
    .post(
      "/oauth/token",
      JSON.stringify({
        username: "e@mail.com",
        password: "incorrect-password",
        grant_type: "password",
        client_id:
          "59a09eef080463f90f8c2f29fbf63014167d13580e1de3562e57b9e6e4515182",
        client_secret:
          "2ddf92a15a31f87c1aabb712b7cfd1b88f3465465ec475811ccce6febb1bad28",
      }),
    )
    .reply(() => [reply[0], reply[1]])

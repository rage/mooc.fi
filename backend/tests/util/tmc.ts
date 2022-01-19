import nock from "nock"

import { TMC_CLIENT_ID, TMC_CLIENT_SECRET, TMC_HOST } from "../../config"

type FakeTMCRecord = Record<string, [number, object]>

export function fakeTMCCurrent(
  users: FakeTMCRecord,
  url = "/api/v8/users/current?show_user_fields=1&extra_fields=1",
) {
  return {
    setup() {
      nock(TMC_HOST || "")
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
        nock(TMC_HOST || "")
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
  nock(TMC_HOST || "")
    .post("/oauth/token")
    .reply(() => [reply[0], { access_token: reply[1] }])

export const fakeUserDetailReply = (reply: [number, object]) =>
  nock(TMC_HOST || "")
    .get("/api/v8/users/recently_changed_user_details")
    .reply(reply[0], () => reply[1])

export const fakeTMCUserCreate = (reply: [number, object]) =>
  nock(TMC_HOST || "")
    .post("/api/v8/users")
    .reply(() => [reply[0], reply[1]])

export const fakeTMCUserEmailNotFound = (reply: [number, object]) =>
  nock(TMC_HOST || "")
    .post(
      "/oauth/token",
      JSON.stringify({
        username: "incorrect-email@user.com",
        password: "password",
        grant_type: "password",
        client_id: TMC_CLIENT_ID,
        client_secret: TMC_CLIENT_SECRET,
      }),
    )
    .reply(() => [reply[0], reply[1]])

export const fakeTMCUserWrongPassword = (reply: [number, object]) =>
  nock(TMC_HOST || "")
    .post(
      "/oauth/token",
      JSON.stringify({
        username: "e@mail.com",
        password: "incorrect-password",
        grant_type: "password",
        client_id: TMC_CLIENT_ID,
        client_secret: TMC_CLIENT_SECRET,
      }),
    )
    .reply(() => [reply[0], reply[1]])

import nock from "nock"

import { TMC_HOST } from "../../config"

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

          if (!Array.isArray(users[auth])) {
            throw new Error(`Invalid fakeTMCCurrent entry for auth ${auth}`)
          }
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
            if (!Array.isArray(reply)) {
              throw new Error(`Invalid fakeTMCSpecific entry ${reply}`)
            }
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

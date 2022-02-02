import nock from "nock"

import { TMC_CLIENT_ID, TMC_CLIENT_SECRET, TMC_HOST } from "../../config"

type ReplyTuple<T = object> = [number, T]
type FakeTMCRecord = Record<string, object>

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

export function fakeTMCSpecific(users: Record<number, ReplyTuple>) {
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

export const fakeGetAccessToken = (reply: ReplyTuple<string>) =>
  nock(TMC_HOST || "")
    .post("/oauth/token")
    .reply(() => [reply[0], { access_token: reply[1] }])

export const fakeUserDetailReply = (reply: ReplyTuple) =>
  nock(TMC_HOST || "")
    .get("/api/v8/users/recently_changed_user_details")
    .reply(reply[0], () => reply[1])

export const fakeTMCUserCreate = (reply: ReplyTuple) =>
  nock(TMC_HOST || "")
    .post("/api/v8/users")
    .reply(() => [reply[0], reply[1]])

export const fakeTMCUserEmailNotFound = (reply: ReplyTuple) =>
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

export const fakeTMCUserWrongPassword = (reply: ReplyTuple) =>
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

type ReplyTupleMaybeArray = ReplyTuple | ReplyTuple[]

const isReplyTupleArray = (
  reply: ReplyTupleMaybeArray,
): reply is ReplyTuple[] => Array.isArray(reply[0])

export const fakeTMCBasicInfoByEmails = (reply: ReplyTupleMaybeArray) => {
  let call = 0
  const times = isReplyTupleArray(reply) ? reply[0].length : 1

  nock(TMC_HOST || "")
    .post("/api/v8/users/basic_info_by_emails")
    .times(times)
    .reply(() => {
      if (isReplyTupleArray(reply)) {
        const _reply = reply[call++]
        return [_reply[0], _reply[1]]
      }
      return [reply[0], reply[1]]
    })
}

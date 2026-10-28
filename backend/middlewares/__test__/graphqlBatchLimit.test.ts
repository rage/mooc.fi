import axios from "axios"

import { getTestContext } from "../../tests"
import { MAX_BATCHED_OPERATIONS } from "../graphqlBatchLimit"

const ctx = getTestContext()

const postBatch = (size: number) =>
  axios.post(
    `http://localhost:${ctx.port}/`,
    Array.from({ length: size }, () => ({ query: "{ __typename }" })),
    {
      headers: { "Apollo-Require-Preflight": "true" },
      validateStatus: () => true,
    },
  )

describe("limitGraphqlBatchSize", () => {
  it("serves a batch at the limit", async () => {
    const res = await postBatch(MAX_BATCHED_OPERATIONS)

    expect(res.status).toBe(200)
    expect(res.data).toHaveLength(MAX_BATCHED_OPERATIONS)
  })

  it("rejects a batch over the limit", async () => {
    const res = await postBatch(MAX_BATCHED_OPERATIONS + 1)

    expect(res.status).toBe(400)
  })
})

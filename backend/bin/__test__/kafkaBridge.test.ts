import { getKafkaContext } from "../../tests/__helpers"
import axios from "axios"
// @ts-ignore: for mocking
import logger from "../lib/logger"
import * as Kafka from "node-rdkafka"

const ctx = getKafkaContext()

jest.mock("../lib/logger", () =>
  jest.requireActual("../../__mocks__/logger.ts"),
)

const defaultHeaders = {
  Authorization: `Bearer ${process.env.KAFKA_BRIDGE_SECRET}`,
}

const wait = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms))
const postEvent = async (data: any, headers: any = defaultHeaders) =>
  await axios.post(
    `http://0.0.0.0:${ctx.port}/kafka-bridge/api/v0/event`,
    data,
    {
      headers,
    },
  )

describe("kafkaBridge", () => {
  beforeAll(async () => {
    let tries = 0
    while (!ctx?.producer?.isConnected() && tries < 10) {
      await wait(100)
      tries++
    }
    if (!ctx.producer.isConnected()) {
      console.log("Couldn't connect to producer")
      process.exit(1)
    }
  })

  it("works", async () => {
    const produce = jest.spyOn(Kafka.Producer.prototype, "produce")
    const payload = {
      a: 1,
      b: {
        c: [1, 2, 3, 4],
        d: [
          {
            o: "kissa",
          },
          {
            o: "koira",
          },
        ],
      },
    }

    const res = await postEvent({ topic: "test", payload })

    expect(res.data).toMatchObject({
      msg: "Thanks!",
    })
    expect(produce).toBeCalledWith(
      "test",
      null,
      Buffer.from(JSON.stringify(payload)),
    )

    produce.mockClear()
  })

  it("errors on producer error", async () => {
    const produce = jest.spyOn(Kafka.Producer.prototype, "produce")
    produce.mockImplementation(() => {
      throw new Error("error")
    })

    return postEvent({ topic: "test", payload: 1 })
      .then(() => {
        produce.mockClear()
        fail()
      })
      .catch(({ response }) => {
        expect(response.status).toEqual(500)
        expect(response.data.error).toEqual("Error: error")
        produce.mockClear()
      })
  })

  it("errors on no auth", async () => {
    return postEvent({ topic: "test", payload: 1 }, {})
      .then(() => fail())
      .catch(({ response }) => expect(response.status).toEqual(403))
  })

  it("errors on wrong auth", async () => {
    return postEvent(
      { topic: "test", payload: 1 },
      { Authorization: "Bearer foo" },
    )
      .then(() => fail())
      .catch(({ response }) => expect(response.status).toEqual(403))
  })

  it("errors on missing topic", async () => {
    return postEvent({ payload: 1 })
      .then(() => fail())
      .catch(({ response }) => expect(response.status).toEqual(400))
  })

  it("errors on missing payload", async () => {
    return postEvent({
      topic: "test",
    })
      .then(() => fail())
      .catch(({ response }) => expect(response.status).toEqual(400))
  })
})

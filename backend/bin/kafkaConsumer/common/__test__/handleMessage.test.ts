import { Message as KafkaMessage } from "node-rdkafka"
import * as yup from "yup"

import { Mutex } from "../../../../lib/await-semaphore"
import config from "../../kafkaConfig"
import { handleMessage } from "../handleMessage"
import { KafkaContext } from "../kafkaContext"

describe("handleMessage", () => {
  it("releases the mutex when commit throws", async () => {
    const mutex = new Mutex()
    const context = {
      mutex,
      logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
      consumer: {
        commitMessage: () => {
          throw new Error("commit failed")
        },
      },
    } as unknown as KafkaContext
    const kafkaMessage = {
      value: Buffer.from("not json"),
      size: 8,
      topic: "test",
      offset: 0,
      partition: 999,
    } as KafkaMessage
    const run = () =>
      handleMessage({
        context,
        kafkaMessage,
        MessageYupSchema: yup.object(),
        saveToDatabase: jest.fn(),
      })

    for (let i = 0; i < config.commit_interval; i++) {
      await run()
    }
    await expect(run()).rejects.toThrow("commit failed")

    expect(mutex.count).toBe(1)
  })
})

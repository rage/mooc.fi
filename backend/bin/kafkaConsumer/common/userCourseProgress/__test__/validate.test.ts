import { Message as KafkaMessage } from "node-rdkafka"

import { handleNullProgress } from "../validate"

const kafkaMessage = (value: string) =>
  ({
    value: Buffer.from(value),
    size: value.length,
    topic: "user-course-progress-realtime",
    offset: 0,
    partition: 0,
  }) as KafkaMessage

describe("handleNullProgress", () => {
  it("passes unparseable messages through unchanged", () => {
    const message = kafkaMessage("not json")

    expect(handleNullProgress(message)).toBe(message)
  })

  it("replaces null progress with 0", () => {
    const message = kafkaMessage(
      JSON.stringify({ progress: [{ group: "a", progress: null }] }),
    )

    expect(
      JSON.parse(handleNullProgress(message).value!.toString("utf8")),
    ).toEqual({ progress: [{ group: "a", progress: 0 }] })
  })
})

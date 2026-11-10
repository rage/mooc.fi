import kafkaConfig, { isConfiguredTopic } from "../kafkaConfig"

describe("isConfiguredTopic", () => {
  it("accepts every configured consumer topic", () => {
    for (const topic of [
      kafkaConfig.exercise_consumer.topic_name,
      kafkaConfig.user_points_consumer.topic_name,
      kafkaConfig.user_course_progress_consumer.topic_name,
      kafkaConfig.user_points_realtime_consumer.topic_name,
      kafkaConfig.user_course_progress_realtime_consumer.topic_name,
      kafkaConfig.user_course_points_consumer.topic_name,
      kafkaConfig.user_course_points_realtime_consumer.topic_name,
    ]) {
      expect(isConfiguredTopic(topic)).toBe(true)
    }
  })

  it.each([
    "__consumer_offsets",
    "exercise ",
    "",
    "commit_interval",
    "topic_name",
    50,
    null,
    undefined,
    ["exercise"],
    { toString: () => "exercise" },
  ])("rejects %p", (topic) => {
    expect(isConfiguredTopic(topic)).toBe(false)
  })
})

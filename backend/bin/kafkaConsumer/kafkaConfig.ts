const kafkaConfig = {
  exercise_consumer: {
    topic_name: "exercise",
  },
  user_points_consumer: {
    topic_name: "user-points-batch",
  },
  user_course_progress_consumer: {
    topic_name: "user-course-progress-batch",
  },
  user_points_realtime_consumer: {
    topic_name: "user-points-realtime",
  },
  user_course_progress_realtime_consumer: {
    topic_name: "user-course-progress-realtime",
  },
  user_course_points_consumer: {
    topic_name: "user-course-points-batch",
  },
  user_course_points_realtime_consumer: {
    topic_name: "user-course-points-realtime",
  },
  commit_interval: 50,
}

export default kafkaConfig

const configuredTopicNames = new Set<string>(
  Object.values(kafkaConfig).flatMap((consumerConfig) =>
    typeof consumerConfig === "object" ? [consumerConfig.topic_name] : [],
  ),
)

/** Whether `topic` names one of the topics the kafka consumers read. */
export const isConfiguredTopic = (topic: unknown): topic is string =>
  typeof topic === "string" && configuredTopicNames.has(topic)

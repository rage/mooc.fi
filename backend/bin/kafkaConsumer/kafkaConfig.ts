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

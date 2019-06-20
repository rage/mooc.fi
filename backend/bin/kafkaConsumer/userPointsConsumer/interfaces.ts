export interface Message {
  timestamp: string
  exercise_id: string
  n_points: Number
  completed: boolean
  user_id: Number
  course_id: string
  service_id: string
  required_actions: string | null
  message_format_version: Number
}

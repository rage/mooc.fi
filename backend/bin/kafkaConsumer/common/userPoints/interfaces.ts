export interface Message {
  timestamp: string
  exercise_id: string
  n_points: number | null
  completed: boolean
  user_id: number
  course_id: string
  service_id: string
  attempted: boolean | null
  required_actions: string[]
  original_submission_date: string | null
  message_format_version: number
}

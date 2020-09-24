export interface Message {
  timestamp: string
  exercise_id: string
  n_points: number | null
  completed: boolean
  user_id: number
  course_id: string
  service_id: string
  required_actions: string[]
  attempted: boolean | null
  message_format_version: number
}

export interface Message {
  timestamp: string
  course_id: string
  service_id: string
  data: ExerciseData[]
  message_format_version: number
}

export interface ExerciseData {
  name: string
  id: string
  part: number | string
  section: number
  max_points: number
}

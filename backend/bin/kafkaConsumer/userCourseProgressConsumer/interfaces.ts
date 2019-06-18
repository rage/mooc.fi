export interface Message {
  timestamp: string
  user_id: number
  course_id: string
  service_id: string
  progress: [PointsByGroup]
}

export interface PointsByGroup {
  group: string
  max_points: number
  n_points: number
  progress: number
}

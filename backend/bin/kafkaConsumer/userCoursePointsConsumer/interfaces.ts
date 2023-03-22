import { Message as UserPointsMessage } from "../common/userPoints/interfaces"

export interface Message {
  timestamp: string
  user_id: number
  course_id: string
  exercises: UserPointsMessage[]
  message_format_version: number
}

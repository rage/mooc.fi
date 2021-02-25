import {} from "@material-ui/core"
import React from "react"
import { CourseStatistics_user_course_statistics_completion } from "/static/types/generated/CourseStatistics"

interface CompletionProps {
  data?: CourseStatistics_user_course_statistics_completion
}

export default function Completion({ data }: CompletionProps) {
  if (!data) {
    return <div>not completed</div>
  }

  return
}

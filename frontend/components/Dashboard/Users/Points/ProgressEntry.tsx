import { TableRow } from "@material-ui/core"
import React from "react"
import { UserPointsList_user_user_course_progresses } from "/static/types/generated/UserPointsList"

interface ProgressEntryProps {
  progress: UserPointsList_user_user_course_progresses
}

export default function ProgressEntry({ progress }: ProgressEntryProps) {
  return <TableRow>{JSON.stringify(progress)}</TableRow>
}

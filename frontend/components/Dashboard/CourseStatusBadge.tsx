import styled from "@emotion/styled"
import AlarmOff from "@mui/icons-material/AlarmOff"
import CheckCircle from "@mui/icons-material/CheckCircle"
import Error from "@mui/icons-material/Error"
import Schedule from "@mui/icons-material/Schedule"
import { Chip, ChipProps } from "@mui/material"

import { CourseStatus } from "/static/types/generated"

const StatusBadge = styled(Chip)<{ status?: CourseStatus | null }>`
  background-color: ${({ status }) =>
    status === CourseStatus.Active
      ? "#378170"
      : status === CourseStatus.Upcoming
      ? "#ffcd38"
      : status === CourseStatus.Ended
      ? "#f44336"
      : "default"};
  color: ${({ status }) =>
    status === CourseStatus.Active ? "white" : "default"};
  width: 100px;
`

export default function CourseStatusBadge({
  status,
  ...props
}: ChipProps & { status?: CourseStatus | null }) {
  return (
    <StatusBadge
      {...props}
      icon={
        status === CourseStatus.Active ? (
          <CheckCircle />
        ) : status === CourseStatus.Upcoming ? (
          <Schedule />
        ) : status === CourseStatus.Ended ? (
          <AlarmOff />
        ) : (
          <Error />
        )
      }
      status={status}
      color={status !== CourseStatus.Upcoming ? "primary" : undefined}
      size="small"
      label={status ?? "Unknown"}
    />
  )
}

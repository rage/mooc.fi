import { Chip, ChipProps } from "@material-ui/core"
import CheckCircle from "@material-ui/icons/CheckCircle"
import Schedule from "@material-ui/icons/Schedule"
import AlarmOff from "@material-ui/icons/AlarmOff"
import Error from "@material-ui/icons/Error"
import { CourseStatus } from "/static/types/generated/globalTypes"
import styled from "@emotion/styled"

const StatusBadge = styled(Chip)<{ status?: CourseStatus | null }>`
  background-color: ${({ status }) =>
    status === CourseStatus.Active
      ? "#8bc34a"
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

import React from "react"

import AlarmOff from "@mui/icons-material/AlarmOff"
import CheckCircle from "@mui/icons-material/CheckCircle"
import Error from "@mui/icons-material/Error"
import Schedule from "@mui/icons-material/Schedule"
import { Chip, ChipProps } from "@mui/material"
import { styled } from "@mui/material/styles"

import { CourseStatus } from "/graphql/generated"

const statusColor: Record<CourseStatus & string, string> = {
  [CourseStatus.Active]: "#378170",
  [CourseStatus.Upcoming]: "#ffcd38",
  [CourseStatus.Ended]: "#f44336",
}
const StatusBadge = styled(Chip)<{ status?: CourseStatus | null }>`
  background-color: ${({ status }) =>
    statusColor[status as CourseStatus] ?? "default"};
  color: ${({ status }) =>
    status === CourseStatus.Active ? "white" : "default"};
  width: 100px;
`

const courseStatusIcon: Record<CourseStatus & string, JSX.Element> = {
  [CourseStatus.Active]: <CheckCircle />,
  [CourseStatus.Upcoming]: <Schedule />,
  [CourseStatus.Ended]: <AlarmOff />,
}

function CourseStatusBadge({
  status,
  ...props
}: ChipProps & { status?: CourseStatus | null }) {
  return (
    <StatusBadge
      {...props}
      icon={courseStatusIcon[status as CourseStatus] ?? <Error />}
      status={status}
      color={status !== CourseStatus.Upcoming ? "primary" : undefined}
      size="small"
      label={status ?? "Unknown"}
    />
  )
}

export default CourseStatusBadge

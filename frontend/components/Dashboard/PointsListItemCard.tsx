import React from "react"
import { Typography, Grid } from "@material-ui/core"
import { UserCourseSettingses_UserCourseSettingses_edges_node as UserPointsData } from "../../static/types/generated/UserCourseSettingses"
import PointsItemTable from "./PointsItemTable"
import styled from "styled-components"

const Name = styled(Typography)`
  font-weight: bold;
`
const UserInformation = styled(Typography)`
  color: gray;
`

const Root = styled(Grid)`
  background-color: white;
  margin: 1rem;
  padding: 1rem;
`
interface Props {
  studentPointsPerGroup: UserPointsData
  cutterValue: number
}

function PointsListItemCard(props: Props) {
  const { studentPointsPerGroup, cutterValue } = props

  const {
    first_name: firstName = "n/a",
    last_name: lastName = "n/a",
    username = "n/a",
    email = "no email",
    student_number: studentId = "no SID",
    user_course_progressess: studentProgressData,
  } = studentPointsPerGroup!.user!

  /*   const firstName = studentPointsPerGroup!.user!.first_name || "n/a"
  const lastName = studentPointsPerGroup!.user!.last_name || "n/a"
  const username = studentPointsPerGroup!.user!.username || "n/a"

  let email: string = "no email"
  let studentId: string = "no SID"
  let studentProgressData
  if (studentPointsPerGroup.user) {
    if (studentPointsPerGroup.user.email) {
      email = studentPointsPerGroup.user.email
    }
    if (studentPointsPerGroup.user.student_number) {
      studentId = studentPointsPerGroup.user.student_number
    }
    if (studentPointsPerGroup.user.user_course_progressess) {
      studentProgressData = studentPointsPerGroup.user.user_course_progressess
    }
  } */

  return (
    <Root item xs={12} sm={12} lg={12}>
      <Name variant="body1" component="h4">
        {firstName} {lastName}
      </Name>
      <UserInformation variant="body1" component="p">
        {email}
      </UserInformation>
      <UserInformation variant="body1" component="p">
        {username}
      </UserInformation>
      <UserInformation variant="body1" component="p">
        {studentId}
      </UserInformation>

      {studentProgressData ? (
        <PointsItemTable
          studentPoints={studentProgressData}
          cutterValue={cutterValue}
        />
      ) : (
        <p>No points data available</p>
      )}
    </Root>
  )
}

export default PointsListItemCard

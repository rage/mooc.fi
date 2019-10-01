import React from "react"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"
import AccountIcon from "@material-ui/icons/AccountCircle"

const InfoBoxBackground = styled.div`
  background-color: white;
  width: 33%;
  margin-left: 33%;
  position: absolute;
  bottom: -100px;
  color: black;
  border-radius: 10px;
  @media (max-width: 425px) {
    width: 70%;
    margin-left: 15%;
    bottom: -70px;
  }
`
const Info = styled(Typography)`
  padding: 0.5em;
  font-size: 24px;
  @media (max-width: 425px) {
    font-size: 16px;
  }
`
interface PersonalInfoProps {
  email: string
  student_id: string
}

const PersonalInfoBox = (props: PersonalInfoProps) => {
  const { email, student_id } = props
  return (
    <InfoBoxBackground>
      <AccountIcon />
      <Info>{email}</Info>
      <Info>{student_id}</Info>
    </InfoBoxBackground>
  )
}

export default PersonalInfoBox

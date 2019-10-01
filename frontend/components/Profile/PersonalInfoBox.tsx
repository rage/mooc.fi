import React from "react"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"
import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon"

const InfoBoxIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    </SvgIcon>
  )
}

const StyledIcon = styled(InfoBoxIcon)`
  margin-right: 0.7rem;
  margin-top: 0.7rem;
  align-self: flex-end;
`

const InfoBoxBackground = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  color: black;
  border-radius: 10px;
  width: 45%;
  position: absolute;
  bottom: -150px;
  margin-left: 27.5%;
  @media (max-width: 768px) {
    width: 80%;
    margin-left 10%;
    bottom: -120px;
  }
  
`
const Info = styled(Typography)`
  padding: 0.5em;
  margin-left: 1rem;
  font-size: 24px;
  @media (max-width: 425px) {
    font-size: 16px;
  }
  @media (max-width: 768px) {
    font-size: 18px;
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
      <StyledIcon color="secondary" fontSize="large" />

      <Info>{email}</Info>
      <Info>{student_id}</Info>
    </InfoBoxBackground>
  )
}

export default PersonalInfoBox

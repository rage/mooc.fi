import styled from "@emotion/styled"
import Typography from "@mui/material/Typography"
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon"

const InfoBoxIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    </SvgIcon>
  )
}

const StyledIcon = styled(InfoBoxIcon)`
  position: absolute;
  top: 3px;
  right: 5px;
  font-size: 48px;
  @media (max-width: 380px) {
    display: none;
  }
  @media (max-width: 425px) {
    font-size: 38px;
  }
  @media (max-width: 900px) {
    font-size: 42px;
  }
`

const InfoBoxBackground = styled.div`
  background-color: white;
  padding: 0.7rem;
  color: black;
  border-radius: 25px;
  width: 20%;
  position: absolute;
  bottom: -75px;
  margin-left: 40%;
  @media (max-width: 2000px) {
    width: 30%;
    margin-left: 35%;
    bottom: -50px;
  }
  @media (max-width: 1449px) {
    width: 45%;
    margin-left: 27.5%;
    bottom: -50px;
  }
  @media (max-width: 768px) {
    width: 60%;
    margin-left: 20%;
    bottom: -50px;
  }
  @media (max-width: 500px) {
    width: 80%;
    margin-left: 10%;
    bottom: -50px;
  }
`
const Info = styled(Typography)<any>`
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
      <StyledIcon color="secondary" />

      <Info display="inline">{email}</Info>

      <Info>{student_id}</Info>
    </InfoBoxBackground>
  )
}

export default PersonalInfoBox

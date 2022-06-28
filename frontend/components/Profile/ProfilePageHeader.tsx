import PersonalInfoBox from "./PersonalInfoBox"
import styled from "@emotion/styled"
import Typography from "@mui/material/Typography"

const HeaderBackground = styled.div`
  background-color: #4d92a1;
  color: white;
  position: relative;
  margin-bottom: 6em;
`

const HeaderTitle = styled(Typography)<any>`
  padding: 0.5em;
  @media (min-width: 768px) {
    font-size: 64px;
  }
  @media (max-width: 768px) {
    font-size: 56px;
  }
  @media (max-width: 425px) {
    font-size: 48px;
  }
`

interface ProfilePageHeaderProps {
  first_name: string
  last_name: string
  email: string
  student_number: string
}
const ProfilePageHeader = (props: ProfilePageHeaderProps) => {
  const { first_name, last_name, email, student_number } = props
  return (
    <HeaderBackground>
      <HeaderTitle component="h1" align="center">
        {first_name} {last_name}{" "}
      </HeaderTitle>
      <PersonalInfoBox email={email} student_id={student_number} />
    </HeaderBackground>
  )
}

export default ProfilePageHeader

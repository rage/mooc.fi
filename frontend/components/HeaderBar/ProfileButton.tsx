import * as React from "react"
import styled from "styled-components"
import LangLink from "/components/LangLink"
import Button from "@material-ui/core/Button"
import { useContext } from "react"
import LanguageContext from "/contexes/LanguageContext"
import UserDetailContext from "/contexes/UserDetailContext"
import { whichIsActive } from "/components/HeaderBar/Header"

interface ButtonProps {
  active: boolean
}

const StyledButton = styled(Button)<ButtonProps>`
  margin-left: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 18px;
  border-radius: 0px;
  line-height: 90%;
  @media (max-width: 950px) {
    font-size: 22px;
  }
  @media (max-width: 450px) {
    font-size: 16px;
  }
  @media (max-width: 321px) {
    margin-left: 0.25rem;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }
  color: ${props => (props.active ? "#3C8C7A" : "black")};
  border-bottom: ${props => (props.active ? "1px solid #3C8C7A" : "")};
`

const ProfileButton = () => {
  const { currentUser } = useContext(UserDetailContext)
  const { language, url } = useContext(LanguageContext)
  const active = whichIsActive({ url: url })

  const userDisplayName = currentUser?.first_name
    ? `${currentUser.first_name} ${currentUser.last_name}`
    : "Oma profiili"

  return (
    <LangLink href="/[lng]/profile" as={`/${language}/profile`}>
      <StyledButton color="inherit" variant="text" active={active == "profile"}>
        {userDisplayName}
      </StyledButton>
    </LangLink>
  )
}

export default ProfileButton

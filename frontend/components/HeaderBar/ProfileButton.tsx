import * as React from "react"
import styled from "styled-components"
import LangLink from "/components/LangLink"
import { useContext } from "react"
import LanguageContext from "/contexes/LanguageContext"
import UserDetailContext from "/contexes/UserDetailContext"
import { whichIsActive } from "/components/HeaderBar/Header"
import { HeaderMenuButton } from "/components/Buttons/HeaderMenuButton"

interface ButtonProps {
  active: any
}

const StyledButton = styled(HeaderMenuButton)<ButtonProps>`
  border-radius: 0px;
  line-height: 90%;
  @media (max-width: 950px) {
    font-size: 22px;
  }
  color: ${(props) => (props.active ? "#3C8C7A" : "black")};
  border-bottom: ${(props) => (props.active ? "1px solid #3C8C7A" : "")};
`

const ProfileButton = () => {
  const { currentUser } = useContext(UserDetailContext)
  const { language, url } = useContext(LanguageContext)
  const active = whichIsActive({ url: url })

  console.log("an update", currentUser)

  const userDisplayName = currentUser?.first_name
    ? `${currentUser.first_name} ${currentUser.last_name}`
    : "Oma profiili"

  return (
    <LangLink href="/[lng]/profile" as={`/${language}/profile`}>
      <StyledButton
        color="inherit"
        variant="text"
        active={active == "profile" ? 1 : null}
      >
        {userDisplayName}
      </StyledButton>
    </LangLink>
  )
}

export default ProfileButton

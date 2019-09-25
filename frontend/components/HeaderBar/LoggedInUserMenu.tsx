import * as React from "react"
import { useContext } from "react"
import UserDetailContext from "/contexes/UserDetailContext"
import LanguageContext from "/contexes/LanguageContext"
import ProfileButton from "./ProfileButton"
import LangLink from "../LangLink"
import styled from "styled-components"
import Button from "@material-ui/core/Button"

const StyledButton = styled(Button)`
  margin: 1rem;
  font-size: 22px;
  &:hover {
    cursor: pointer;
    text-color: red;
  }
`

const MenuContainer = styled.div`
  flex: 1;
  @media (max-width: 950px) {
    display: none;
  }
`
const UserMenu = () => {
  const isAdmin = useContext(UserDetailContext)
  const { language } = useContext(LanguageContext)

  return (
    <MenuContainer>
      <ProfileButton />
      {isAdmin && (
        <>
          <LangLink href="/[lng]/courses" as={`/${language}/courses`}>
            <StyledButton color="inherit" variant="text">
              Courses
            </StyledButton>
          </LangLink>
          <LangLink href="/[lng]/modules" as={`/${language}/modules`}>
            <StyledButton color="inherit" variant="text">
              Modules
            </StyledButton>
          </LangLink>
          <LangLink href="/[lng]/users/search" as={`/${language}/users/search`}>
            <StyledButton color="inherit" variant="text">
              User search
            </StyledButton>
          </LangLink>
        </>
      )}
    </MenuContainer>
  )
}

export default UserMenu

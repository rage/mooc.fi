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
  @media (max-width: 510px) {
    font-size: 20px;
    margin: 0.75rem;
  }
  @media (max-width: 450px) {
    font-size: 16px;
    margin: 0.5rem;
  }
`

const UserMenu = () => {
  const isAdmin = useContext(UserDetailContext)
  const { language } = useContext(LanguageContext)

  return (
    <>
      <ProfileButton />
      {isAdmin && (
        <>
          <LangLink href="/[lng]/courses" as={`/${language}/courses`}>
            <StyledButton color="inherit" variant="text">
              Courses
            </StyledButton>
          </LangLink>
          <LangLink
            href="/[lng]/study-modules"
            as={`/${language}/study-modules`}
          >
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
    </>
  )
}

export default UserMenu

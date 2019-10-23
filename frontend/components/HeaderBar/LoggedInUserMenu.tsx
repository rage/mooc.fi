import * as React from "react"
import { useContext } from "react"
import UserDetailContext from "/contexes/UserDetailContext"
import LanguageContext from "/contexes/LanguageContext"

import LangLink from "../LangLink"
import styled from "styled-components"
import Button from "@material-ui/core/Button"

import {
  faChalkboardTeacher,
  faSearch,
  faList,
} from "@fortawesome/free-solid-svg-icons"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface ButtonProps {
  active: boolean
}
const StyledButton = styled(Button)<ButtonProps>`
  margin: 1rem;
  font-size: 22px;
  border-radius: 0px;
  @media (max-width: 510px) {
    font-size: 20px;
    margin: 0.75rem;
  }
  @media (max-width: 450px) {
    font-size: 16px;
    margin: 0.5rem;
  }
  color: ${props => (props.active ? "#00B290" : "black")};
  border-bottom: ${props => (props.active ? "1px solid #00B290" : "")};
`
interface UserMenuprops {
  active?: string
}
const UserMenu = (props: UserMenuprops) => {
  const { admin } = useContext(UserDetailContext)
  const { language } = useContext(LanguageContext)
  const { active } = props

  return (
    <>
      {admin && (
        <>
          <LangLink href="/[lng]/courses" as={`/${language}/courses`}>
            <StyledButton
              startIcon={<FontAwesomeIcon icon={faChalkboardTeacher} />}
              color="inherit"
              variant="text"
              active={active == "courses"}
            >
              Courses
            </StyledButton>
          </LangLink>

          <LangLink
            href="/[lng]/study-modules"
            as={`/${language}/study-modules`}
          >
            <StyledButton
              color="inherit"
              variant="text"
              startIcon={<FontAwesomeIcon icon={faList} />}
              active={active == "study-modules"}
            >
              Modules
            </StyledButton>
          </LangLink>
          <LangLink href="/[lng]/users/search" as={`/${language}/users/search`}>
            <StyledButton
              color="inherit"
              variant="text"
              startIcon={<FontAwesomeIcon icon={faSearch} />}
              active={active == "users"}
            >
              User search
            </StyledButton>
          </LangLink>
        </>
      )}
    </>
  )
}

export default UserMenu

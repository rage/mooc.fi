import { useContext } from "react"
import LanguageContext from "/contexes/LanguageContext"
import Typography from "@material-ui/core/Typography"
import LangLink from "../LangLink"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import CommonTranslations from "/translations/common"

import {
  faChalkboardTeacher,
  faSearch,
  faList,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import LoginStateContext from "/contexes/LoginStateContext"
import { useTranslator } from "/util/useTranslator"

interface ButtonProps {
  active: any
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
  color: ${(props) => (props.active ? "#3C8C7A" : "black")};
  border-bottom: ${(props) => (props.active ? "1px solid #3C8C7A" : "")};
`

const ButtonLabel = styled(Typography)<any>`
  font-family: Open Sans Condensed !important;
  font-size: 18px;
  @media (max-width: 600px) {
    font-size: 14px;
  }
  @media (max-width: 450px) {
    font-sise: 12px;
  }
`

interface UserMenuprops {
  active?: string
}

const UserMenu = (props: UserMenuprops) => {
  const { admin } = useContext(LoginStateContext)
  const { language } = useContext(LanguageContext)
  const t = useTranslator(CommonTranslations)

  const { active } = props

  return (
    <>
      {admin && (
        <>
          <LangLink href="/[lng]/courses" as={`/${language}/courses`}>
            <StyledButton
              color="inherit"
              variant="text"
              active={active == "courses" ? 1 : null}
              style={{ marginLeft: "1em" }}
            >
              <div>
                <FontAwesomeIcon icon={faChalkboardTeacher} />
                <ButtonLabel>{t("courses")}</ButtonLabel>
              </div>
            </StyledButton>
          </LangLink>

          <LangLink
            href="/[lng]/study-modules"
            as={`/${language}/study-modules`}
          >
            <StyledButton
              color="inherit"
              variant="text"
              active={active == "study-modules" ? 1 : null}
            >
              <div>
                <FontAwesomeIcon icon={faList} />
                <ButtonLabel>{t("modules")}</ButtonLabel>
              </div>
            </StyledButton>
          </LangLink>
          <LangLink href="/[lng]/users/search" as={`/${language}/users/search`}>
            <StyledButton
              color="inherit"
              variant="text"
              active={active == "users" ? 1 : null}
            >
              <div>
                <FontAwesomeIcon icon={faSearch} />
                <ButtonLabel>{t("userSearch")}</ButtonLabel>
              </div>
            </StyledButton>
          </LangLink>
          <LangLink
            href="/[lng]/email-templates"
            as={`/${language}/email-templates`}
          >
            <StyledButton
              color="inherit"
              variant="text"
              active={active == "email-templates" ? 1 : null}
            >
              <div>
                <FontAwesomeIcon icon={faEnvelope} />
                <ButtonLabel>{t("emailTemplates")}</ButtonLabel>
              </div>
            </StyledButton>
          </LangLink>
        </>
      )}
    </>
  )
}

export default UserMenu

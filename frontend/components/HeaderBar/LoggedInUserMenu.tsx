import { useContext } from "react"

import LoginStateContext from "/contexts/LoginStateContext"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"
import LangLink from "components/LangLink"

import styled from "@emotion/styled"
import {
  faChalkboardTeacher,
  faEnvelope,
  faList,
  faSearch,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

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
  color: ${(props) => (props.active ? "#378170" : "black")};
  border-bottom: ${(props) => (props.active ? "1px solid #378170" : "")};
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
  const t = useTranslator(CommonTranslations)

  const { active } = props

  return (
    <nav role="navigation">
      {admin && (
        <>
          <LangLink href={`/courses`}>
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

          <LangLink href={`/study-modules`}>
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
          <LangLink href={`/users/search`}>
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
          <LangLink href={`/email-templates`}>
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
    </nav>
  )
}

export default UserMenu

import {
  faChalkboardTeacher,
  faEnvelope,
  faList,
  faSearch,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useActiveTab } from "/components/HeaderBar/Header"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>`
  margin: 1rem;
  font-size: 22px;
  border-radius: 0px;
  display: inline-flex;
  flex-direction: column;
  text-align: center;
  gap: 0.5rem;

  @media (max-width: 510px) {
    font-size: 20px;
    margin: 0.75rem;
  }
  @media (max-width: 480px) {
    font-size: 16px;
    margin: 0.5rem;
  }
  @media (max-width: 450px) {
    font-size: 12px;
    margin: 0.2rem;
  }
  color: ${(props) => (props.active ? "#378170" : "black")};
  border-bottom: ${(props) => (props.active ? "1px solid #378170" : "")};
`

const ButtonLabel = styled(Typography)`
  font-family: var(--open-sans-condensed-font) !important;
  font-size: 18px;
  @media (max-width: 600px) {
    font-size: 14px;
  }
  @media (max-width: 450px) {
    font-size: 12px;
  }
`

const UserMenu = () => {
  const { admin } = useLoginStateContext()
  const t = useTranslator(CommonTranslations)

  const active = useActiveTab()

  return (
    <nav role="navigation">
      {admin && (
        <>
          <StyledButton
            href="/courses"
            color="inherit"
            variant="text"
            active={active === "courses"}
            style={{ marginLeft: "1em" }}
          >
            <FontAwesomeIcon icon={faChalkboardTeacher} />
            <ButtonLabel>{t("courses")}</ButtonLabel>
          </StyledButton>

          <StyledButton
            href="study-modules"
            color="inherit"
            variant="text"
            active={active === "study-modules"}
          >
            <FontAwesomeIcon icon={faList} />
            <ButtonLabel>{t("modules")}</ButtonLabel>
          </StyledButton>
          <StyledButton
            href="/users/search"
            color="inherit"
            variant="text"
            active={active === "users"}
          >
            <FontAwesomeIcon icon={faSearch} />
            <ButtonLabel>{t("userSearch")}</ButtonLabel>
          </StyledButton>
          <StyledButton
            href="/email-templates"
            color="inherit"
            variant="text"
            active={active === "email-templates"}
          >
            <FontAwesomeIcon icon={faEnvelope} />
            <ButtonLabel>{t("emailTemplates")}</ButtonLabel>
          </StyledButton>
        </>
      )}
    </nav>
  )
}

export default UserMenu

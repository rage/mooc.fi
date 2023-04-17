import ChalkboardTeacherIcon from "@fortawesome/fontawesome-free/svgs/solid/chalkboard-user.svg?icon"
import EnvelopeIcon from "@fortawesome/fontawesome-free/svgs/solid/envelope.svg?icon"
import ListIcon from "@fortawesome/fontawesome-free/svgs/solid/list.svg?icon"
import SearchIcon from "@fortawesome/fontawesome-free/svgs/solid/magnifying-glass.svg?icon"
import { Button, EnhancedButton, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useActiveTab } from "/components/HeaderBar/Header"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

interface StyledButtonProps {
  active?: boolean
}

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})<StyledButtonProps>`
  margin: 0.5rem 1rem;
  font-size: 20px;
  border-radius: 0px;
  display: inline-flex;
  flex-direction: column;
  text-align: center;
  gap: 0.5rem;

  @media (max-width: 510px) {
    font-size: 18px;
    margin: 0.75rem;
  }
  @media (max-width: 480px) {
    font-size: 14px;
    margin: 0.5rem;
  }
  @media (max-width: 450px) {
    font-size: 10px;
    margin: 0.2rem;
  }
  color: ${(props) => (props.active ? "#378170" : "black")};
  border-bottom: ${(props) => (props.active ? "1px solid #378170" : "")};
` as EnhancedButton<"button", StyledButtonProps>

const ButtonLabel = styled(Typography)`
  font-family: var(--header-font) !important;
  font-weight: 200;
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
    <>
      {admin && (
        <>
          <StyledButton
            href="/courses"
            color="inherit"
            variant="text"
            active={active === "courses"}
            style={{ marginLeft: "1em" }}
          >
            <ChalkboardTeacherIcon />
            <ButtonLabel>{t("courses")}</ButtonLabel>
          </StyledButton>

          <StyledButton
            href="/study-modules"
            color="inherit"
            variant="text"
            active={active === "study-modules"}
          >
            <ListIcon />
            <ButtonLabel>{t("modules")}</ButtonLabel>
          </StyledButton>
          <StyledButton
            href="/users/search"
            color="inherit"
            variant="text"
            prefetch={false}
            active={active === "users"}
          >
            <SearchIcon />
            <ButtonLabel>{t("userSearch")}</ButtonLabel>
          </StyledButton>
          <StyledButton
            href="/email-templates"
            color="inherit"
            variant="text"
            active={active === "email-templates"}
          >
            <EnvelopeIcon />
            <ButtonLabel>{t("emailTemplates")}</ButtonLabel>
          </StyledButton>
        </>
      )}
    </>
  )
}

export default UserMenu

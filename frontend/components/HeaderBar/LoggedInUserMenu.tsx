import Link from "next/link"

import ChalkboardTeacher from "@fortawesome/fontawesome-free/svgs/solid/chalkboard-user.svg?icon"
import Envelope from "@fortawesome/fontawesome-free/svgs/solid/envelope.svg?icon"
import List from "@fortawesome/fontawesome-free/svgs/solid/list.svg?icon"
import Search from "@fortawesome/fontawesome-free/svgs/solid/magnifying-glass.svg?icon"
import Button from "@mui/material/Button"
import { css, styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"

import { useActiveTab } from "/components/HeaderBar/Header"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

const iconBaseStyle = css`
  height: 1.25rem;
`
interface ButtonProps {
  active: any
}

const StyledButton = styled(Button)<ButtonProps>`
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
  font-family: Open Sans Condensed !important;
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
          <Link href={`/courses`} passHref>
            <StyledButton
              color="inherit"
              variant="text"
              active={active == "courses" ? 1 : null}
              style={{ marginLeft: "1em" }}
            >
              <ChalkboardTeacher css={iconBaseStyle} />
              <ButtonLabel>{t("courses")}</ButtonLabel>
            </StyledButton>
          </Link>

          <Link href={`/study-modules`} passHref>
            <StyledButton
              color="inherit"
              variant="text"
              active={active == "study-modules" ? 1 : null}
            >
              <List css={iconBaseStyle} />
              <ButtonLabel>{t("modules")}</ButtonLabel>
            </StyledButton>
          </Link>
          <Link href={`/users/search`} passHref>
            <StyledButton
              color="inherit"
              variant="text"
              active={active == "users" ? 1 : null}
            >
              <Search css={iconBaseStyle} />
              <ButtonLabel>{t("userSearch")}</ButtonLabel>
            </StyledButton>
          </Link>
          <Link href={`/email-templates`} passHref>
            <StyledButton
              color="inherit"
              variant="text"
              active={active == "email-templates" ? 1 : null}
            >
              <Envelope css={iconBaseStyle} />
              <ButtonLabel>{t("emailTemplates")}</ButtonLabel>
            </StyledButton>
          </Link>
        </>
      )}
    </nav>
  )
}

export default UserMenu

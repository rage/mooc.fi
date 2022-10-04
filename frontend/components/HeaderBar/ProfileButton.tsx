import Link from "next/link"

import styled from "@emotion/styled"

import { HeaderMenuButton } from "/components/Buttons/HeaderMenuButton"
import { useActiveTab } from "/components/HeaderBar/Header"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

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
  const t = useTranslator(CommonTranslations)
  const { currentUser } = useLoginStateContext()
  const active = useActiveTab()

  const userDisplayName = currentUser?.first_name
    ? `${currentUser.first_name} ${currentUser.last_name}`
    : t("myProfile")

  return (
    <Link href={`/profile`} passHref>
      <StyledButton
        color="inherit"
        variant="text"
        active={active == "profile" ? 1 : null}
      >
        {userDisplayName}
      </StyledButton>
    </Link>
  )
}

export default ProfileButton

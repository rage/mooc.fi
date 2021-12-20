import React from "react"

import HYLogo from "/components/HYLogo"
import Link from "next/link"

import styled from "@emotion/styled"
import { Button, Typography } from "@mui/material"

type Variant = "hy" | "haka"

interface VariantProps {
  $variant: Variant
}

const LoginButtonWrapper = styled.div`
  // min-width: 250px;
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  border: 1px #b9b9b9 solid;
  background-color: white;
`

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 50%;
  padding: 0.5rem;
`

const LogoWrapper = styled(ContentWrapper)``

const TextWrapper = styled(ContentWrapper)`
  padding-right: 0.75rem;
  padding-left: 0.25rem;
`

const LogoText = styled(Typography)`
  display: flex;
  justify-content: center;
  border: 1px solid black;
  width: 100%;
  // margin-right: 0.75rem;
  // margin-left: 1.25rem;
  color: black;
`

const HYLoginButton = ({ text = "Login" }: { text?: string }) => (
  <LoginButtonWrapper>
    <LogoWrapper>
      <HYLogo style={{ width: "50%", minWidth: "50px" }} />
    </LogoWrapper>
    <TextWrapper>
      <LogoText>{text}</LogoText>
    </TextWrapper>
  </LoginButtonWrapper>
)

const HakaLoginButton = ({ text = "login" }: { text?: string }) => (
  <OrganizationImage
    src="/static/images/Haka_login_vaaka.svg"
    alt={`[Haka ${text}]`}
    style={{ width: "100%", height: "100%" }}
  />
)

const OrganizationImage = styled.img`
  width: 100%;
  height: 100%;
`

const Row = styled.div`
  display: inline-flex;
  width: 100%;
  align-items: center;
  column-gap: 2rem;
  flex-wrap: wrap;
`

const ButtonText = styled(Typography)`
  a::after {
    content: " ➚";
  }
  @media (max-width: 840px) {
    margin-top: 0.5rem;
    width: 100%;
  }
`
const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "$variant",
})<VariantProps>`
  background-color: white;
  max-width: 250px;
  padding: 0;
  margin: 0;
  min-width: 150px;
  ${({ $variant }) => ($variant === "haka" ? "max-height: 73px" : "")};
`

interface OrganizationButtonProps {
  variant: Variant
  href: string
  caption?: string
}

function OrganizationButton({
  variant,
  href,
  caption,
}: OrganizationButtonProps) {
  return (
    <Row>
      <Link href={href}>
        <StyledButton $variant={variant}>
          {variant === "hy" ? <HYLoginButton /> : <HakaLoginButton />}
        </StyledButton>
      </Link>
      {caption ? (
        <ButtonText
          variant="body1"
          dangerouslySetInnerHTML={{ __html: caption }}
        />
      ) : null}
    </Row>
  )
}

export default OrganizationButton

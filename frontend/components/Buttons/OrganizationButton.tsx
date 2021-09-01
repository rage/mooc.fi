import React from "react"

import Link from "next/link"

import styled from "@emotion/styled"
import { Button, Typography } from "@material-ui/core"

type Variant = "hy" | "haka"

interface VariantProps {
  $variant: Variant
}

// from https://version.helsinki.fi/julkiset-sivut/design-system-lib/-/blob/development/src/components/icon/HyLogo.tsx
const HYLogo = (props: any) => (
  <svg viewBox="0 0 1000 1000" {...props}>
    <path d="M452 0h96v97h-96V0zm0 903h96v97h-96v-97zm380-358q-32-20-38-74-25 3-44-3-28-10-40-42-6-13-12-47t-13-52q-12-32-33-56-33-35-74-50-37-14-78-11 30 19 37 46 6 23-7 41t-36 19-42-12q-8-5-35-27-22-18-40-26-26-12-58-12-25 0-51 13 24 3 40 16 13 12 24 32 3 7 16 39 10 23 27 36t44 22q-13 6-38 6-29 0-55-15-20-11-45-36t-43-36q-28-16-61-16-16 0-29 4t-19 9q23 3 42 14 23 15 23 34 0 11-7 17t-19 5-23-12q-18-20-43-33t-54-12q-13 0-26 3T0 339q34 5 58 28t45 72q15 35 33 51 24 23 64 23 5 0 29-3 20-2 31 0 17 2 27 13 9 8 12 21 2 6 5 23 2 15 6 23 10 21 28 31 21 11 56 11-19 19-54 21-32 2-65-9t-49-28q2 46 25 80 25 37 68 50 49 14 113-4 18-5 30-1t19 24q16 41 71 35 48-5 79 6t59 42q8-81-77-135-15-9-23-19-6-8-9-19l-4-17q16 18 38 28 17 8 43 14 82 10 110 52 2-23-6-42-6-15-19-29-10-10-26-22-19-15-23-18-11-10-13-18 19 12 36 17t38 5q7-1 27-6t31-4q16 0 28 7 15 9 27 29 29-18 68-15 35 3 64 21-12-30-34-52-17-18-44-33-12-7-47-23-28-14-43-24zm-284 36h-96v-97h96v97z" />
  </svg>
)

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

const StyledButton = styled(Button)<VariantProps>`
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
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: caption }}
        />
      ) : null}
    </Row>
  )
}

export default OrganizationButton
import Link from "next/link"
import styled from "@emotion/styled"
import React from "react"
import { Button } from "@material-ui/core"

const OrganizationImage = styled.img`
  max-width: 248px;
  width: 100%;
  height: 100%;
`

type Variant = "hy" | "haka"

interface StyledButtonProps {
  $variant: Variant
}

const StyledButton = styled(Button)<StyledButtonProps>`
  background-color: transparent;
  max-width: 250px;
  padding: 0;
  box-shadow: none;
  ${({ $variant }) => ($variant === "hy" ? "border: 1px #b9b9b9 solid;" : "")}
  border-radius: 0;
  margin: 0;
`
interface OrganizationButtonProps {
  variant: Variant
  href: string
}

function OrganizationButton({ variant, href }: OrganizationButtonProps) {
  return (
    <StyledButton $variant={variant}>
      <Link href={href}>
        <picture>
          {variant === "hy" ? (
            <OrganizationImage src="/static/images/HY_logo_kolmikielinen_vaaka.png" />
          ) : (
            <OrganizationImage
              src="/static/images/Haka_login_vaaka.svg"
              alt="[Haka login]"
            />
          )}
        </picture>
      </Link>
    </StyledButton>
  )
}

export default OrganizationButton

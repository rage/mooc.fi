import Link from "next/link"
import styled from "@emotion/styled"
import React from "react"
import { Button, Typography } from "@material-ui/core"
import capitalizeFirstLetter from "/util/capitalizeFirstLetter"
import { ClickableDiv } from "/components/Surfaces/ClickableCard"

type Variant = "hy" | "haka"

interface VariantProps {
  $variant: Variant
}

const ORGANIZATION_IMAGE: Record<Variant[number], string> = {
  "hy": "/static/images/HY_logo_kolmikielinen_vaaka.png",
  "haka": "/static/images/Haka_login_vaaka.svg"
}

const OrganizationImage = styled.img`
  width: 100%;
  height: 100%;
`

const Row = styled.div`
  display: inline-flex;
  width: 100%;
  align-items: center;
  column-gap: 2rem;
`

const StyledButton = styled(ClickableDiv)<VariantProps>`
  background-color: transparent;
  max-width: 247px;
  ${({ $variant }) => ($variant === "haka" ? "max-height: 73px" : "")};
  padding: 0;
  ${({ $variant }) => ($variant === "hy" ? "border: 1px #b9b9b9 solid;" : "")}
  margin: 0;
`
interface OrganizationButtonProps {
  variant: Variant
  href: string
  caption?: string
}

function OrganizationButton({ variant, href, caption }: OrganizationButtonProps) {
  return (
    <Row>
      <StyledButton $variant={variant}>
        <Link href={href}>
          <picture>
            <OrganizationImage 
              src={ORGANIZATION_IMAGE[variant]} 
              alt={`[${capitalizeFirstLetter(variant)} login]`} 
            />
          </picture>
        </Link>
      </StyledButton>
      {caption ?
      <Typography variant="h3">
        {caption}
      </Typography>
      : null}
    </Row>
  )
}

export default OrganizationButton

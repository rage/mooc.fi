import { EnhancedLink, EnhancedLinkProps, Link as MUILink } from "@mui/material"
import { styled } from "@mui/material/styles"

import ArrowLeft from "../Icons/ArrowLeft"
import ArrowRight from "../Icons/ArrowRight"
import { fontSize } from "/src/theme/util"

const ctaLinkVariants = ["link-list", "default"] as const

export type CTALinkVariant = (typeof ctaLinkVariants)[number]

const Link = styled(MUILink)(
  ({ theme }) => `
  ${fontSize(16, 24)}
  font-weight: 600;
  align-items: center;
  color: ${theme.palette.common.brand.main};
  display: inline-grid;
  gap: 16px;
  grid-auto-flow: column;
  letter-spacing: -0.5px;
  overflow: hidden;
  text-decoration: none;

  &:hover, &:focus {
    text-decoration: underline;

    ${LinkIcon} {
      background-color: ${theme.palette.common.brand.main};
    }
  }
`,
) as EnhancedLink

const LinkIcon = styled("span")(
  ({ theme }) => `
  align-items: center;
  background-color: ${theme.palette.common.brand.light};
  display: inline-flex;
  height: 40px;
  justify-content: center;
  width: 40px;

  svg {
    fill: ${theme.palette.common.grayscale.white};
  }
`,
)

export interface CTALinkProps extends EnhancedLinkProps {
  linkVariant?: CTALinkVariant
}

const CTALink = (props: CTALinkProps) => {
  const { children, target, linkVariant, ...rest } = props

  const isExternal = target === "_blank"

  return (
    <Link target={target} {...rest}>
      {children}
      <LinkIcon>
        {isExternal ? (
          <ArrowLeft sx={{ fontSize: "24px" }} />
        ) : (
          <ArrowRight sx={{ fontSize: "24px" }} />
        )}
      </LinkIcon>
    </Link>
  )
}

export default CTALink

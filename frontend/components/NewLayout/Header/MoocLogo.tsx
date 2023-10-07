import { Link, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import MoocLogoFilled from "../Icons/MoocLogoFilled"
import { fontSize } from "/src/theme/util"

const MoocLogoText = styled(Typography)(
  ({ theme }) => `
  ${fontSize(24, 24)}
  font-weight: 700;
  color: ${theme.palette.common.brand.nearlyBlack};
  letter-spacing: -0.6px;
  ${theme.breakpoints.up("md")} {
    ${fontSize(28, 28)}
  }
  ${theme.breakpoints.up("xl")} {
    ${fontSize(32, 32)}
    letter-spacing: -0.8px;
  }
`,
)

const MoocLogoLink = styled(Link)`
  color: black;
  text-decoration: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`
const MoocLogo = () => (
  <MoocLogoLink href="/" aria-label="MOOC.fi homepage">
    <MoocLogoFilled sx={{ fontSize: "3rem", marginRight: "0.5rem" }} />
    <MoocLogoText>MOOC.fi</MoocLogoText>
  </MoocLogoLink>
)

export default MoocLogo

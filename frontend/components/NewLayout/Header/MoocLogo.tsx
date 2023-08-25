import { Link, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import MoocLogoFilled from "../Icons/MoocLogoFilled"

const MoocLogoText = styled(Typography)(
  ({ theme }) => `
  font-weight: 600;
  font-size: 1.75rem !important;
  letter-spacing: -0.75px;
  ${theme.breakpoints.down("xs")} {
    font-size: 1.5rem !important;
  }
  ${theme.breakpoints.down("xxs")} {
    display: none !important;
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
  <MoocLogoLink href="/_new" aria-label="MOOC.fi homepage">
    <MoocLogoFilled sx={{ fontSize: "3rem", marginRight: "0.5rem" }} />
    <MoocLogoText>MOOC.fi</MoocLogoText>
  </MoocLogoLink>
)

export default MoocLogo

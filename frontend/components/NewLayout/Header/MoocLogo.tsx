import { Link, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import MoocLogoFilled from "../Icons/MoocLogoFilled"

const MoocLogoText = styled(Typography)(
  ({ theme }) => `
  font-size: 1.575rem;
  line-height: 24px;
  font-weight: 700;
  color: ${theme.palette.common.brand.nearlyBlack};
  letter-spacing: -0.6px;
  ${theme.breakpoints.down("md")} {
    font-size: 1.5rem;
    line-height: 20px;
  }
  ${theme.breakpoints.up("xl")} {
    font-size: 1.625rem;
    line-height: 30px;
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
  <MoocLogoLink href="/_new" aria-label="MOOC.fi homepage">
    <MoocLogoFilled sx={{ fontSize: "3rem", marginRight: "0.5rem" }} />
    <MoocLogoText>MOOC.fi</MoocLogoText>
  </MoocLogoLink>
)

export default MoocLogo

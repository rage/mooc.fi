import { Link } from "@mui/material"
import { styled } from "@mui/material/styles"

import MoocTextLogo from "../Icons/MoocTextLogo"

const MoocLogoWrapper = styled("div")<{ height: number }>(
  ({ theme, height }) => `
  height: ${height}px;
  display: flex;
  align-items: center;
  ${theme.breakpoints.up("md")} {
    height: ${height * 1.5}px;
  }
  ${theme.breakpoints.up("xl")} {
    height: ${height * 2}px;
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
    <MoocLogoWrapper height={24}>
      <MoocTextLogo height={24} />
    </MoocLogoWrapper>
  </MoocLogoLink>
)

export default MoocLogo

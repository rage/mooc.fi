import { Avatar, Link, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import moocLogo from "/public/images/moocfi.svg"

const MoocLogoText = styled(Typography)(
  ({ theme }) => `
  font-size: 1.75rem !important;
  ${theme.breakpoints.down("xs")} {
    font-size: 1.5rem !important;
  }
  ${theme.breakpoints.down("xxs")} {
    display: none !important;
  }

  margin-top: 1rem;
`,
)

const MoocLogoAvatar = styled(Avatar)(
  ({ theme }) => `
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  margin-left: 0px;
  margin-right: 0.5rem;
  height: 3em;
  width: 3em;
  ${theme.breakpoints.down("xs")} {
    height: 2.5em;
    width: 2.5em;
  }
`,
)

const MoocLogoLink = styled(Link)`
  color: black;
  text-decoration: none;
  display: flex;
  flex-direction: row;
  margin-right: 1.5em;
  &:hover {
    cursor: pointer;
  }
`
const MoocLogo = () => (
  <MoocLogoLink href="/_new" aria-label="MOOC.fi homepage">
    <MoocLogoAvatar alt="MOOC logo" src={moocLogo.src} />
    <MoocLogoText>MOOC.fi</MoocLogoText>
  </MoocLogoLink>
)

export default MoocLogo

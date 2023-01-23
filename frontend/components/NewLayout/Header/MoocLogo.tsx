import { Avatar, Link, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import MoocSvg from "/static/images/moocfi.svg"

const MoocLogoText = styled(Typography)`
  font-size: 1.75rem !important;
  @media (max-width: 425px) {
    font-size: 1.5rem !important;
  }
  @media (max-width: 375px) {
    display: none !important;
  }

  margin-top: 1rem;
`

const MoocLogoAvatar = styled(Avatar)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  margin-left: 0px;
  margin-right: 0.5rem;
  height: 3em;
  width: 3em;
  @media (max-width: 425px) {
    height: 2.5em;
    width: 2.5em;
  }
`
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
    <MoocLogoAvatar alt="MOOC logo" src={MoocSvg} />
    <MoocLogoText>MOOC.fi</MoocLogoText>
  </MoocLogoLink>
)

export default MoocLogo

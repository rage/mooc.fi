import Image from "next/image"

import { Avatar, Link, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import moocLogo from "/public/images/new/logos/moocfi.svg"

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

const MoocLogoAvatar = styled(Avatar)`
  height: 3rem;
  width: 3rem;
  margin-right: 0.5em;
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
    <MoocLogoAvatar>
      <Image src={moocLogo} alt="MOOC.fi logo" priority fill />
    </MoocLogoAvatar>
    <MoocLogoText>MOOC.fi</MoocLogoText>
  </MoocLogoLink>
)

export default MoocLogo

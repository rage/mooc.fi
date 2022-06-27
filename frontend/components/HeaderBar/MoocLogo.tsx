import styled from "@emotion/styled"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import Link from "next/link"

const MoocLogoText = styled(Typography)<any>`
  font-family: "Open Sans Condensed Light", sans-serif;
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
const MoocLogoLink = styled.a`
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
  <Link href="/" passHref>
    <MoocLogoLink aria-label="MOOC.fi homepage">
      <MoocLogoAvatar
        alt="MOOC logo"
        src={require("../../static/images/moocfi.svg")}
      />
      <MoocLogoText>MOOC.fi</MoocLogoText>
    </MoocLogoLink>
  </Link>
)

export default MoocLogo

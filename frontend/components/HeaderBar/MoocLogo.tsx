import React from "react"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"
import Avatar from "@material-ui/core/Avatar"
import LangLink from "/components/LangLink"

const MoocLogoText = styled(Typography)`
  font-family: "Open Sans Condensed Light", sans-serif;
  font-size: 1.75rem;
  margin-top: 1rem;
`

const MoocLogoAvatar = styled(Avatar)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  margin-left: 0px;
  margin-right: 0.5rem;
  height: 3em;
  width: 3em;
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
const MoocLogo = () => {
  return (
    <LangLink as="/" href="/">
      <MoocLogoLink aria-label="MOOC.fi homepage">
        <MoocLogoAvatar alt="MOOC logo" src="/static/images/moocfi.svg" />
        <MoocLogoText>MOOC.fi</MoocLogoText>
      </MoocLogoLink>
    </LangLink>
  )
}

export default MoocLogo

import React from "react"
import Grid from "@material-ui/core/Grid"
import ButtonBase from "@material-ui/core/ButtonBase"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"

const Base = styled(ButtonBase)`
  position: relative;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  height: 200px;
  @media (min-width: 720px) {
    height: 300px;
  }
`
const ImageBackground = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-size: cover;
  background-position: center 40%;
`
const ImageCover = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: white;
  opacity: 0.9;
  width: 70%;
`
const ContentArea = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: left;
  display: flex;
  flex-direction: column;
  padding-bottom: 1em;
  padding-top: 1em;
`

const NaviCardTitle = styled(Typography)`
  font-family: "Open Sans Condensed Light", sans-serif;
  margin-bottom: 1rem;
  margin-left: 1rem;
  max-width: 60%;
  line-height: 1.2em;
  @media (min-width: 320px) {
    font-size: 26px;
  }
  @media (min-width: 420px) {
    font-size: 32px;
  }
  @media (min-width: 720px) {
    font-size: 46px;
  }
  @media (min-width: 720px) {
    font-size: 48px;
  }
`
const NaviCardBodyText = styled(Typography)`
  font-family: "Open Sans Condensed Light", sans-serif;
  max-width: 60%;
  text-align: left;
  margin: 0;
  margin-left: 1rem;
  flex: 1;
  @media (min-width: 320px) {
    font-size: 18px;
  }
  @media (min-width: 420px) {
    font-size: 20px;
  }
  @media (min-width: 720px) {
    font-size: 24px;
  }
  @media (min-width: 1000px) {
    font-size: 24px;
  }
`
function ModuleNaviCard({ module }) {
  return (
    <Grid item xs={12} md={6} lg={6}>
      <Base focusRipple>
        <ImageBackground style={{ backgroundImage: `url(${module.image})` }} />
        <ImageCover />
        <ContentArea>
          <NaviCardTitle align="left">{module.name}</NaviCardTitle>
          <NaviCardBodyText paragraph>{module.description}</NaviCardBodyText>
        </ContentArea>
      </Base>
    </Grid>
  )
}

export default ModuleNaviCard

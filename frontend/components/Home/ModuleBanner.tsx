import React from "react"
import styled from "styled-components"
import { Typography } from "@material-ui/core"

const backgroundImage = require("../../static/images/AiModule.jpg")

const ModuleBannerContainer = styled.section`
  display: flex;
  position: relative;
  flex-direction: column;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  align-items: center;
  justify-content: center;
`

const Title = styled(Typography)`
  font-size: 46px;
  margin-top: 2rem;
  margin-left: 2rem;
  margin-bottom: 1rem;
  padding: 1rem;
  font-family: "Open Sans Condensed Light", sans-serif;
  background-color: rgba(255, 255, 255, 0.8);
  width: 60%;
  @media (min-width: 425px) {
    font-size: 56px;
  }
  @media (min-width: 1000px) {
    font-size: 72px;
  }
`

const ImageBackground = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-size: cover;
  background-repeat: no-repeat;
  z-index: -2;
  background-image: url(${backgroundImage});
  background-position: center;
`

function ModuleBanner() {
  return (
    <ModuleBannerContainer>
      <img style={{ display: "none" }} src={backgroundImage} alt="" />
      <Title component="h2" align="center">
        Tekoäly ja Datatiede
      </Title>
      <ImageBackground />
    </ModuleBannerContainer>
  )
}

export default ModuleBanner

import React from "react"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"

const ModuleBannerContainer = styled.section`
  display: flex;
  position: relative;
  flex-direction: column;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  align-items: center;
  justify-content: center;
  min-height: 250px;
  @media (min-width: 700px) {
    min-height: 300px;
  }
  @media (min-width: 1000px) {
    min-height: 350px;
  }
`

const Title = styled(Typography)`
  font-size: 38px;
  margin-top: 2rem;
  margin-left: 2rem;
  margin-bottom: 1rem;
  padding: 1rem;
  font-family: "Open Sans Condensed Light", sans-serif;
  background-color: rgba(255, 255, 255, 0.8);
  width: 60%;
  @media (min-width: 425px) {
    font-size: 52px;
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
  background-position: center;
`

function ModuleBanner({ module }) {
  return (
    <ModuleBannerContainer>
      <img style={{ display: "none" }} src={module.image} alt="" />
      <Title component="h2" align="center">
        {module.name}
      </Title>
      <ImageBackground style={{ backgroundImage: `url(${module.image}` }} />
    </ModuleBannerContainer>
  )
}

export default ModuleBanner

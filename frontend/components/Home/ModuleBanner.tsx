import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
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
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      position: "absolute",
      left: 0,
      width: "70%",
      top: 0,
      bottom: 0,
      backgroundColor: "white",
      opacity: 0.9,
      zIndex: -1,
    },
    backGround: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      zIndex: -2,
      backgroundImage: `url(${backgroundImage})`,
      backgroundPosition: "center",
    },
  }),
)

function ModuleBanner() {
  const classes = useStyles()
  return (
    <ModuleBannerContainer>
      <img style={{ display: "none" }} src={backgroundImage} alt="" />
      <Title component="h2" align="center">
        Tekoäly ja Datatiede
      </Title>
      <div className={classes.backGround} />
    </ModuleBannerContainer>
  )
}

export default ModuleBanner

import React from "react"
import Explanation from "./Explanation"
import styled from "styled-components"
const image = require("../../static/images/homeBackground.jpg?resize&sizes[]=400&sizes[]=600&sizes[]=1000&sizes[]=2000")

const ExplanationRoot = styled.section`
  display: flex;
  position: relative;
  margin-bottom: 2rem;
  min-height: 500px;
  @media (min-width: 2000px) {
    min-height: 750px;
  }
`

const BackDrop = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  width: 70%;
  @media (min-width: 960px) {
    width: 45%;
  }
  top: 0;
  bottom: 0;
  background-color: white;
  opacity: 0.9;
  z-index: -1;
`

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
`
function ExplanationHero() {
  return (
    <ExplanationRoot>
      <Explanation />
      <BackDrop />
      <BackgroundImage srcSet={image.srcSet} src={image.src} />
    </ExplanationRoot>
  )
}

export default ExplanationHero

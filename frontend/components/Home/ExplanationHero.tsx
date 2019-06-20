import React from "react"
import Explanation from "./Explanation"
import styled from "styled-components"

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
const Background = styled.div`
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

function ExplanationHero() {
  return (
    <ExplanationRoot>
      <Explanation />
      <BackDrop />
      <Background
        style={{
          backgroundImage: `url(${require("../../static/images/homeBackground.jpg")})`,
        }}
      />
    </ExplanationRoot>
  )
}

export default ExplanationHero

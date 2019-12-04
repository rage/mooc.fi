import React from "react"
import Card from "@material-ui/core/Card"
import styled from "styled-components"
import { H1NoBackground, SubtitleNoBackground } from "/components/Text/headers"

const Background = styled(Card)`
  background-color: #822900;
  color: white;
`
const NoOsMessage = () => {
  return (
    <Background>
      <H1NoBackground component="h2" variant="h4" align="center">
        Could not detect Operating system
      </H1NoBackground>
      <SubtitleNoBackground align="center">
        Please select your operating system from the menu above
      </SubtitleNoBackground>
    </Background>
  )
}

export default NoOsMessage

import Card from "@mui/material/Card"
import styled from "@emotion/styled"
import { H1NoBackground, SubtitleNoBackground } from "/components/Text/headers"

const RedBackground = styled(Card)`
  background-color: #822900;
  color: white;
`
const NoOsMessage = () => {
  return (
    <RedBackground>
      <H1NoBackground component="h2" variant="h4" align="center">
        Could not detect Operating system
      </H1NoBackground>
      <SubtitleNoBackground align="center">
        Please select your operating system from the menu above
      </SubtitleNoBackground>
    </RedBackground>
  )
}

export default NoOsMessage

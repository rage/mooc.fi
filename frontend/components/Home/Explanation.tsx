import React, { useContext } from "react"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"
import LanguageContext from "/contexes/LanguageContext"
import getHomeTranslator from "/translations/home"
import { HOneNoBackground } from "/components/Text/headers"

const ExplanationRoot = styled.div`
  max-width: 80%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.9);
  padding-bottom: 1.5rem;
  @media (min-width: 425px) {
    max-width: 70%;
  }
  @media (min-width: 2000px) {
    max-width: 40%;
  }
`

const Subtitle = styled(Typography)`
  padding-right: 1.5rem;
  padding-left: 1.5rem;
  padding-bottom: 1em;

  @media (min-width: 960px) {
    padding-left: 62px;
    padding-right: 62px;
  }
  @media (min-width: 1440px) {
    padding-left: 82px;
    padding-right: 82px;
  }
`

const CourseButton = styled(Button)`
  background-color: #378170;
  color: white;
  font-size: 18px;
  @media (min-width: 600px) {
    font-size: 26px;
  }
  @media (min-width: 1440px) {
    font-size: 34px;
  }
  width: 40%;
  margin: auto;
`

function Explanation() {
  const lng = useContext(LanguageContext)
  const t = getHomeTranslator(lng.language)

  return (
    <ExplanationRoot>
      <HOneNoBackground component="h1" variant="h1">
        {t("tagLine")}
      </HOneNoBackground>

      <Subtitle component="p" variant="subtitle1">
        {t("intro")}
      </Subtitle>
      <CourseButton variant="contained" href="#courses">
        {t("courseButton")}
      </CourseButton>
    </ExplanationRoot>
  )
}
export default Explanation

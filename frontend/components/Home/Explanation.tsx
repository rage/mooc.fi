import React from "react"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import NextI18Next from "../../i18n"
import styled from "styled-components"

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

const Title = styled(Typography)`
  padding-top: 0.7em;
  padding-bottom: 0.7em;
  padding-left: 1.5rem;
  padding-right: 1.5rem;

  @media (min-width: 600px) {
    padding-top: 1em;
    padding-bottom: 1em;
  }

  @media (min-width: 960px) {
    padding-left: 1em;
    padding-right: 1em;
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
  background-color: #00a68d;
  color: white;

  width: 40%;
  margin: auto;
`
interface ExplanationProps {
  t: Function
}
function Explanation(props: ExplanationProps) {
  const { t } = props
  return (
    <ExplanationRoot>
      <Title component="h1" variant="h1">
        {t("tagLine")}
      </Title>

      <Subtitle component="p" variant="subtitle1">
        {t("intro")}
      </Subtitle>
      <CourseButton variant="contained" href="#courses-and-modules">
        {t("courseButton")}
      </CourseButton>
    </ExplanationRoot>
  )
}
export default NextI18Next.withTranslation("home")(Explanation)

import React from "react"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import NextI18Next from "../../i18n"
import styled from "styled-components"

const ExplanationRoot = styled.div`
  max-width: 70%;
  position: relative;
  margin-left: 1em;
  margin-bottom: 1rem;
  overflow: hidden;
`

const Title = styled(Typography)`
  padding-top: 2rem;
  padding-bottom: 2rem;
  font-size: 36px;
  max-width: 60%;
  @media (min-width: 600px) {
    font-size: 48px;
  }
  @media (min-width: 960px) {
    margin-left: 1rem;
    font-size: 52px;
  }
  @media (min-width: 1920px) {
    font-size: 82px;
  }
`
const Subtitle = styled(Typography)`
  padding-right: 1rem;
  padding-bottom: 2rem;
  font-size: 18px;
  @media (min-width: 600px) {
    font-size: 22px;
  }
  @media (min-width: 960px) {
    max-width: 47%;
    margin-left: 1rem;
  }
  @media (min-width: 1920px) {
    font-size: 32px;
    margin-bottom: 3rem;
  }
`

const CourseButton = styled(Button)`
  margin: auto;
  background-color: #00a68d;
  color: white;
  font-size: 24px;
  margin-left: 10%;
`
interface ExplanationProps {
  t: Function
}
function Explanation(props: ExplanationProps) {
  const { t } = props
  return (
    <ExplanationRoot>
      <Title component="h1" variant="h4">
        {t("tagLine")}
      </Title>
      <div>
        <Subtitle component="p">{t("intro")}</Subtitle>
        <CourseButton variant="contained" href="#courses-and-modules">
          {t("courseButton")}
        </CourseButton>
      </div>
    </ExplanationRoot>
  )
}
export default NextI18Next.withTranslation("home")(Explanation)

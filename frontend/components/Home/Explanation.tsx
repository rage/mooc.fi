import React from "react"
import { Button, Typography } from "@material-ui/core"
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
  font-family: "Open Sans Condensed Light", sans-serif;
  padding-top: 2rem;
  padding-bottom: 2rem;
  font-size: 72px;
  @media (min-width: 600px) {
    font-size: 120px;
  }
  @media (min-width: 960px) {
    margin-left: 1rem;
  }
  @media (min-width: 1920px) {
    font-size: 210px;
  }
`
const Subtitle = styled(Typography)`
  font-family: "Open Sans Condensed Light", sans-serif;
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
  font-family: "Open Sans Condensed Light", sans-serif;
  margin-left: 10%;
`

function Explanation({ t }) {
  return (
    <ExplanationRoot>
      <Title component="h1">MOOC.fi</Title>
      <div>
        <Subtitle component="p">{t("intro")}</Subtitle>
        <CourseButton variant="contained" href="#coursesAndModules">
          {t("courseButton")}
        </CourseButton>
      </div>
    </ExplanationRoot>
  )
}
export default NextI18Next.withTranslation("home")(Explanation)

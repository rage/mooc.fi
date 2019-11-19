import React, { useContext } from "react"
import LanguageContext from "/contexes/LanguageContext"
import getInstallationTranslator from "/translations/installation"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"

const Background = styled.section`
  background-color: #006877;
`

const Title = styled(Typography)`
  margin-top: 1em;
  margin-bottom: 0.4em;
`

const Subtitle = styled(Typography)`
  padding: 0.3em;
`
const TitleBackground = styled.div`
  background-color: white;
  max-width: 75%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1em;
`

const ContentBox = styled.div`
  background-color: white;
  max-width: 80%;
  border: 3px solid gray;
  border-radius: 15px;
  margin-left: auto;
  margin-right: auto;
`

const NetBeans = () => {
  const siteLanguageDetails = useContext(LanguageContext)
  const t = getInstallationTranslator(siteLanguageDetails.language)
  return (
    <Background>
      <TitleBackground>
        <Title component="h1" variant="h1" align="center">
          {t("title")}
        </Title>
        <Subtitle variant="subtitle1" align="center">
          {t("subtitle")}
        </Subtitle>
      </TitleBackground>
      <ContentBox>lalalalalalalalalal</ContentBox>
    </Background>
  )
}

export default NetBeans

import React, { useContext } from "react"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGraduationCap,
  faBookOpen,
  faLaptop,
  faPlusSquare,
  faUserFriends,
  faBook,
  faComments,
} from "@fortawesome/free-solid-svg-icons"
import LanguageContext from "/contexes/LanguageContext"
import getTeachersTranslator from "/translations/teachers"

const ContentBlock = styled.div`
  padding: 5rem 1rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  :nth-child(even) {
    background-color: #f6f9fc;
  }
`

const TextBlock = styled(Typography)`
  max-width: 800px;
`

const Header = styled(Typography)`
  text-align: center;
  margin-bottom: 4rem !important;
`

const StyledIcon = styled(FontAwesomeIcon)`
  color: rgba(0, 0, 0, 0.54);
  margin-bottom: 1rem;
`

const StyledButton = styled(Button)`
  margin: 2rem !important;
`

const ForTeachers = () => {
  const lng = useContext(LanguageContext)
  const t = getTeachersTranslator(lng.language)
  return (
    <section>
      <ContentBlock>
        <Header variant="h3">{t("siteTitle")}</Header>
        <TextBlock>{t("siteIntro")}</TextBlock>
      </ContentBlock>
      <ContentBlock>
        <StyledIcon icon={faGraduationCap} size="3x" />
        <Header variant="h4">{t("teachingTitle")}</Header>
        <TextBlock>
          Voit hyödyntää suurinta osaa tarjoamistamme materiaaleista vapaasti.
          Materiaaleissamme on lähes poikkeuksetta käytetty
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fi">
            Creative Commons BY-NC-SA
          </a>
          -lisenssiä, mutta tarkista vielä lisenssi materiaalista. Creative
          Commons BY-NC-SA -lisenssi tarkoittaa sitä, että voit käyttää
          materiaaleja joko sellaisenaan tai muokata niitä paremmin omaan
          opetukseesi sopivaksi, kunhan säilytät tiedon alkuperäisistä
          tekijöistä materiaalissa ja et tavoittele materiaaleillamme itsellesi
          kaupallista hyötyä.
        </TextBlock>
        <TextBlock>{t("teachingText2")}</TextBlock>
        <TextBlock>{t("teachingText3")}</TextBlock>
      </ContentBlock>
      <ContentBlock>
        <StyledIcon icon={faBookOpen} size="3x" />
        <Header variant="h4">{t("organizeTitle")}</Header>
        <TextBlock>{t("organizeText")}</TextBlock>
        <TextBlock>{t("organizeText2")}</TextBlock>
        <TextBlock>{t("organizeText3")}</TextBlock>
      </ContentBlock>
      <ContentBlock>
        <StyledIcon icon={faLaptop} size="3x" />
        <Header variant="h4">{t("tmcTitle")}</Header>
        <TextBlock>{t("tmcText")}</TextBlock>
        <TextBlock>{t("tmcText2")}</TextBlock>
      </ContentBlock>
      <ContentBlock>
        <StyledIcon icon={faPlusSquare} size="3x" />
        <Header variant="h4">{t("howtoTitle")}</Header>
        <TextBlock>
          Aloita luomalla itsellesi käyttäjätunnus sivustolle
          <a href="https://tmc.mooc.fi/">https://tmc.mooc.fi/</a>
        </TextBlock>
        <TextBlock>{t("howtoText2")}</TextBlock>
        <StyledButton
          variant="contained"
          color="primary"
          href="http://testmycode-usermanual.github.io/usermanual/teachers.html"
        >
          {t("tmcButtonText")}
        </StyledButton>
        <TextBlock />
      </ContentBlock>
      {lng.language === "fi" ? (
        <section>
          <ContentBlock>
            <StyledIcon icon={faUserFriends} size="3x" />
            <Header variant="h4">{t("teachingTipsTitle")}</Header>
            <TextBlock>{t("teachingTips")}</TextBlock>
            <TextBlock>{t("teachingTips2")}</TextBlock>
            <TextBlock>{t("teachingTips3")}</TextBlock>
          </ContentBlock>
          <ContentBlock>
            <StyledIcon icon={faBook} size="3x" />
            <Header variant="h4">{t("2016Title")}</Header>
            <TextBlock>
              Lähivuosina kaikki opettelevat ohjelmointia peruskoulusta asti.
              Tämä vaatii opettajilta ohjelmointiosaamista. Suosittelemme
              opettajille opetuksen tueksi erityisesti
              <a href="http://koodiaapinen.fi/">Koodiaapista</a>. Koodiaapinen
              kerää ja tarjoaa opettajille suunnattuja resursseja, jotka
              auttavat ohjelmointiopetuksen järjestämisessä. Voit osallistua
              koodiaapisen luomiseen myös itse.
            </TextBlock>
          </ContentBlock>
        </section>
      ) : (
        ""
      )}
      <ContentBlock>
        <StyledIcon icon={faComments} size="3x" />
        <Header variant="h4">{t("contactTitle")}</Header>
        <TextBlock>
          Saat meihin parhaiten yhteyden lähettämällä sähköpostia osoitteeseen
          <a href="https://tmc.mooc.fi/">mooc@cs.helsinki.fi</a>
        </TextBlock>
      </ContentBlock>
    </section>
  )
}

export default ForTeachers

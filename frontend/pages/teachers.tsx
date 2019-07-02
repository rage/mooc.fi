import React from "react"
import NextI18Next from "../i18n"
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

const ForTeachers = ({ t, i18n }) => {
  return (
    <section>
      <ContentBlock>
        <Header variant="h3">{t("siteTitle")}</Header>
        <TextBlock>
          <NextI18Next.Trans i18nKey="teachers:siteIntro">
            You can utilize most of our materials freely. Most of them are
            licenced with{" "}
            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en">
              Creative Commons BY-NC-SA{" "}
            </a>{" "}
            -licence, but check the course materials for confirmation. Creative
            Commons BY-NC-SA -licence means that you can use the materials
            either as is or modify them to better suit your teaching purposes as
            long as you preserve the information of the original creators in the
            materials, and the usage is non-commercial.
          </NextI18Next.Trans>
        </TextBlock>
      </ContentBlock>
      <ContentBlock>
        <StyledIcon icon={faGraduationCap} size="3x" />
        <Header variant="h4">{t("teachingTitle")}</Header>
        <TextBlock>
          <NextI18Next.Trans i18nKey="teachers:teachingText">
            Voit hyödyntää suurinta osaa tarjoamistamme materiaaleista vapaasti.
            Materiaaleissamme on lähes poikkeuksetta käytetty
            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fi">
              Creative Commons BY-NC-SA{" "}
            </a>{" "}
            -lisenssiä, mutta tarkista vielä lisenssi materiaalista. Creative
            Commons BY-NC-SA -lisenssi tarkoittaa sitä, että voit käyttää
            materiaaleja joko sellaisenaan tai muokata niitä paremmin omaan
            opetukseesi sopivaksi, kunhan säilytät tiedon alkuperäisistä
            tekijöistä materiaalissa ja et tavoittele materiaaleillamme
            itsellesi kaupallista hyötyä.
          </NextI18Next.Trans>
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
          <NextI18Next.Trans i18nKey="teachers:howtoText">
            Aloita luomalla itsellesi käyttäjätunnus sivustolle
            <a href="https://tmc.mooc.fi/">https://tmc.mooc.fi/</a>
          </NextI18Next.Trans>
        </TextBlock>
        <TextBlock>{t("howtoText2")}</TextBlock>
        <StyledButton
          variant="contained"
          color="primary"
          href="http://testmycode-usermanual.github.io/usermanual/teachers.html"
        >
          {t("tmcButtonText")}
        </StyledButton>
        <TextBlock>
          <NextI18Next.Trans i18nKey="teachers:howtoNB" />
        </TextBlock>
      </ContentBlock>
      {i18n.language === "fi" ? (
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
              <NextI18Next.Trans i18nKey="teachers:2016Text">
                Lähivuosina kaikki opettelevat ohjelmointia peruskoulusta asti.
                Tämä vaatii opettajilta ohjelmointiosaamista. Suosittelemme
                opettajille opetuksen tueksi erityisesti
                <a href="http://koodiaapinen.fi/">Koodiaapista</a>. Koodiaapinen
                kerää ja tarjoaa opettajille suunnattuja resursseja, jotka
                auttavat ohjelmointiopetuksen järjestämisessä. Voit osallistua
                koodiaapisen luomiseen myös itse.
              </NextI18Next.Trans>
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
          <NextI18Next.Trans i18nKey="teachers:contactText">
            Saat meihin parhaiten yhteyden lähettämällä sähköpostia osoitteeseen
            <a href="https://tmc.mooc.fi/">mooc@cs.helsinki.fi</a>
          </NextI18Next.Trans>
        </TextBlock>
      </ContentBlock>
    </section>
  )
}

ForTeachers.getInitialProps = function() {
  return {
    namespacesRequired: ["teachers"],
  }
}

export default NextI18Next.withTranslation("teachers")(ForTeachers)

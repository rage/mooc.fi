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
        <TextBlock>{t("siteIntro")}</TextBlock>
      </ContentBlock>
      <ContentBlock>
        <StyledIcon icon={faGraduationCap} size="3x" />
        <Header variant="h4">{t("teachingTitle")}</Header>

        <TextBlock>{t("teachingText")}</TextBlock>
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
        <TextBlock>{t("howtoText")}</TextBlock>
        <TextBlock>{t("howtoText2")}</TextBlock>
        <StyledButton
          variant="contained"
          color="primary"
          href="http://testmycode-usermanual.github.io/usermanual/teachers.html"
        >
          {t("tmcButtonText")}
        </StyledButton>
        <TextBlock>{t("howtoNB")}</TextBlock>
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
            <TextBlock>{t("2016Text")}</TextBlock>
          </ContentBlock>
        </section>
      ) : (
        ""
      )}
      <ContentBlock>
        <StyledIcon icon={faComments} size="3x" />
        <Header variant="h4">{t("contactTitle")}</Header>
        <TextBlock>{t("contactText")}</TextBlock>
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

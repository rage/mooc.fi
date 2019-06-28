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

const ForTeachers = ({ t }) => {
  return (
    <section>
      <ContentBlock>
        <Header variant="h3">{t("siteTitle")}</Header>
        <TextBlock>{t("siteIntro")}</TextBlock>
      </ContentBlock>
      <ContentBlock>
        <StyledIcon icon={faGraduationCap} size="3x" />
        <Header variant="h4">MOOCin käyttö opetuksessa</Header>

        <TextBlock>There</TextBlock>
      </ContentBlock>
      <ContentBlock>
        <StyledIcon icon={faBookOpen} size="3x" />
        <Header variant="h4">Näin järjestät kurssin</Header>
        <TextBlock>Teacher</TextBlock>
      </ContentBlock>
    </section>
  )
}

ForTeachers.getInitialProps = function() {
  return {
    namespacesRequired: ["teachers", "common"],
  }
}

export default NextI18Next.withTranslation(["teachers", "common"])(ForTeachers)

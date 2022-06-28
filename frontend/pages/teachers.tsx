import { H1NoBackground } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import TeachersTranslations from "/translations/teachers"
import { useTranslator } from "/util/useTranslator"
import styled from "@emotion/styled"
import {
  faBook,
  faBookOpen,
  faComments,
  faGraduationCap,
  faLaptop,
  faPlusSquare,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/router"

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

const TextBlock = styled(Typography)<any>`
  max-width: 800px;
`

const StyledIcon = styled(FontAwesomeIcon)`
  color: rgba(0, 0, 0, 0.54);
  margin-bottom: 1rem;
`

const StyledButton = styled(Button)`
  margin: 2rem !important;
`

const ForTeachers = () => {
  const t = useTranslator(TeachersTranslations)
  const { locale } = useRouter()

  useBreadcrumbs([
    {
      translation: `teachers`,
      href: "/teachers",
    },
  ])

  return (
    <section>
      <H1NoBackground variant="h1" component="h1" align="center">
        {t("siteTitle")}
      </H1NoBackground>
      <ContentBlock>
        <TextBlock>
          <span dangerouslySetInnerHTML={{ __html: t("siteIntro") }} />
        </TextBlock>
      </ContentBlock>
      <ContentBlock>
        <StyledIcon icon={faGraduationCap} size="3x" />
        <H1NoBackground variant="h4" component="h2" align="center">
          {t("teachingTitle")}
        </H1NoBackground>
        <TextBlock>
          <span dangerouslySetInnerHTML={{ __html: t("teachingText") }} />
        </TextBlock>
        <TextBlock>{t("teachingText2")}</TextBlock>
        <TextBlock>{t("teachingText3")}</TextBlock>
      </ContentBlock>
      <ContentBlock>
        <StyledIcon icon={faBookOpen} size="3x" />
        <H1NoBackground variant="h4" component="h2" align="center">
          {t("organizeTitle")}
        </H1NoBackground>
        <TextBlock>{t("organizeText")}</TextBlock>
        <TextBlock>{t("organizeText2")}</TextBlock>
        <TextBlock>{t("organizeText3")}</TextBlock>
      </ContentBlock>
      <ContentBlock>
        <StyledIcon icon={faLaptop} size="3x" />
        <H1NoBackground variant="h4" component="h2" align="center">
          {t("tmcTitle")}
        </H1NoBackground>
        <TextBlock>{t("tmcText")}</TextBlock>
        <TextBlock>{t("tmcText2")}</TextBlock>
      </ContentBlock>
      <ContentBlock>
        <StyledIcon icon={faPlusSquare} size="3x" />
        <H1NoBackground variant="h4" component="h2" align="center">
          {t("howtoTitle")}
        </H1NoBackground>
        <TextBlock>
          <span dangerouslySetInnerHTML={{ __html: t("howtoText") }} />
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
      {locale === "fi" ? (
        <section>
          <ContentBlock>
            <StyledIcon icon={faUserFriends} size="3x" />
            <H1NoBackground variant="h4" component="h2" align="center">
              {t("teachingTipsTitle")}
            </H1NoBackground>
            <TextBlock>{t("teachingTips")}</TextBlock>
            <TextBlock>{t("teachingTips2")}</TextBlock>
            <TextBlock>{t("teachingTips3")}</TextBlock>
          </ContentBlock>
          <ContentBlock>
            <StyledIcon icon={faBook} size="3x" />
            <H1NoBackground variant="h4" component="h2" align="center">
              {t("2016Title")}
            </H1NoBackground>
            <TextBlock>
              <span dangerouslySetInnerHTML={{ __html: t("2016Text") }} />
            </TextBlock>
          </ContentBlock>
        </section>
      ) : null}
      <ContentBlock>
        <StyledIcon icon={faComments} size="3x" />
        <H1NoBackground variant="h4" component="h2" align="center">
          {t("contactTitle")}
        </H1NoBackground>
        <TextBlock>
          <span dangerouslySetInnerHTML={{ __html: t("contactText") }} />
        </TextBlock>
      </ContentBlock>
    </section>
  )
}

export default ForTeachers

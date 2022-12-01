import { useRouter } from "next/router"

import BookOpenIcon from "@fortawesome/fontawesome-free/svgs/solid/book-open.svg?icon"
import BookIcon from "@fortawesome/fontawesome-free/svgs/solid/book.svg?icon"
import CommentsIcon from "@fortawesome/fontawesome-free/svgs/solid/comments.svg?icon"
import GraduationCapIcon from "@fortawesome/fontawesome-free/svgs/solid/graduation-cap.svg?icon"
import LaptopIcon from "@fortawesome/fontawesome-free/svgs/solid/laptop.svg?icon"
import PlusSquareIcon from "@fortawesome/fontawesome-free/svgs/solid/square-plus.svg?icon"
import UserFriendsIcon from "@fortawesome/fontawesome-free/svgs/solid/user-group.svg?icon"
import Button from "@mui/material/Button"
import { css, styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"

import { H1NoBackground } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import TeachersTranslations from "/translations/teachers"
import { useTranslator } from "/util/useTranslator"

const ContentBlock = styled("article")`
  padding: 5rem 1rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  :nth-of-type(even) {
    background-color: #f6f9fc;
  }
`

const TextBlock = styled(Typography)`
  max-width: 800px;
` as typeof Typography

const iconStyle = css`
  fill: rgba(0, 0, 0, 0.54);
  margin-bottom: 1rem;
  font-size: 3rem;
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
        <TextBlock>{t("siteIntro")}</TextBlock>
      </ContentBlock>
      <ContentBlock>
        <GraduationCapIcon css={iconStyle} />
        <H1NoBackground variant="h4" component="h2" align="center">
          {t("teachingTitle")}
        </H1NoBackground>
        <TextBlock>{t("teachingText")}</TextBlock>
        <TextBlock>{t("teachingText2")}</TextBlock>
        <TextBlock>{t("teachingText3")}</TextBlock>
      </ContentBlock>
      <ContentBlock>
        <BookOpenIcon css={iconStyle} />
        <H1NoBackground variant="h4" component="h2" align="center">
          {t("organizeTitle")}
        </H1NoBackground>
        <TextBlock>{t("organizeText")}</TextBlock>
        <TextBlock>{t("organizeText2")}</TextBlock>
        <TextBlock>{t("organizeText3")}</TextBlock>
      </ContentBlock>
      <ContentBlock>
        <LaptopIcon css={iconStyle} />
        <H1NoBackground variant="h4" component="h2" align="center">
          {t("tmcTitle")}
        </H1NoBackground>
        <TextBlock>{t("tmcText")}</TextBlock>
        <TextBlock>{t("tmcText2")}</TextBlock>
      </ContentBlock>
      <ContentBlock>
        <PlusSquareIcon css={iconStyle} />
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
            <UserFriendsIcon css={iconStyle} />
            <H1NoBackground variant="h4" component="h2" align="center">
              {t("teachingTipsTitle")}
            </H1NoBackground>
            <TextBlock>{t("teachingTips")}</TextBlock>
            <TextBlock>{t("teachingTips2")}</TextBlock>
            <TextBlock>{t("teachingTips3")}</TextBlock>
          </ContentBlock>
          <ContentBlock>
            <BookIcon css={iconStyle} />
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
        <CommentsIcon css={iconStyle} />
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

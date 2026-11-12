import { styled } from "@mui/material/styles"

import ContentWrapper from "../Common/ContentWrapper"
import {
  IntroductionDescription,
  IntroductionTitle,
} from "../Common/Introduction"
import { useTranslator } from "/hooks/useTranslator"
import HomeTranslations from "/translations/home"

const CHATBOT_EMBED_URL =
  "https://courses.mooc.fi/chatbot-embed/60312c59-cd8f-415c-900f-a9b329d6a5fa"

const Layout = styled("div")(
  ({ theme }) => `
  display: grid;
  gap: 1.5rem;
  padding: 2.5rem 0 0;

  ${theme.breakpoints.up("md")} {
    grid-template-columns: 1fr 1fr;
    column-gap: 24px;
    align-items: start;
    padding: 4rem 0 0;
  }
`,
)

// Doubled selector so these beat IntroductionTitle's breakpoint padding/margins.
const Title = styled(IntroductionTitle)`
  && {
    margin: 0 0 1rem;
    padding: 0;
  }
`

const Description = styled(IntroductionDescription)`
  && {
    margin: 0;
  }
`

const ChatbotFrame = styled("iframe")(
  ({ theme }) => `
  display: block;
  width: 100%;
  height: clamp(480px, 80svh, 720px);
  border: 0;

  ${theme.breakpoints.up("md")} {
    /* 180px leaves room for the sticky site header */
    height: clamp(520px, calc(100svh - 180px), 800px);
  }
`,
)

/** Front page section embedding the course recommender chatbot from courses.mooc.fi. */
function CourseRecommender() {
  const t = useTranslator(HomeTranslations)

  return (
    <section id="course-recommender">
      <ContentWrapper>
        <Layout>
          <div>
            <Title>{t("courseRecommenderTitle")}</Title>
            <Description>{t("courseRecommenderDescription")}</Description>
          </div>
          <ChatbotFrame
            title={t("courseRecommenderTitle")}
            src={CHATBOT_EMBED_URL}
          />
        </Layout>
      </ContentWrapper>
    </section>
  )
}

export default CourseRecommender

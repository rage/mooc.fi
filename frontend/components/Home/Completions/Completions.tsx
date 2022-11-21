import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { RegularContainer as Container } from "/components/Container"
import { CompletionListItem } from "/components/Home/Completions"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"

import { CompletionDetailedFieldsWithCourseFragment } from "/graphql/generated"

export interface CompletionsProps {
  completions?: CompletionDetailedFieldsWithCourseFragment[] | null
}

const Title = styled(Typography)`
  font-family: "Open Sans Condensed", sans-serif !important;
  margin-top: 7rem;
  margin-left: 2rem;
  margin-bottom: 1rem;
  @media (min-width: 320px) {
    font-size: 46px;
  }
  @media (min-width: 600px) {
    font-size: 56px;
  }
  @media (min-width: 960px) {
    font-size: 72px;
  }
` as typeof Typography

export const Completions = ({ completions }: CompletionsProps) => {
  const t = useTranslator(ProfileTranslations)

  return (
    <section>
      <Title component="h1" variant="h2" align="center">
        {t("completionsTitle")}
      </Title>

      <Container style={{ maxWidth: 900 }}>
        {completions?.map((completion) => (
          <CompletionListItem
            key={`completion-${completion.id}`}
            course={completion.course!}
            completion={completion}
          />
        )) ?? <Typography>{t("nocompletionsText")}</Typography>}
      </Container>
    </section>
  )
}

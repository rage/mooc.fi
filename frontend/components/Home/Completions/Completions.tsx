import { RegularContainer as Container } from "/components/Container"
import { CompletionListItem } from "/components/Home/Completions"
import { ProfileUserOverView_currentUser_completions } from "/static/types/generated/ProfileUserOverView"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"
import { gql } from "@apollo/client"
import styled from "@emotion/styled"
import { Typography } from "@mui/material"

const completionsFragment = gql`
  fragment UserCompletions on User {
    completions {
      id
      completion_language
      student_number
      created_at
      tier
      eligible_for_ects
      completion_date
      course {
        id
        slug
        name
        photo {
          id
          uncompressed
        }
        has_certificate
      }
      completions_registered {
        id
        created_at
        organization {
          slug
        }
      }
    }
  }
`

export interface CompletionsProps {
  completions: ProfileUserOverView_currentUser_completions[]
}

const Title = styled(Typography)<any>`
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
`

export const Completions = ({ completions = [] }: CompletionsProps) => {
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

Completions.fragments = {
  completions: completionsFragment,
}

import { ProfileUserOverView_currentUser_completions } from "/static/types/generated/ProfileUserOverView"
import { RegularContainer as Container } from "/components/Container"
import { Typography } from "@material-ui/core"
import styled from "styled-components"
import { gql } from "@apollo/client"
import ProfileTranslations from "/translations/profile"
import CompletionListItem from "/components/CompletionListItem"
import { useTranslator } from "/util/useTranslator"

const completionsFragment = gql`
  fragment UserCompletions on User {
    completions {
      id
      completion_language
      student_number
      created_at
      tier
      eligible_for_ects
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

const Completions = (props: CompletionsProps) => {
  const t = useTranslator(ProfileTranslations)
  const completions = props.completions || []

  return (
    <section>
      <Title component="h1" variant="h2" align="center">
        {t("completionsTitle")}
      </Title>

      <Container style={{ maxWidth: 900 }}>
        {completions?.map((c) => (
          <CompletionListItem key={`completion-${c.id}`} listItem={c} />
        )) ?? <Typography>{t("nocompletionsText")}</Typography>}
      </Container>
    </section>
  )
}

Completions.fragments = {
  completions: completionsFragment,
}
export default Completions

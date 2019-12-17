import * as React from "react"
import { ProfileUserOverView_currentUser_completions } from "/static/types/generated/ProfileUserOverView"
import { RegularContainer as Container } from "/components/Container"
import { Typography } from "@material-ui/core"
import styled from "styled-components"
import { gql } from "apollo-boost"
import LanguageContext from "/contexes/LanguageContext"
import getProfileTranslator from "/translations/profile"
import { useContext } from "react"
import CompletionListItem from "/components/CompletionListItem"

const completionsFragment = gql`
  fragment UserCompletions on User {
    completions {
      id
      completion_language
      student_number
      created_at
      course {
        id
        slug
        name
        photo {
          id
          uncompressed
        }
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
`
const Completions = (props: CompletionsProps) => {
  const lng = useContext(LanguageContext)
  const t = getProfileTranslator(lng.language)
  const completions = props.completions || []

  return (
    <section>
      <Title component="h1" variant="h2" align="center">
        {t("completionsTitle")}
      </Title>

      <Container style={{ maxWidth: 900 }}>
        {completions?.map(c => (
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

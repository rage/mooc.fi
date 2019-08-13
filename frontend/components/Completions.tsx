import * as React from "react"
import { UserOverView_currentUser_completions } from "/static/types/generated/UserOverView"
import NextI18Next from "../i18n"
import { Container } from "next/app"
import { Grid, Typography } from "@material-ui/core"
import CompletedCourseCard from "./CompletedCourseCard"
import styled from "styled-components"
import { gql } from "apollo-boost"

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
  completions: UserOverView_currentUser_completions[]
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
  const { t } = NextI18Next.useTranslation("profile")

  const completions = props.completions || []

  return (
    <section>
      <Title component="h1" variant="h2" align="center">
        {t("completionsTitle")}
      </Title>

      <Container>
        <Typography component="p" variant="h5" style={{ marginBottom: "1rem" }}>
          {t("completionNB")}
        </Typography>
        <Grid container spacing={2}>
          {completions.length > 0 ? (
            completions.map(c => (
              <CompletedCourseCard key={`completion-${c.id}`} completion={c} />
            ))
          ) : (
            <Typography>{t("nocompletionsText")}</Typography>
          )}
        </Grid>
      </Container>
    </section>
  )
}

Completions.fragments = {
  completions: completionsFragment,
}
export default Completions

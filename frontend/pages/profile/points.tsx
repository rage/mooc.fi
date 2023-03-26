import { useQuery } from "@apollo/client"

import Container from "/components/Container"
import { H1NoBackground } from "/components/Text/headers"
import PointsList from "/components/User/Points/PointsList"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useTranslator } from "/hooks/useTranslator"
import withSignedIn from "/lib/with-signed-in"
import CoursesTranslations from "/translations/courses"

import { CurrentUserProgressesDocument } from "/graphql/generated"

function Points() {
  const t = useTranslator(CoursesTranslations)
  const { data, error, loading } = useQuery(CurrentUserProgressesDocument)

  useBreadcrumbs([
    {
      translation: "profile",
      href: "/profile",
    },
    {
      translation: "profilePoints",
      href: `/profile/points`,
    },
  ])

  return (
    <section>
      <Container>
        <H1NoBackground variant="h1" component="h1" align="center">
          {t("points")}
        </H1NoBackground>
        <PointsList data={data} error={error} loading={loading} />
      </Container>
    </section>
  )
}

export default withSignedIn(Points)

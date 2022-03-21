import Container from "/components/Container"
import PointsList from "/components/User/Points/PointsList"
import { H1NoBackground } from "/components/Text/headers"
import withSignedIn from "/lib/with-signed-in"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"

function Points() {
  const t = useTranslator(CoursesTranslations)

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
        <PointsList />
      </Container>
    </section>
  )
}

export default withSignedIn(Points)

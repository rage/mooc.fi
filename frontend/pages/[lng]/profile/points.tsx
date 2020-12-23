import Container from "/components/Container"
import PointsList from "/components/User/Points/PointsList"
import { H1NoBackground } from "/components/Text/headers"
import withSignedIn from "/lib/with-signed-in"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/translations"

function Points() {
  const t = useTranslator(CoursesTranslations)
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

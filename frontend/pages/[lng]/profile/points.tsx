import React, { useContext } from "react"
import Container from "/components/Container"
import PointsList from "/components/User/Points/PointsList"
import { H1NoBackground } from "/components/Text/headers"
import withSignedIn from "/lib/with-signed-in"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"

function Points() {
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)

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

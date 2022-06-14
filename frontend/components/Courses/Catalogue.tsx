import styled from "@emotion/styled"
import CourseGrid from "./CourseGrid"
import { useTranslator } from "/util/useTranslator"
import CoursesTranslations from "/translations/_new/courses"

const Container = styled.div`
  display: grid;
  justify-items: center;
`

function Catalogue() {
  const t = useTranslator(CoursesTranslations)

  return (
    <Container>
      <h2>{t("coursesHeader")}</h2>
      <CourseGrid />
    </Container>
  )
}

export default Catalogue

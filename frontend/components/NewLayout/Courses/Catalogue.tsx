import { styled } from "@mui/material/styles"

import Introduction from "../Common/Introduction"
import CourseGrid from "./CourseGrid"
import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/_new/courses"

const Container = styled("section")`
  /**/
`

function Catalogue() {
  const t = useTranslator(CoursesTranslations)

  return (
    <Container>
      <Introduction title={t("coursesHeader")} />
      <CourseGrid />
    </Container>
  )
}

export default Catalogue

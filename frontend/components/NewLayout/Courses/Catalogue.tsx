import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import CourseGrid from "./CourseGrid"
import CoursesTranslations from "/translations/_new/courses"
import { useTranslator } from "/util/useTranslator"

const Container = styled("section")`
  display: grid;
  justify-items: center;
`

function Catalogue() {
  const t = useTranslator(CoursesTranslations)

  return (
    <Container>
      <Typography variant="h2">{t("coursesHeader")}</Typography>
      <CourseGrid />
    </Container>
  )
}

export default Catalogue

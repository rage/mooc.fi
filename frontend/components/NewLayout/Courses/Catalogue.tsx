import styled from "@emotion/styled"
import { Typography } from "@mui/material"

import CourseGrid from "./CourseGrid"
import CoursesTranslations from "/translations/_new/courses"
import { useTranslator } from "/util/useTranslator"

const Container = styled.div`
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

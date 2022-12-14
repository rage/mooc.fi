import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import CourseGrid from "./CourseGrid"
import CoursesTranslations from "/translations/_new/courses"
import { useTranslator } from "/util/useTranslator"

const Container = styled("section")`
  display: grid;
  justify-items: center;
`

const Header = styled(Typography)`
  background: #f5f6f7;
  padding: 1rem;
`

function Catalogue() {
  const t = useTranslator(CoursesTranslations)

  return (
    <Container>
      <Header variant="h2">{t("coursesHeader")}</Header>
      <CourseGrid />
    </Container>
  )
}

export default Catalogue

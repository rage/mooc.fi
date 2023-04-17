import { useState } from "react"

import { Button, Grid } from "@mui/material"
import { styled } from "@mui/material/styles"

import ModuleSmallCourseCard from "../ModuleSmallCourseCard"
import { useTranslator } from "/hooks/useTranslator"
import HomeTranslations from "/translations/home"

import { CourseFieldsFragment, CourseStatus } from "/graphql/generated"

interface CourseListProps {
  courses: CourseFieldsFragment[]
}

export const ThreeOrLessCoursesListing = (props: CourseListProps) => {
  const { courses } = props
  return (
    <Grid container spacing={3}>
      {courses.map((course) => (
        <ModuleSmallCourseCard
          key={course.id}
          course={course}
          showHeader={true}
        />
      ))}
    </Grid>
  )
}

const ShowMoreButton = styled(Button)`
  font-size: 21px;
  margin: 1rem;
  background-color: #265495 !important;
  width: 80%;
  margin-left: 10%;
  margin-top: 2rem;
`

const ModuleCoursesListing = (props: CourseListProps) => {
  const { courses } = props
  const [showAll, setShowAll] = useState(false)
  const t = useTranslator(HomeTranslations)

  const activeCourses = courses.filter((c) => c.status == CourseStatus.Active)
  return (
    <>
      {showAll || activeCourses.length === 0 ? (
        <ThreeOrLessCoursesListing courses={courses} />
      ) : (
        <ThreeOrLessCoursesListing courses={activeCourses.slice(0, 3)} />
      )}
      {activeCourses.length ? (
        <ShowMoreButton
          fullWidth={true}
          variant="contained"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? t("showLimited") : t("showAll")}
        </ShowMoreButton>
      ) : null}
    </>
  )
}

export default ModuleCoursesListing

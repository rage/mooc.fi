import React, { useState, useContext } from "react"
import { AllCourses_courses as CourseData } from "/static/types/generated/AllCourses"
import { Grid, Button } from "@material-ui/core"
import ModuleSmallCourseCard from "../ModuleSmallCourseCard"
import styled from "styled-components"
import LanguageContext from "/contexes/LanguageContext"
import getHomeTranslator from "/translations/home"
import { CourseStatus } from "/static/types/globalTypes"

interface CourseListProps {
  courses: CourseData[]
}

export const ThreeOrLessCoursesListing = (props: CourseListProps) => {
  const { courses } = props
  return (
    <Grid container spacing={3}>
      {courses.map(course => (
        <ModuleSmallCourseCard
          key={`module-course-${course.id}`}
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
  const lngCtx = useContext(LanguageContext)
  const t = getHomeTranslator(lngCtx.language)

  return (
    <>
      {showAll ? (
        <ThreeOrLessCoursesListing courses={courses} />
      ) : (
        <ThreeOrLessCoursesListing
          courses={courses
            .slice(0, 3)
            .filter(c => c.status === CourseStatus.Active)}
        />
      )}
      <ShowMoreButton
        fullWidth={true}
        variant="contained"
        onClick={() => setShowAll(!showAll)}
      >
        {showAll ? t("showLimited") : t("showAll")}
      </ShowMoreButton>
    </>
  )
}

export default ModuleCoursesListing

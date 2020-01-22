import React, { useContext } from "react"
import { AllCourses_courses as CourseData } from "/static/types/generated/AllCourses"
import { ContentContainer } from "/components/Home/ModuleDisplay/ModuleDescription"
import { H2Background } from "/components/Text/headers"
import styled from "styled-components"
import ModuleCoursesListing, {
  ThreeOrLessCoursesListing,
} from "/components/Home/ModuleDisplay/ModuleCourseCardList"
import LanguageContext from "/contexes/LanguageContext"
import getHomeTranslator from "/translations/home"

const CoursesListContainer = styled(ContentContainer)`
  margin-top: 2rem;
  margin-left: 2rem;
  padding-top: 1rem;
  padding-left: 1rem;
`
const CoursesListTitle = styled(H2Background)`
  font-weight: 300;
  margin-top: 1rem;
  margin-bottom: 3rem;
`
interface ModuleCoursesProps {
  courses: CourseData[]
}

const ModuleCoursesDisplay = (props: ModuleCoursesProps) => {
  const { courses } = props
  const dontLimitShownCourses = courses.length <= 3
  const lngCtx = useContext(LanguageContext)
  const t = getHomeTranslator(lngCtx.language)

  return (
    <CoursesListContainer>
      <CoursesListTitle
        fontcolor="black"
        titlebackground="white"
        variant="h3"
        component="h3"
      >
        {t("moduleCourseTitle")}
      </CoursesListTitle>
      {dontLimitShownCourses ? (
        <ThreeOrLessCoursesListing courses={courses} />
      ) : (
        <ModuleCoursesListing courses={courses} />
      )}
    </CoursesListContainer>
  )
}

export default ModuleCoursesDisplay

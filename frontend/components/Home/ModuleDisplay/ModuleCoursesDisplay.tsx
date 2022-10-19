import { styled } from "@mui/material/styles"

import ModuleCoursesListing, {
  ThreeOrLessCoursesListing,
} from "/components/Home/ModuleDisplay/ModuleCourseCardList"
import { H2Background } from "/components/Text/headers"
import HomeTranslations from "/translations/home"
import { useTranslator } from "/util/useTranslator"

import { CourseFieldsFragment, CourseStatus } from "/graphql/generated"

const CoursesListContainer = styled("div")`
  margin: 2rem 2em 2em 2rem;
  padding: 1rem;
  min-width: 33%;
`
const CoursesListTitle = styled(H2Background)`
  font-weight: 300;
  margin-top: 1rem;
  margin-bottom: 3rem;
`
interface ModuleCoursesProps {
  courses: CourseFieldsFragment[]
}

const ModuleCoursesDisplay = (props: ModuleCoursesProps) => {
  const { courses } = props
  const dontLimitShownCourses =
    courses.length <= 3 ||
    courses.every((c) => c.status === CourseStatus.Active)
  const t = useTranslator(HomeTranslations)

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

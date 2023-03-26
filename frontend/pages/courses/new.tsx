import { useMemo } from "react"

import { styled } from "@mui/material/styles"

import CourseEdit2 from "../../components/Dashboard/Editor/Course"
import CourseEdit from "../../components/Dashboard/EditorLegacy/Course"
import FormSkeleton from "../../components/Dashboard/EditorLegacy/FormSkeleton"
import { WideContainer } from "/components/Container"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1NoBackground } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useEditorCourses } from "/hooks/useEditorCourses"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withAdmin from "/lib/with-admin"
import CoursesTranslations from "/translations/courses"
import { stripId } from "/util/stripId"

const ContainerBackground = styled("section")`
  background-color: #e9fef8;
`

const NewCourse = () => {
  const t = useTranslator(CoursesTranslations)

  const clone = useQueryParameter("clone", false)
  const legacy = useQueryParameter("legacy", false)

  const { loading, error, coursesData, studyModulesData, courseData } =
    useEditorCourses({
      slug: clone,
    })

  useBreadcrumbs([
    {
      translation: "courses",
      href: `/courses`,
    },
    {
      translation: "courseNew",
      href: `/courses/new`,
    },
  ])

  const clonedCourse = useMemo(() => {
    if (!courseData?.course) {
      return undefined
    }

    return { ...stripId(courseData.course), slug: "" }
  }, [courseData])

  if (error) {
    return <ModifiableErrorMessage errorMessage={JSON.stringify(error)} />
  }

  return (
    <ContainerBackground>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          {t("createCourse")}
        </H1NoBackground>
        {loading ? (
          <FormSkeleton />
        ) : legacy ? (
          <CourseEdit
            {...(clonedCourse ? { course: clonedCourse } : {})}
            modules={studyModulesData?.study_modules}
            courses={coursesData?.courses}
          />
        ) : (
          <CourseEdit2
            {...(clonedCourse ? { course: clonedCourse } : {})}
            courses={coursesData?.courses ?? []}
            studyModules={studyModulesData?.study_modules ?? []}
          />
        )}
      </WideContainer>
    </ContainerBackground>
  )
}

export default withAdmin(NewCourse)

import { useMemo } from "react"

import { WideContainer } from "/components/Container"
import CourseEdit2 from "/components/Dashboard/Editor2/Course"
import CourseEdit from "/components/Dashboard/Editor/Course"
import FormSkeleton from "/components/Dashboard/Editor/FormSkeleton"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1NoBackground } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useEditorCourses } from "/hooks/useEditorCourses"
import withAdmin from "/lib/with-admin"
import CoursesTranslations from "/translations/courses"
import { stripId } from "/util/stripId"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"

const NewCourse = () => {
  const t = useTranslator(CoursesTranslations)

  const clone = useQueryParameter("clone", false)
  const beta = useQueryParameter("beta", false)

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
    <section>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          {t("createCourse")}
        </H1NoBackground>
        {loading ? (
          <FormSkeleton />
        ) : beta ? (
          <CourseEdit2
            {...(clonedCourse ? { course: clonedCourse } : {})}
            courses={coursesData?.courses ?? []}
            studyModules={studyModulesData?.study_modules ?? []}
          />
        ) : (
          <CourseEdit
            {...(clonedCourse ? { course: clonedCourse } : {})}
            modules={studyModulesData?.study_modules}
            courses={coursesData?.courses}
          />
        )}
      </WideContainer>
    </section>
  )
}

export default withAdmin(NewCourse)

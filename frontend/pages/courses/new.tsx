import { useEffect, useState } from "react"

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
import notEmpty from "/util/notEmpty"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"

import { CourseEditorDetailsQuery } from "/graphql/generated"

function stripId<T>(data: T): T {
  if (data === null || data === undefined) return data

  return Object.entries(data).reduce(
    (acc: any, [key, value]: [string, any]) => {
      if (key === "id") return { ...acc }
      if (Array.isArray(value)) return { ...acc, [key]: value.map(stripId) }
      if (typeof value === "object") return { ...acc, [key]: stripId(value) }

      return { ...acc, [key]: value }
    },
    {} as T,
  )
}

const NewCourse = () => {
  const t = useTranslator(CoursesTranslations)

  const [clonedCourse, setClonedCourse] = useState<
    CourseEditorDetailsQuery["course"] | undefined
  >(undefined)
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

  useEffect(() => {
    if (!courseData?.course) {
      return
    }

    // TODO: needs the photo import logic
    setClonedCourse({ ...stripId(courseData.course), slug: "" })
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
            {...(clone ? { course: clonedCourse ?? undefined } : {})}
            courses={coursesData?.courses?.filter(notEmpty)}
            studyModules={studyModulesData?.study_modules?.filter(notEmpty)}
          />
        ) : (
          <CourseEdit
            {...(clone ? { course: clonedCourse ?? undefined } : {})}
            modules={studyModulesData?.study_modules?.filter(notEmpty)}
            courses={coursesData?.courses?.filter(notEmpty)}
          />
        )}
      </WideContainer>
    </section>
  )
}

export default withAdmin(NewCourse)

import { useEffect, useState } from "react"
import { WideContainer } from "/components/Container"
import { useQuery } from "@apollo/client"
import CourseEdit from "/components/Dashboard/Editor/Course"
import CourseEdit2 from "/components/Dashboard/Editor2/Course"
import FormSkeleton from "/components/Dashboard/Editor/FormSkeleton"
import { H1NoBackground } from "/components/Text/headers"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import withAdmin from "/lib/with-admin"
import CoursesTranslations from "/translations/courses"
import { CourseEditorStudyModules } from "/static/types/generated/CourseEditorStudyModules"
import {
  CourseEditorStudyModuleQuery,
  CourseEditorCoursesQuery,
} from "/graphql/queries/courses"
import { CourseEditorCourses } from "/static/types/generated/CourseEditorCourses"
import notEmpty from "/util/notEmpty"
import { useQueryParameter } from "/util/useQueryParameter"
import { CourseQuery } from "/pages/[lng]/courses/[slug]/edit"
import {
  CourseDetails,
  CourseDetails_course,
} from "/static/types/generated/CourseDetails"
import { useTranslator } from "/util/useTranslator"

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
    CourseDetails_course | undefined
  >(undefined)
  const clone = useQueryParameter("clone", false)

  console.log("clone?", clone)
  const {
    data: studyModulesData,
    loading: studyModulesLoading,
    error: studyModulesError,
  } = useQuery<CourseEditorStudyModules>(CourseEditorStudyModuleQuery)
  const {
    data: coursesData,
    loading: coursesLoading,
    error: coursesError,
  } = useQuery<CourseEditorCourses>(CourseEditorCoursesQuery)
  const {
    data: courseData,
    loading: courseLoading,
    // @ts-ignore: for now
    error: courseError,
  } = useQuery<CourseDetails>(CourseQuery, {
    variables: { slug: clone },
  })

  useEffect(() => {
    if (!courseData?.course) {
      return
    }

    console.log(courseData)
    // TODO: needs the photo import logic
    setClonedCourse(stripId(courseData.course))
  }, [courseData])

  console.log("clonedCourse", clonedCourse)
  if (studyModulesError || coursesError) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(studyModulesError || coursesError)}
      />
    )
  }

  return (
    <section>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          {t("createCourse")}
        </H1NoBackground>
        {studyModulesLoading || coursesLoading || courseLoading ? (
          <FormSkeleton />
        ) : (
          /*<CourseEdit
              {...(clone ? { course: clonedCourse } : {})}
              modules={studyModulesData?.study_modules?.filter(notEmpty)}
              courses={coursesData?.courses?.filter(notEmpty)}
            />*/
          <CourseEdit
            {...(clone ? { course: clonedCourse } : {})}
            modules={studyModulesData?.study_modules?.filter(notEmpty)}
            //studyModules={studyModulesData?.study_modules?.filter(notEmpty)}
            courses={coursesData?.courses?.filter(notEmpty)}
          />
        )}
      </WideContainer>
    </section>
  )
}

export default withAdmin(NewCourse)

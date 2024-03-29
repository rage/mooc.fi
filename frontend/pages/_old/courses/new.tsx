import { useCallback } from "react"

import dynamic from "next/dynamic"

import { styled } from "@mui/material/styles"

import FormSkeleton from "../../../components/Dashboard/EditorLegacy/FormSkeleton"
import { WideContainer } from "/components/Container"
import { CourseEditorDataProvider } from "/components/Dashboard/Editor/Course/CourseEditorDataContext"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1NoBackground } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useEditorCourses } from "/hooks/useEditorCourses"
import useIsOld from "/hooks/useIsOld"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withAdmin from "/lib/with-admin"
import CoursesTranslations from "/translations/courses"

const ContainerBackground = styled("section")`
  background-color: #e9fef8;
`

const CourseEdit = dynamic(
  () => import("../../../components/Dashboard/Editor/Course"),
  { loading: () => <FormSkeleton /> },
)
const LegacyCourseEdit = dynamic(
  () => import("../../../components/Dashboard/EditorLegacy/Course"),
  { loading: () => <FormSkeleton /> },
)

const NewCourse = () => {
  const t = useTranslator(CoursesTranslations)
  const isOld = useIsOld()
  const baseUrl = isOld ? "/_old" : "/admin"

  const clone = useQueryParameter("clone", { enforce: false })
  const legacy = useQueryParameter("legacy", { enforce: false })

  const { loading, error, data } = useEditorCourses({
    slug: clone,
    isClone: Boolean(clone),
  })
  const { course, studyModules, courses, tags } = data ?? {}

  useBreadcrumbs([
    {
      translation: "courses",
      href: `${baseUrl}/courses`,
    },
    {
      translation: "courseNew",
      href: `${baseUrl}/courses/new`,
    },
  ])

  const EditorComponent = useCallback(() => {
    if (legacy) {
      return (
        <LegacyCourseEdit
          {...(Boolean(clone) && course ? { course } : {})}
          courses={courses}
          modules={studyModules}
        />
      )
    }

    return <CourseEdit />
  }, [course, courses, studyModules, tags, legacy])

  if (error) {
    return <ModifiableErrorMessage errorMessage={JSON.stringify(error)} />
  }

  return (
    <ContainerBackground>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          {t("createCourse")}
        </H1NoBackground>
        {loading && <FormSkeleton />}
        <CourseEditorDataProvider value={data}>
          {!loading && <EditorComponent />}
        </CourseEditorDataProvider>
      </WideContainer>
    </ContainerBackground>
  )
}

export default withAdmin(NewCourse)

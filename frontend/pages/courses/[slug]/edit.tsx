import { useCallback, useEffect } from "react"

import { NextSeo } from "next-seo"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import { Link, Paper, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import FormSkeleton from "../../../components/Dashboard/EditorLegacy/FormSkeleton"
import { WideContainer } from "/components/Container"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import { CourseEditorDataProvider } from "/components/Dashboard/Editor/Course/CourseEditorDataContext"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1Background } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useEditorCourses } from "/hooks/useEditorCourses"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withAdmin from "/lib/with-admin"
import CoursesTranslations from "/translations/courses"

const ErrorContainer = styled(Paper)`
  padding: 1em;
`

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

const EditCourse = () => {
  const t = useTranslator(CoursesTranslations)
  const slug = useQueryParameter("slug") ?? ""
  const legacy = useQueryParameter("legacy", { enforce: false })
  const router = useRouter()
  const { loading, error, data } = useEditorCourses({
    slug,
  })
  const { course, studyModules, courses, tags } = data ?? {}

  useEffect(() => {
    let redirectTimeout: NodeJS.Timeout | null = null

    if (typeof window === "undefined") {
      return
    }

    if (!loading && !course) {
      redirectTimeout = setTimeout(
        () => router.push("/courses", undefined, { shallow: true }),
        5000,
      )
    }

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout)
      }
    }
  }, [loading, course])

  useBreadcrumbs([
    {
      translation: "courses",
      href: `/courses`,
    },
    {
      label: error || (!loading && !course) ? slug : course?.name,
      href: `/courses/${slug}`,
    },
    {
      translation: "courseEdit",
      href: `/courses/${slug}/edit`,
    },
  ])

  const title = !loading && !course ? slug : course?.name ?? "..."

  const EditorComponent = useCallback(() => {
    if (!course) {
      return null
    }

    if (legacy) {
      return (
        <LegacyCourseEdit
          course={course}
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
    <>
      <NextSeo title={title} />
      <ContainerBackground>
        <DashboardTabBar slug={slug} selectedValue={3} />
        <WideContainer>
          <H1Background component="h1" variant="h1" align="center">
            {t("editCourse")}
          </H1Background>
          {loading && <FormSkeleton />}
          <CourseEditorDataProvider value={data}>
            {!loading && course && <EditorComponent />}
          </CourseEditorDataProvider>
          {!loading && !course && (
            <ErrorContainer elevation={2}>
              <Typography variant="body1">
                {t("courseWithIdNotFound", { slug })}
              </Typography>
              <Typography variant="body2">
                {t("redirectMessagePre")}
                <Link href="/courses">{t("redirectLinkText")}</Link>
                {t("redirectMessagePost")}
              </Typography>
            </ErrorContainer>
          )}
        </WideContainer>
      </ContainerBackground>
    </>
  )
}

export default withAdmin(EditCourse)

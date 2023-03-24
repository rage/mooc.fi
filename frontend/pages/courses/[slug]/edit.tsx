import { useCallback, useEffect } from "react"

import { NextSeo } from "next-seo"
import dynamic from "next/dynamic"
import { SingletonRouter, withRouter } from "next/router"

import { Link, Paper, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import FormSkeleton from "../../../components/Dashboard/EditorLegacy/FormSkeleton"
import { WideContainer } from "/components/Container"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1Background } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useEditorCourses } from "/hooks/useEditorCourses"
import useSubtitle from "/hooks/useSubtitle"
import withAdmin from "/lib/with-admin"
import CoursesTranslations from "/translations/courses"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"

const ErrorContainer = styled(Paper)`
  padding: 1em;
`

const ContainerBackground = styled("section")`
  background-color: #e9fef8;
`
interface EditCourseProps {
  router: SingletonRouter
}

const CourseEdit = dynamic(
  () => import("../../../components/Dashboard/Editor/Course"),
  { loading: () => <FormSkeleton /> },
)
const LegacyCourseEdit = dynamic(
  () => import("../../../components/Dashboard/EditorLegacy/Course"),
  { loading: () => <FormSkeleton /> },
)

const EditCourse = ({ router }: EditCourseProps) => {
  const t = useTranslator(CoursesTranslations)
  const slug = useQueryParameter("slug") ?? ""
  const legacy = useQueryParameter("legacy", false)

  const {
    loading,
    error,
    courseData,
    studyModulesData,
    coursesData,
    tagsData,
  } = useEditorCourses({
    slug,
  })

  useEffect(() => {
    let redirectTimeout: NodeJS.Timeout | null = null

    if (typeof window === "undefined") {
      return
    }

    if (!loading && !courseData?.course) {
      redirectTimeout = setTimeout(
        () => router.push(listLink, undefined, { shallow: true }),
        5000,
      )
    }

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout)
      }
    }
  }, [loading, courseData])

  useBreadcrumbs([
    {
      translation: "courses",
      href: `/courses`,
    },
    {
      label:
        error || (!loading && !courseData?.course)
          ? slug
          : courseData?.course?.name,
      href: `/courses/${slug}`,
    },
    {
      translation: "courseEdit",
      href: `/courses/${slug}/edit`,
    },
  ])

  const title = useSubtitle(
    !loading && !courseData?.course ? slug : courseData?.course?.name,
  )

  const EditorComponent = useCallback(() => {
    if (!courseData?.course) {
      return null
    }

    if (legacy) {
      return (
        <LegacyCourseEdit
          course={courseData.course}
          courses={coursesData?.courses ?? []}
          modules={studyModulesData?.study_modules ?? []}
        />
      )
    }

    return (
      <CourseEdit
        course={courseData.course}
        courses={coursesData?.courses ?? []}
        studyModules={studyModulesData?.study_modules ?? []}
        tags={tagsData?.tags ?? []}
      />
    )
  }, [courseData, coursesData, studyModulesData, tagsData, legacy])

  if (error) {
    return <ModifiableErrorMessage errorMessage={JSON.stringify(error)} />
  }

  const listLink = "/courses"

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
          {courseData?.course && (
            <CourseEdit
              course={courseData.course}
              courses={coursesData?.courses ?? []}
              studyModules={studyModulesData?.study_modules ?? []}
              tags={tagsData?.tags ?? []}
            />
          )}
          {!loading && !courseData?.course && (
            <ErrorContainer elevation={2}>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{
                  __html: t("courseWithIdNotFound", { slug }),
                }}
              />
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

export default withRouter(withAdmin(EditCourse) as any)

import { useEffect } from "react"

import { NextSeo } from "next-seo"
import Link from "next/link"
import { SingletonRouter, withRouter } from "next/router"

import Paper from "@mui/material/Paper"
import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"

import { WideContainer } from "/components/Container"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import CourseEdit2 from "/components/Dashboard/Editor2/Course"
import CourseEdit from "/components/Dashboard/Editor/Course"
import FormSkeleton from "/components/Dashboard/Editor/FormSkeleton"
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

interface EditCourseProps {
  router: SingletonRouter
}

const EditCourse = ({ router }: EditCourseProps) => {
  const t = useTranslator(CoursesTranslations)
  const slug = useQueryParameter("slug") ?? ""
  const beta = useQueryParameter("beta", false)

  const { loading, error, courseData, studyModulesData, coursesData } =
    useEditorCourses({
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
      label: courseData?.course?.name,
      href: `/courses/${slug}`,
    },
    {
      translation: "courseEdit",
      href: `/courses/${slug}/edit`,
    },
  ])
  const title = useSubtitle(courseData?.course?.name)

  if (error) {
    return <ModifiableErrorMessage errorMessage={JSON.stringify(error)} />
  }

  const listLink = "/courses"

  return (
    <>
      <NextSeo title={title} />
      <section style={{ backgroundColor: "#E9FEF8" }}>
        <DashboardTabBar slug={slug} selectedValue={3} />
        <WideContainer>
          <H1Background component="h1" variant="h1" align="center">
            {t("editCourse")}
          </H1Background>
          {loading ? (
            <FormSkeleton />
          ) : courseData?.course ? (
            beta ? (
              <CourseEdit2
                course={courseData.course}
                courses={coursesData?.courses}
                studyModules={studyModulesData?.study_modules}
              />
            ) : (
              <CourseEdit
                course={courseData.course}
                courses={coursesData?.courses ?? []}
                modules={studyModulesData?.study_modules ?? []}
              />
            )
          ) : (
            <ErrorContainer elevation={2}>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{
                  __html: t("courseWithIdNotFound", { slug }),
                }}
              />
              <Typography variant="body2">
                {t("redirectMessagePre")}
                <Link href="/courses" passHref>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a>{t("redirectLinkText")}</a>
                </Link>
                {t("redirectMessagePost")}
              </Typography>
            </ErrorContainer>
          )}
        </WideContainer>
      </section>
    </>
  )
}

export default withRouter(withAdmin(EditCourse) as any)

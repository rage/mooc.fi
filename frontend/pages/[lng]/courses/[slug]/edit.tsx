import { useContext, useEffect } from "react"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import { WideContainer } from "/components/Container"
import { withRouter, SingletonRouter } from "next/router"
import styled from "@emotion/styled"
import CourseEdit from "/components/Dashboard/Editor/Course"
import LangLink from "/components/LangLink"
import LanguageContext from "/contexts/LanguageContext"
import FormSkeleton from "/components/Dashboard/Editor/FormSkeleton"
import { H1Background } from "/components/Text/headers"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { useQueryParameter } from "/util/useQueryParameter"
import withAdmin from "/lib/with-admin"
import CoursesTranslations from "/translations/courses"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import notEmpty from "/util/notEmpty"
import CourseEdit2 from "/components/Dashboard/Editor2/Course"
import { useTranslator } from "/util/useTranslator"
import { useEditorCourses } from "/hooks/useEditorCourses"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"

const ErrorContainer = styled(Paper)`
  padding: 1em;
`

interface EditCourseProps {
  router: SingletonRouter
}

const EditCourse = ({ router }: EditCourseProps) => {
  const { language } = useContext(LanguageContext)
  const t = useTranslator(CoursesTranslations)
  const slug = useQueryParameter("slug") ?? ""
  const beta = useQueryParameter("beta", false)

  const {
    loading,
    error,
    courseData,
    studyModulesData,
    coursesData,
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
      label: courseData?.course?.name,
      href: `/courses/${slug}`,
    },
    {
      translation: "courseEdit",
      href: `/courses/${slug}/edit`,
    },
  ])

  if (error) {
    return <ModifiableErrorMessage errorMessage={JSON.stringify(error)} />
  }

  const listLink = `${language ? "/" + language : ""}/courses`

  return (
    <section style={{ backgroundColor: "#E9FEF8" }}>
      <DashboardTabBar slug={slug} selectedValue={4} />
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
              courses={coursesData?.courses?.filter(notEmpty)}
              studyModules={studyModulesData?.study_modules?.filter(notEmpty)}
            />
          ) : (
            <CourseEdit
              course={courseData.course}
              courses={coursesData?.courses?.filter(notEmpty)}
              modules={studyModulesData?.study_modules?.filter(notEmpty) ?? []}
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
              <LangLink href="/courses">{t("redirectLinkText")}</LangLink>
              {t("redirectMessagePost")}
            </Typography>
          </ErrorContainer>
        )}
      </WideContainer>
    </section>
  )
}

export default withRouter(withAdmin(EditCourse) as any)

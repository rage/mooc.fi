import React, { useContext } from "react"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import { WideContainer } from "/components/Container"
import { withRouter, SingletonRouter } from "next/router"
import { useQuery } from "@apollo/client"
import { gql } from "@apollo/client"
import styled from "styled-components"
import { CourseDetails } from "/static/types/generated/CourseDetails"
import CourseEdit from "/components/Dashboard/Editor/Course"
import Link from "next/link"
import LanguageContext from "/contexes/LanguageContext"
import { CourseEditorStudyModules } from "/static/types/generated/CourseEditorStudyModules"
import FormSkeleton from "/components/Dashboard/Editor/FormSkeleton"
import { H1Background } from "/components/Text/headers"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { useQueryParameter } from "/util/useQueryParameter"
import withAdmin from "/lib/with-admin"
import getCoursesTranslator from "/translations/courses"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import { CourseEditorCourses } from "/static/types/generated/CourseEditorCourses"
import {
  CourseEditorStudyModuleQuery,
  CourseEditorCoursesQuery,
} from "/graphql/queries/courses"

export const CourseQuery = gql`
  query CourseDetails($slug: String) {
    course(slug: $slug) {
      id
      name
      slug
      ects
      order
      study_module_order
      teacher_in_charge_name
      teacher_in_charge_email
      support_email
      start_date
      end_date
      photo {
        id
        compressed
        compressed_mimetype
        uncompressed
        uncompressed_mimetype
      }
      promote
      start_point
      hidden
      study_module_start_point
      status
      course_translations {
        id
        name
        language
        description
        link
      }
      open_university_registration_links {
        id
        course_code
        language
        link
      }
      study_modules {
        id
      }
      course_variants {
        id
        slug
        description
      }
      course_aliases {
        id
        course_code
      }
      inherit_settings_from {
        id
      }
      completions_handled_by {
        id
      }
      has_certificate
      user_course_settings_visibilities {
        id
        language
      }
    }
  }
`

const ErrorContainer = styled(Paper)`
  padding: 1em;
`

interface EditCourseProps {
  router: SingletonRouter
}

const EditCourse = ({ router }: EditCourseProps) => {
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)
  const slug = useQueryParameter("id") ?? ""

  let redirectTimeout: number | null = null

  const {
    data: courseData,
    loading: courseLoading,
    error: courseError,
  } = useQuery<CourseDetails>(CourseQuery, {
    variables: { slug },
  })
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

  if (courseError || studyModulesError || coursesError) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(
          courseError || studyModulesError || coursesError,
        )}
      />
    )
  }

  const listLink = `${language ? "/" + language : ""}/courses`

  if (
    !courseLoading &&
    courseData &&
    !courseData?.course &&
    typeof window !== "undefined"
  ) {
    redirectTimeout = setTimeout(
      () => router.push("/[lng]/courses", listLink, { shallow: true }),
      5000,
    )
  }

  return (
    <section style={{ backgroundColor: "#E9FEF8" }}>
      <DashboardTabBar slug={slug} selectedValue={3} />
      <WideContainer>
        <H1Background component="h1" variant="h1" align="center">
          {t("editCourse")}
        </H1Background>
        {courseLoading || studyModulesLoading || coursesLoading ? (
          <FormSkeleton />
        ) : courseData?.course ? (
          <CourseEdit
            course={courseData.course}
            modules={studyModulesData?.study_modules ?? []}
            courses={coursesData?.courses ?? []}
          />
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
              <Link as={listLink} href="[lng]/courses">
                <a
                  onClick={() =>
                    redirectTimeout && clearTimeout(redirectTimeout)
                  }
                >
                  {t("redirectLinkText")}
                </a>
              </Link>
              {t("redirectMessagePost")}
            </Typography>
          </ErrorContainer>
        )}
      </WideContainer>
    </section>
  )
}

export default withRouter(withAdmin(EditCourse) as any)

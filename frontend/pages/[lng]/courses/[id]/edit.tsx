import React, { useContext } from "react"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import { NextPageContext as NextContext } from "next"
import { isSignedIn, isAdmin } from "/lib/authentication"
import redirect from "/lib/redirect"
import AdminError from "/components/Dashboard/AdminError"
import { WideContainer } from "/components/Container"
import { withRouter, SingletonRouter } from "next/router"
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import styled from "styled-components"
import { CourseDetails } from "/static/types/generated/CourseDetails"
import CourseEdit from "/components/Dashboard/Editor/Course"
import Link from "next/link"
import LanguageContext from "/contexes/LanguageContext"
import { CourseEditorStudyModules } from "/static/types/generated/CourseEditorStudyModules"
import FormSkeleton from "/components/Dashboard/Editor/FormSkeleton"
import { H1NoBackground } from "/components/Text/headers"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"

export const CourseQuery = gql`
  query CourseDetails($slug: String) {
    course(slug: $slug) {
      id
      name
      slug
      ects
      order
      study_module_order
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
    }
  }
`

export const StudyModuleQuery = gql`
  query CourseEditorStudyModules {
    study_modules {
      id
      name
      slug
    }
  }
`

const ErrorContainer = styled(Paper)`
  padding: 1em;
`

interface EditCourseProps {
  router: SingletonRouter
  admin: boolean
  nameSpacesRequired: string[]
  slug: string
}

const EditCourse = (props: EditCourseProps) => {
  const { admin, router, slug } = props
  const { language } = useContext(LanguageContext)

  let redirectTimeout: number | null = null

  const {
    data: courseData,
    loading: courseLoading,
    error: courseError,
  } = useQuery<CourseDetails>(CourseQuery, {
    variables: { slug: slug },
  })
  const {
    data: studyModulesData,
    loading: studyModulesLoading,
    error: studyModulesError,
  } = useQuery<CourseEditorStudyModules>(StudyModuleQuery)

  if (!admin) {
    return <AdminError />
  }

  if (courseError || studyModulesError) {
    return (
      <ModifiableErrorMessage
        ErrorMessage={JSON.stringify(courseError || studyModulesError)}
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
    <section>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          Edit course
        </H1NoBackground>
        {courseLoading || studyModulesLoading ? (
          <FormSkeleton />
        ) : courseData!.course ? (
          <CourseEdit
            course={courseData!.course}
            modules={studyModulesData?.study_modules ?? []}
          />
        ) : (
          <ErrorContainer elevation={2}>
            <Typography variant="body1">
              Course with id <b>{slug}</b> not found!
            </Typography>
            <Typography variant="body2">
              You will be redirected back to the course list in 5 seconds -
              press{" "}
              <Link as={listLink} href="[lng]/courses">
                <a
                  onClick={() =>
                    redirectTimeout && clearTimeout(redirectTimeout)
                  }
                >
                  here
                </a>
              </Link>{" "}
              to go there now.
            </Typography>
          </ErrorContainer>
        )}
      </WideContainer>
    </section>
  )
}

EditCourse.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }

  return {
    admin,
    slug: context.query ? context.query.id : "",
  }
}

EditCourse.displayName = "EditCourse"

export default withRouter(EditCourse)

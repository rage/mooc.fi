import React from "react"
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
import Spinner from "/components/Spinner"
import styled from "styled-components"
import { CourseDetails } from "/static/types/generated/CourseDetails"
import CourseEdit from "/components/Dashboard/Editor/Course"
import Link from "next/link"

export const CourseQuery = gql`
  query CourseDetails($slug: String) {
    course(slug: $slug) {
      id
      name
      slug
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
    }
  }
`

export const StudyModuleQuery = gql`
  query StudyModules {
    study_modules {
      id
      name
      slug
    }
  }
`

const Header = styled(Typography)`
  margin-top: 1em;
`

const ErrorContainer = styled(Paper)`
  padding: 1em;
`

interface EditCourseProps {
  router: SingletonRouter
  admin: boolean
  nameSpacesRequired: string[]
  language: string
}

const EditCourse = (props: EditCourseProps) => {
  const { admin, router, language } = props
  const slug = router.query.id

  let redirectTimeout: number | null = null

  // use mock data
  /*   const data = { course: Courses.allcourses.find(c => c.slug === slug) }
  const loading = false */

  if (!admin) {
    return <AdminError />
  }

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
  } = useQuery(StudyModuleQuery)

  if (courseLoading || studyModulesLoading) {
    return <Spinner />
  }

  if (courseError || studyModulesError) {
    return <div>{JSON.stringify(courseError || studyModulesError)}</div>
  }

  if (!courseData) {
    return <div>Hmm, no course data</div>
  }

  const listLink = `${language ? "/" + language : ""}/courses`

  if (!courseData!.course) {
    redirectTimeout = setTimeout(() => router.push(listLink), 5000)
  }

  return (
    <section>
      <WideContainer>
        <Header component="h1" variant="h2" gutterBottom={true} align="center">
          Edit course
        </Header>
        {courseData.course ? (
          <CourseEdit
            course={courseData.course}
            modules={studyModulesData.study_modules}
          />
        ) : (
          <ErrorContainer elevation={2}>
            <Typography variant="body1">
              Course with id <b>{slug}</b> not found!
            </Typography>
            <Typography variant="body2">
              You will be redirected back to the course list in 5 seconds -
              press{" "}
              <Link href={listLink}>
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
    // @ts-ignore
    language: context && context.req ? context.req.language : "",
  }
}

export default withRouter(EditCourse)

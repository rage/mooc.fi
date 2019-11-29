import * as React from "react"
import { NextPageContext as NextContext } from "next"
import { isSignedIn, isAdmin } from "/lib/authentication"
import redirect from "/lib/redirect"
import { AllEditorCourses } from "/static/types/generated/AllEditorCourses"
import { useQuery } from "@apollo/react-hooks"
import CourseGrid from "/components/CourseGrid"
import AdminError from "/components/Dashboard/AdminError"
import { WideContainer } from "/components/Container"
import styled from "styled-components"
// import Spinner from "/components/Spinner"
import { H1Background } from "/components/Text/headers"
import { AllEditorCoursesQuery } from "/graphql/queries/courses"

const Background = styled.section`
  background-color: #61baad;
`

const Courses = (admin: boolean) => {
  const { loading, error, data } = useQuery<AllEditorCourses>(
    AllEditorCoursesQuery,
  )

  if (error) {
    ;<div>
      Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
    </div>
  }

  if (!admin) {
    return <AdminError />
  }

  /*   if (loading || !data) {
    return <Spinner />
  } */

  return (
    <Background>
      <WideContainer>
        <H1Background component="h1" variant="h1" align="center">
          All Courses
        </H1Background>
        <CourseGrid courses={data?.courses} loading={loading} />
      </WideContainer>
    </Background>
  )
}

Courses.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
  }
}

export default Courses

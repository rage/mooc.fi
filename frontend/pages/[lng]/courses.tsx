import * as React from "react"
import { Typography } from "@material-ui/core"
import { NextPageContext as NextContext } from "next"
import { isSignedIn, isAdmin } from "/lib/authentication"
import redirect from "/lib/redirect"
import { AllEditorCourses } from "/static/types/generated/AllEditorCourses"
import { useQuery } from "@apollo/react-hooks"
import CourseGrid from "/components/CourseGrid"
import AdminError from "/components/Dashboard/AdminError"
import { WideContainer } from "/components/Container"
import styled from "styled-components"
import Spinner from "/components/Spinner"

import { AllEditorCoursesQuery } from "/graphql/queries/courses"

const Header = styled(Typography)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 1em;
  margin-bottom: 0.7em;
  background-color: #fff8ec;
  padding: 0.5em;
  width: 45%;
  font-family: Open Sans Condensed !important;
`
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

  if (loading || !data) {
    return <Spinner />
  }

  return (
    <Background>
      <WideContainer>
        <Header component="h1" variant="h2" gutterBottom={true} align="center">
          All Courses
        </Header>
        <CourseGrid courses={data.courses} />
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

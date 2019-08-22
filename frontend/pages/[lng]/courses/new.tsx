import React from "react"
import { Typography } from "@material-ui/core"
import { NextPageContext as NextContext } from "next"
import { isSignedIn, isAdmin } from "/lib/authentication"
import redirect from "/lib/redirect"
import AdminError from "/components/Dashboard/AdminError"
import { WideContainer } from "/components/Container"
import { withRouter, SingletonRouter } from "next/router"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import styled from "styled-components"
import CourseEdit from "/components/Dashboard/Editor/Course"

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

interface NewCourseProps {
  router: SingletonRouter
  admin: boolean
  nameSpacesRequired: string[]
}

const NewCourse = (props: NewCourseProps) => {
  const { admin } = props

  const { data, loading, error } = useQuery(StudyModuleQuery)

  if (!admin) {
    return <AdminError />
  }

  if (loading) {
    // TODO: spinner
    return null
  }

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return (
    <section>
      <WideContainer>
        <Header component="h1" variant="h2" gutterBottom={true} align="center">
          Create a new course
        </Header>
        <CourseEdit modules={data.study_modules} />
      </WideContainer>
    </section>
  )
}

NewCourse.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
  }
}

export default withRouter(NewCourse)

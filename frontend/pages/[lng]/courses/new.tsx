import React from "react"
import { NextPageContext as NextContext } from "next"
import { isSignedIn, isAdmin } from "/lib/authentication"
import redirect from "/lib/redirect"
import AdminError from "/components/Dashboard/AdminError"
import { WideContainer } from "/components/Container"
import { withRouter, SingletonRouter } from "next/router"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import CourseEdit from "/components/Dashboard/Editor/Course"
import FormSkeleton from "/components/Dashboard/Editor/FormSkeleton"
import { H1NoBackground } from "/components/Text/headers"

export const StudyModuleQuery = gql`
  query StudyModules {
    study_modules {
      id
      name
      slug
    }
  }
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

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return (
    <section>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          Create a new course
        </H1NoBackground>
        {loading ? (
          <FormSkeleton />
        ) : (
          <CourseEdit modules={data.study_modules} />
        )}
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

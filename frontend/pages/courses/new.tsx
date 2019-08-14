import React from "react"
import { NextPageContext as NextContext } from "next"
import { isSignedIn, isAdmin } from "../../lib/authentication"
import redirect from "../../lib/redirect"
import AdminError from "../../components/Dashboard/AdminError"
import EditorContainer from "/components/Dashboard/Editor/EditorContainer"
import { withRouter, SingletonRouter } from "next/router"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
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
    <EditorContainer title="Create a new course">
      <CourseEdit modules={data.study_modules} />
    </EditorContainer>
  )
}

NewCourse.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}

export default withRouter(NewCourse)

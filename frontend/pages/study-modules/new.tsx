import React from "react"
import { NextPageContext as NextContext } from "next"
import { SingletonRouter, withRouter } from "next/router"
import AdminError from "../../components/Dashboard/AdminError"
import EditorContainer from "/components/Dashboard/Editor/EditorContainer"
import { isAdmin, isSignedIn } from "../../lib/authentication"
import redirect from "../../lib/redirect"
import StudyModuleEdit from "/components/Dashboard/Editor/StudyModule"

interface NewStudyModuleProps {
  router: SingletonRouter
  admin: boolean
  nameSpacesRequired: string[]
}

const NewStudyModule = (props: NewStudyModuleProps) => {
  const { admin } = props

  if (!admin) {
    return <AdminError />
  }

  return (
    <EditorContainer title="Create a new study module">
      <StudyModuleEdit />
    </EditorContainer>
  )
}

NewStudyModule.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}

export default withRouter(NewStudyModule)

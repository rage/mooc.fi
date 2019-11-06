import React from "react"
import { NextPageContext as NextContext } from "next"
import { SingletonRouter, withRouter } from "next/router"
import AdminError from "/components/Dashboard/AdminError"
import { WideContainer } from "/components/Container"
import { isAdmin, isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"
import StudyModuleEdit from "/components/Dashboard/Editor/StudyModule"
import { HOneNoBackground } from "/components/Text/headers"

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
    <section>
      <WideContainer>
        <HOneNoBackground component="h1" variant="h1" align="center">
          Create a new study module
        </HOneNoBackground>
        <StudyModuleEdit />
      </WideContainer>
    </section>
  )
}

NewStudyModule.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
  }
}

export default withRouter(NewStudyModule)

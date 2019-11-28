import React from "react"
import { NextPageContext as NextContext } from "next"
import AdminError from "/components/Dashboard/AdminError"
import { WideContainer } from "/components/Container"
import { isAdmin, isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"
import StudyModuleEdit from "/components/Dashboard/Editor/StudyModule"
import { H1NoBackground } from "/components/Text/headers"

interface NewStudyModuleProps {
  admin: boolean
}

const NewStudyModule = ({ admin }: NewStudyModuleProps) => {
  if (!admin) {
    return <AdminError />
  }

  return (
    <section>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          Create a new study module
        </H1NoBackground>
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

export default NewStudyModule

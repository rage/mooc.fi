import React from "react"
import { WideContainer } from "/components/Container"
import StudyModuleEdit from "/components/Dashboard/Editor/StudyModule"
import { H1NoBackground } from "/components/Text/headers"
import withAdmin from "/lib/with-admin"
import withSignedIn from "/lib/with-signed-in"

const NewStudyModule = () => {
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

NewStudyModule.displayName = "NewStudyModule"

export default withAdmin(withSignedIn(NewStudyModule))

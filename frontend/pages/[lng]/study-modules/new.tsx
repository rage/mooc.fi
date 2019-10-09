import React from "react"
import { NextPageContext as NextContext } from "next"
import { SingletonRouter, withRouter } from "next/router"
import AdminError from "/components/Dashboard/AdminError"
import { WideContainer } from "/components/Container"
import { Typography } from "@material-ui/core"
import { isAdmin, isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"
import styled from "styled-components"
import StudyModuleEdit from "/components/Dashboard/Editor/StudyModule"
import DashboardBreadCrumbs from "/components/Dashboard/DashboardBreadCrumbs"

const Header = styled(Typography)`
  margin-top: 1em;
`

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
      <DashboardBreadCrumbs />
      <WideContainer>
        <Header component="h1" variant="h2" gutterBottom={true} align="center">
          Create a new study module
        </Header>
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

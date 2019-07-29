import React, { useState } from "react"
import { isSignedIn, isAdmin } from "../../../lib/authentication"
import redirect from "../../../lib/redirect"
import { NextPageContext as NextContext } from "next"
import AdminError from "../../../components/Dashboard/AdminError"
import CompletionsList from "../../../components/Dashboard/CompletionsList"
import { WideContainer } from "../../../components/Container"
import CourseLanguageContext from "../../../contexes/CourseLanguageContext"
import LanguageSelector from "../../../components/Dashboard/LanguageSelector"
import Typography from "@material-ui/core/Typography"
import { withRouter, SingletonRouter } from "next/router"
import DashboardBreadCrumbs from "../../../components/Dashboard/DashboardBreadCrumbs"
import DashboardTabBar from "../../../components/Dashboard/DashboardTabBar"

interface CompletionsProps {
  admin: boolean
  router: SingletonRouter
}
const Completions = (props: CompletionsProps) => {
  const { admin, router } = props
  const [languageValue, setLanguageValue] = useState("fi_FI")
  const handleLanguageChange = (event: React.ChangeEvent<unknown>) => {
    setLanguageValue((event.target as HTMLInputElement).value)
  }
  const [selection, setSelection] = useState(0)

  const handleSelectionChange = (
    event: React.ChangeEvent<{}>,
    value: number,
  ) => {
    setSelection(value)
  }

  let slug
  if (router && router.query) {
    slug = router.query.id
  }

  if (!admin) {
    return <AdminError />
  }
  return (
    <CourseLanguageContext.Provider value={languageValue}>
      <DashboardBreadCrumbs current_page={slug} />
      <DashboardTabBar
        value={selection}
        handleChange={handleSelectionChange}
        courseSlug={slug}
      />
      <WideContainer>
        <Typography
          component="h1"
          variant="h1"
          gutterBottom={true}
          align="center"
          style={{ marginTop: "2rem", marginBottom: "1rem" }}
        >
          Completions
        </Typography>
        <LanguageSelector
          handleLanguageChange={handleLanguageChange}
          languageValue={languageValue}
        />
        <CompletionsList />
      </WideContainer>
    </CourseLanguageContext.Provider>
  )
}

Completions.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)

  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}

export default withRouter(Completions)

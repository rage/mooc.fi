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
import PointsList from "../../../components/Dashboard/PointsList"

interface CompletionsProps {
  admin: boolean
  router: SingletonRouter
}
const Points = (props: CompletionsProps) => {
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

  let slug: string = ""
  if (router && router.query) {
    if (typeof router.query.id === "string") {
      slug = router.query.id
    }
  }

  if (!admin) {
    return <AdminError />
  }
  return (
    <CourseLanguageContext.Provider value={languageValue}>
      <DashboardTabBar slug={slug} selectedValue={2} />
      <DashboardBreadCrumbs current_page={slug} />
      <WideContainer>
        <Typography
          component="h1"
          variant="h1"
          align="center"
          style={{ marginTop: "2rem", marginBottom: "0.5rem" }}
        >
          Elements of Ai
        </Typography>
        <Typography
          component="p"
          variant="subtitle1"
          align="center"
          style={{ marginBottom: "2rem" }}
        >
          Points
        </Typography>
        <LanguageSelector
          handleLanguageChange={handleLanguageChange}
          languageValue={languageValue}
        />
        <PointsList />
      </WideContainer>
    </CourseLanguageContext.Provider>
  )
}

Points.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)

  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}

export default withRouter(Points)

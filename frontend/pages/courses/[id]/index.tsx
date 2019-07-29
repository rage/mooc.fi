import React, { useState } from "react"
import DashboardTabBar from "../../../components/Dashboard/DashboardTabBar"
import PointsList from "../../../components/Dashboard/PointsList"
import LanguageSelector from "../../../components/Dashboard/LanguageSelector"
import DashboardBreadCrumbs from "../../../components/Dashboard/DashboardBreadCrumbs"
import { isSignedIn, isAdmin } from "../../../lib/authentication"
import redirect from "../../../lib/redirect"
import AdminError from "../../../components/Dashboard/AdminError"
import CourseDashboard from "../../../components/Dashboard/CourseDashboard"
import { NextPageContext as NextContext } from "next"
import { WideContainer } from "../../../components/Container"
import { withRouter, SingletonRouter } from "next/router"
import CourseLanguageContext from "../../../contexes/CourseLanguageContext"

interface CourseProps {
  admin: boolean
  nameSpacesRequired: string[]
  router: SingletonRouter
}
const Course = (props: CourseProps) => {
  const { admin, router } = props

  let slug
  if (router && router.query) {
    slug = router.query.id
  }

  if (!admin) {
    return <AdminError />
  }

  //store which languages are selected
  const [languageValue, setLanguageValue] = useState("fi_FI")

  //store which tab is open
  const [selection, setSelection] = useState(0)

  const handleSelectionChange = (
    event: React.ChangeEvent<{}>,
    value: number,
  ) => {
    setSelection(value)
  }

  const handleLanguageChange = (event: React.ChangeEvent<unknown>) => {
    setLanguageValue((event.target as HTMLInputElement).value)
  }

  return (
    <CourseLanguageContext.Provider value={languageValue}>
      <section>
        <DashboardBreadCrumbs current_page={slug} />
        <DashboardTabBar
          value={selection}
          handleChange={handleSelectionChange}
          courseSlug={slug}
        />
        <WideContainer>
          <LanguageSelector
            handleLanguageChange={handleLanguageChange}
            languageValue={languageValue}
          />
          <CourseDashboard />
        </WideContainer>
      </section>
    </CourseLanguageContext.Provider>
  )
}

Course.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)

  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}

export default withRouter(Course)

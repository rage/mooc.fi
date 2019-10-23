import React, { useContext } from "react"
import Breadcrumbs from "@material-ui/core/Breadcrumbs"
import Link from "@material-ui/core/Link"
import { withRouter, SingletonRouter } from "next/router"
import styled from "styled-components"
import LanguageContext from "/contexes/LanguageContext"

const BreadCrumbsBase = styled.div`
  display: flex;
  margin-top: 0.7rem;
`
const StyledBreadCrumbs = styled(Breadcrumbs)`
  margin-top: 5px;
  margin-left: 5px;
  flex: 1;
`
interface BuildHrefProps {
  components: string[]
  lng: string
}

function buildHref(props: BuildHrefProps): JSX.Element[] {
  const { components, lng } = props

  return components.map((component, idx) => {
    if (idx === 0) {
      return (
        <Link href={`/${lng}/${component}`} key={component}>
          {component}
        </Link>
      )
    }

    const href = components.slice(0, idx + 1).join("/")

    return (
      <Link href={`/${lng}/${href}`} key={component}>
        {component}
      </Link>
    )
  })
}

interface Props {
  router: SingletonRouter
}
const DashboardBreadCrumbs = (props: Props) => {
  const { router } = props
  const currentPageLanguage = useContext(LanguageContext)
  //if router prop exists, take the current URL
  let currentUrl: string = ""
  if (router) {
    currentUrl = router.asPath
  }

  //split the url path into parts
  //remove the first item, as we know it to be homepage
  const urlWithQueryRemoved = currentUrl.split("?")[0]
  let homeLink: string = "/"
  if (urlWithQueryRemoved.startsWith("/en")) {
    homeLink = "/en/"
  }
  const urlRouteComponents = urlWithQueryRemoved
    .split("/")
    .slice(2)
    .filter(u => u)
  const breadCrumbs = buildHref({
    components: urlRouteComponents,
    lng: currentPageLanguage.language,
  })

  if (!breadCrumbs.length) {
    return null
  }

  return (
    <BreadCrumbsBase>
      <StyledBreadCrumbs separator=">" aria-label="Breadcrumb">
        <Link href={`${homeLink}`}>Home</Link>
        {breadCrumbs}
      </StyledBreadCrumbs>
    </BreadCrumbsBase>
  )
}

export default withRouter(DashboardBreadCrumbs)

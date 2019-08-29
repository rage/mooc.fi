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
function buildHref(props: BuildHrefProps) {
  const { components, lng } = props
  let BreadCrumbLinks: JSX.Element[] = []
  let i

  for (i = 0; i < components.length; i++) {
    if (i === 0) {
      BreadCrumbLinks.push(
        <Link href={`/${lng}/${components[i]}`} key={components[i]}>
          {components[i]}
        </Link>,
      )
    } else {
      let componentsSoFar = components.slice(0, i + 1)
      let href = componentsSoFar.join("/")
      BreadCrumbLinks.push(
        <Link href={`/${lng}/${href}`} key={components[i]}>
          {components[i]}
        </Link>,
      )
    }
  }

  return BreadCrumbLinks
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
    homeLink = "/en"
  }
  const urlRouteComponents = urlWithQueryRemoved.split("/").slice(2)

  return (
    <BreadCrumbsBase>
      <StyledBreadCrumbs separator=">" aria-label="Breadcrumb">
        <Link href={`${homeLink}`}>Home</Link>
        {buildHref({
          components: urlRouteComponents,
          lng: currentPageLanguage.language,
        })}
      </StyledBreadCrumbs>
    </BreadCrumbsBase>
  )
}

export default withRouter(DashboardBreadCrumbs)

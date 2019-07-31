import React from "react"
import { Breadcrumbs, Link } from "@material-ui/core"
import { withRouter, SingletonRouter } from "next/router"
import styled from "styled-components"

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
}
function buildHref(props: BuildHrefProps) {
  const { components } = props
  let BreadCrumbLinks: JSX.Element[] = []
  let i

  for (i = 0; i < components.length; i++) {
    if (i === 0) {
      BreadCrumbLinks.push(
        <Link href={`/${components[i]}`}>{components[i]}</Link>,
      )
    } else {
      let componentsSoFar = components.slice(0, i + 1)
      let href = componentsSoFar.join("/")
      BreadCrumbLinks.push(<Link href={`/${href}`}>{components[i]}</Link>)
    }
  }

  return BreadCrumbLinks
}
interface Props {
  router: SingletonRouter
}
const DashboardBreadCrumbs = (props: Props) => {
  const { router } = props

  //if router prop exists, take the current URL
  let currentUrl: string = ""
  if (router) {
    currentUrl = router.asPath
  }

  //split the url path into parts
  //remove the first item, as we know it to be homepage
  const urlRouteComponents = currentUrl.split("/").slice(1)

  return (
    <BreadCrumbsBase>
      <StyledBreadCrumbs separator=">" aria-label="Breadcrumb">
        <Link href={"/"}>Home</Link>
        {buildHref({ components: urlRouteComponents })}
      </StyledBreadCrumbs>
    </BreadCrumbsBase>
  )
}

export default withRouter(DashboardBreadCrumbs)

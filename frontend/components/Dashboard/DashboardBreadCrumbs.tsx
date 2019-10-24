import React, { useContext } from "react"
import { withRouter, SingletonRouter } from "next/router"
import styled from "styled-components"
import LanguageContext from "/contexes/LanguageContext"

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
      if (components[i] == "users") {
        BreadCrumbLinks.push(
          <BreadCrumb>
            <BreadCrumbLink
              href={`/${lng}/${components[i]}/search`}
              key={components[i]}
            >
              {components[i]}
            </BreadCrumbLink>
          </BreadCrumb>,
        )
      } else {
        BreadCrumbLinks.push(
          <BreadCrumb>
            <BreadCrumbLink
              href={`/${lng}/${components[i]}`}
              key={components[i]}
            >
              {components[i]}
            </BreadCrumbLink>
          </BreadCrumb>,
        )
      }
    } else {
      let componentsSoFar = components.slice(0, i + 1)
      let href = componentsSoFar.join("/")
      BreadCrumbLinks.push(
        <BreadCrumb>
          <BreadCrumbLink href={`/${lng}/${href}`} key={components[i]}>
            {components[i]}
          </BreadCrumbLink>
        </BreadCrumb>,
      )
    }
  }
  return BreadCrumbLinks
}
const BreadCrumbs = styled.ul`
  list-style: none;
  overflow: hidden;
  margin-left: 0 !important;
  padding-left: 0 !important;
  margin-bottom: 0 !important;

  padding-top: 0.5em;
`

const BreadCrumb = styled.li`
  float: left;
  &:first-child a {
    padding-left: 2em;
  }

  &:last-child a {
    background: transparent !important;
    color: #2f4858;
    pointer-events: none;
    cursor: default;
  }
  &:last-child a:after {
    border: 0;
  }
  &:last-child a:before {
    border: 0;
  }
`

const BreadCrumbLink = styled.a`
  color: #2f4858;
  text-decoration: none;
  padding: 10px 0 10px 65px;
  background: #fff;
  background: hsla(360, 100%, 100%, 1);
  position: relative;
  display: block;
  float: left;
  &:after {
    content: " ";
    display: block;
    width: 0;
    height: 0;
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
    border-left: 30px solid hsla(360, 100%, 100%, 1);
    position: absolute;
    top: 50%;
    margin-top: -50px;
    left: 100%;
    z-index: 2;
  }
  &:before {
    content: " ";
    display: block;
    width: 0;
    height: 0;
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
    border-left: 30px solid #2f4858;
    position: absolute;
    top: 50%;
    margin-top: -50px;
    margin-left: 1px;
    left: 100%;
    z-index: 1;
  }
`
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

  const urlRouteComponents = urlWithQueryRemoved.split("/").slice(2)

  return (
    <BreadCrumbs>
      <BreadCrumb>
        <BreadCrumbLink href={`${homeLink}`}>Home</BreadCrumbLink>
      </BreadCrumb>
      {buildHref({
        components: urlRouteComponents,
        lng: currentPageLanguage.language,
      })}
    </BreadCrumbs>
  )
}

export default withRouter(DashboardBreadCrumbs)

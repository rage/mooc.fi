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
      BreadCrumbLinks.push(
        <BreadCrumb>
          <BreadCrumbLink href={`/${lng}/${components[i]}`} key={components[i]}>
            {components[i]}
          </BreadCrumbLink>
        </BreadCrumb>,
      )
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
`

const BreadCrumb = styled.li`
  float: left;
  &:first-child a {
    padding-left: 2em;
  }
  &:nth-child(2) a {
    background: hsla(34, 85%, 45%, 1);
  }
  &:nth-child(2) a:after {
    border-left-color: hsla(34, 85%, 45%, 1);
  }
  &:nth-child(3) a {
    background: hsla(34, 85%, 55%, 1);
  }
  &:nth-child(3) a:after {
    border-left-color: hsla(34, 85%, 55%, 1);
  }
  &:nth-child(4) a {
    background: hsla(34, 85%, 65%, 1);
  }
  &:nth-child(4) a:after {
    border-left-color: hsla(34, 85%, 65%, 1);
  }
  &:nth-child(5) a {
    background: hsla(34, 85%, 75%, 1);
  }
  &:nth-child(5) a:after {
    border-left-color: hsla(34, 85%, 75%, 1);
  }
  &:last-child a {
    background: transparent !important;
    color: black;
    pointer-events: none;
    cursor: default;
  }
  &:last-child a:after {
    border: 0;
  }
`

const BreadCrumbLink = styled.a`
  color: white;
  text-decoration: none;
  padding: 10px 0 10px 65px;
  background: #3c8c7a;
  background: hsla(34, 85%, 35%, 1);
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
    border-left: 30px solid hsla(34, 85%, 35%, 1);
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
    border-left: 30px solid white;
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

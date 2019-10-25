import React, { useState } from "react"
import { withRouter, SingletonRouter } from "next/router"
import styled from "styled-components"
import gql from "graphql-tag"
import { useApolloClient } from "@apollo/react-hooks"
import { BreadcrumbCourse } from "/static/types/generated/BreadcrumbCourse"
import { BreadcrumbModule } from "/static/types/generated/BreadcrumbModule"
import Skeleton from "@material-ui/lab/Skeleton"
import LangLink from "/components/LangLink"

/* interface BuildHrefProps {
  components: string[]
  lng: string
} */

const BreadcrumbCourseQuery = gql`
  query BreadcrumbCourse($slug: String) {
    course(slug: $slug) {
      id
      slug
      name
      course_translations {
        language
        name
      }
    }
  }
`

const BreadcrumbModuleQuery = gql`
  query BreadcrumbModule($slug: String) {
    study_module(slug: $slug) {
      id
      slug
      name
      study_module_translations {
        id
        language
        name
      }
    }
  }
`

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

const BreadcrumbArrowStyle = `
  color: #2f4858;
  text-decoration: none;
  padding: 10px 0 10px 45px;
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

const BreadCrumbLink = styled.a`
  ${BreadcrumbArrowStyle}
`

const BreadCrumbSkeleton = styled(Skeleton)`
  ${BreadcrumbArrowStyle}
  background: #e6e5e5;
`

const routes = {
  "/(courses|study-modules)/(?!new)([^/]+)(/.+)?": "/$1/[id]$3", // matches /(courses|study-modules)/[id]*, doesn't match new
  "/users/(.+)(/+)(.+)": "/users/[id]$2$3", // matches /users/[id]/*, doesn't match /users/[id] or search
  "/users/(?!search)([^/]+)$": "/users/[id]", // matches /users/[id], doesn't match /users/[id]/* or search
  "/register-completion/(.+)": "/register-completion/[slug]",
}

const BreadcrumbComponent: React.FC<{ target?: string }> = ({
  target,
  children,
}) => {
  const href = Object.entries(routes).reduce((acc, [toReplace, replace]) => {
    const regex = new RegExp(toReplace, "gm")

    return acc.replace(regex, replace)
  }, target || "")

  return (
    <BreadCrumb>
      {href ? (
        <LangLink as={target || ""} href={href}>
          <BreadCrumbLink>{children}</BreadCrumbLink>
        </LangLink>
      ) : (
        <BreadCrumbSkeleton style={{ marginLeft: "3em", width: "100px" }} />
      )}
    </BreadCrumb>
  )
}

interface Props {
  router: SingletonRouter
}

const DashboardBreadCrumbs = (props: Props) => {
  const [awaitedCrumb, setAwaitedCrumb] = useState<string | null>(null)
  const client = useApolloClient()
  const { router } = props

  // const currentPageLanguage = useContext(LanguageContext)
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
  // const { language: lng } = currentPageLanguage

  const getAwaitedCrumbs = async (type: string, slug: string) => {
    // TODO: invalidate queries on editor
    if (type === "courses") {
      const { data } = await client.query<BreadcrumbCourse>({
        query: BreadcrumbCourseQuery,
        variables: { slug },
        fetchPolicy: "cache-first",
      })
      setAwaitedCrumb(data && data.course ? data.course.name : slug)
    } else {
      const { data } = await client.query<BreadcrumbModule>({
        query: BreadcrumbModuleQuery,
        variables: { slug },
        fetchPolicy: "cache-first",
      })
      setAwaitedCrumb(data && data.study_module ? data.study_module.name : slug)
    }
  }

  urlRouteComponents.forEach((c, i) => {
    if (
      i > 0 &&
      ["courses", "study-modules"].includes(urlRouteComponents[i - 1]) &&
      urlRouteComponents[i] !== "new"
    ) {
      getAwaitedCrumbs(urlRouteComponents[i - 1], c)
    }
  })

  if (urlRouteComponents.length < 1) {
    return null
  }

  return (
    <BreadCrumbs>
      <BreadcrumbComponent target={homeLink}>Home</BreadcrumbComponent>
      {urlRouteComponents.map((component, idx) => {
        let target: string | undefined = `/${component}`
        let content: string | null = component

        if (idx === 0) {
          if (component == "users") {
            target = `${component}/search`
          }
        } else {
          let componentsSoFar = urlRouteComponents.slice(0, idx + 1)
          let href = componentsSoFar.join("/")

          target = `/${href}`

          if (
            ["courses", "study-modules"].includes(componentsSoFar[idx - 1]) &&
            component !== "new"
          ) {
            if (!awaitedCrumb) {
              target = undefined
              content = null
            } else {
              content = awaitedCrumb
            }
          }
        }

        return (
          <BreadcrumbComponent target={target}>{content}</BreadcrumbComponent>
        )
      })}
    </BreadCrumbs>
  )
}

export default withRouter(DashboardBreadCrumbs)

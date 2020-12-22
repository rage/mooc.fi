import { FC, useState, useCallback, useEffect, useContext, memo } from "react"
import { withRouter, SingletonRouter } from "next/router"
import styled from "styled-components"
import { gql, useApolloClient } from "@apollo/client"
import { Skeleton } from "@material-ui/core"
import LangLink from "/components/LangLink"
import { memoize } from "lodash"
import { DocumentNode } from "graphql"
import getPageTranslator from "/translations/pages"
import LanguageContext from "/contexes/LanguageContext"

const BreadcrumbCourseQuery = gql`
  query BreadcrumbCourse($slug: String) {
    course(slug: $slug) {
      id
      slug
      name
      course_translations {
        id
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
  margin: 0px !important;
  padding-left: 0px;
`

const BreadCrumb = styled.li`
  float: left;
  cursor: pointer;
  &:first-child a {
    padding-left: 2em;
  }

  &:last-child a {
    background: transparent !important;
    color: #2f4858;
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

const asToHref = {
  "/(courses|study-modules)/(?!new)([^/]+)(/.+)?": "/$1/[id]$3", // matches /(courses|study-modules)/[id]*, doesn't match new
  "/users/(.+)(/+)(.+)": "/users/[id]$2$3", // matches /users/[id]/*, doesn't match /users/[id] or search
  "/users/(?!search)([^/]+)$": "/users/[id]", // matches /users/[id], doesn't match /users/[id]/* or search
  "/users/search/(.+)": "/users/search/[text]",
  "/register-completion/(.+)": "/register-completion/[slug]",
  "/(en|fi|se)/": "/[lng]/",
}

// add non-existing root routes here
const routeTranslations: Record<string, string> = {
  users: "/users/search",
  "register-completion": "/",
}

const getRoute = (target?: string) =>
  Object.entries(asToHref).reduce((acc, [toReplace, replace]) => {
    const regex = new RegExp(toReplace, "gm")

    return acc.replace(regex, replace)
  }, target || "")

const BreadcrumbComponent: FC<{ target?: string }> = memo(
  ({ target, children }) => {
    const href = getRoute(target)

    return (
      <BreadCrumb>
        {href ? (
          <LangLink as={target || ""} href={href}>
            <BreadCrumbLink>{children}</BreadCrumbLink>
          </LangLink>
        ) : (
          <BreadCrumbSkeleton
            width={100}
            height={5}
            style={{ marginLeft: "3em", marginBottom: "0px" }}
          />
        )}
      </BreadCrumb>
    )
  },
)

interface Props {
  router: SingletonRouter
}

const shouldFetchName = memoize((param: string | string[]): boolean => {
  if (Array.isArray(param)) {
    // no need to wait for anything if ending with courses/study-modules
    return param.slice(0, -1).some((r) => shouldFetchName(r))
  }

  return ["courses", "study-modules", "register-completion"].includes(param)
})

const DashboardBreadCrumbs = memo((props: Props) => {
  const [awaitedCrumb, setAwaitedCrumb] = useState<string | null>(null)
  const client = useApolloClient()
  const { router } = props
  const { language } = useContext(LanguageContext)

  //if router prop exists, take the current URL
  let currentUrl: string = ""
  if (router) {
    currentUrl = router.asPath
  }

  //split the url path into parts
  //remove the first item, as we know it to be homepage
  const urlWithQueryAndAnchorRemoved = currentUrl.split("?")[0].split("#")[0]

  let homeLink: string = "/"
  if (urlWithQueryAndAnchorRemoved.startsWith("/en")) {
    homeLink = "/en/"
  }

  const t = getPageTranslator(language, router)

  let urlRouteComponents = urlWithQueryAndAnchorRemoved.split("/")
  urlRouteComponents = urlRouteComponents.slice(
    urlRouteComponents[1] === "register-completion" ? 1 : 2,
  )

  const getAwaitedCrumbs = useCallback(async (type: string, slug: string) => {
    // TODO: invalidate queries on editor (if needed?)
    // TODO: could also do with the data being what's watched instead of awaitedcrumb
    // and setstate having a boolean for waiting or smth
    const params: Record<string, [DocumentNode, string]> = {
      courses: [BreadcrumbCourseQuery, "course"],
      "study-modules": [BreadcrumbModuleQuery, "study_module"],
      "register-completion": [BreadcrumbCourseQuery, "course"],
    }

    const [query, path] = params[type]

    try {
      const data = await client.readQuery({
        query,
        variables: { slug },
      })
      setAwaitedCrumb(data?.[path]?.name ?? slug)
    } catch {
      const { data } = await client.query({
        query,
        variables: { slug },
        fetchPolicy: "cache-first",
      })
      setAwaitedCrumb(data?.[path]?.name ?? slug)
    }
  }, [])

  useEffect(() => {
    if (shouldFetchName(urlRouteComponents)) {
      urlRouteComponents.forEach((c, i) => {
        if (
          i > 0 &&
          shouldFetchName(urlRouteComponents[i - 1]) &&
          urlRouteComponents[i] !== "new"
        ) {
          getAwaitedCrumbs(urlRouteComponents[i - 1], c)
        }
      })
    } else {
      // this might cause a needless rerender, but :x
      if (awaitedCrumb) {
        setAwaitedCrumb(null)
      }
    }
  }, [router?.asPath])

  if (urlRouteComponents.length < 1) {
    return null
  }

  return (
    <BreadCrumbs>
      <BreadcrumbComponent target={homeLink} key="breadcrumb-home">
        {t("title", { title: "..." })?.["/"] ?? "Home"}
      </BreadcrumbComponent>
      {urlRouteComponents.map((component, idx) => {
        let target: string | undefined = `/${component}`
        let componentsSoFar = urlRouteComponents.slice(0, idx + 1)
        let href = componentsSoFar.join("/")

        const route = `/[lng]${getRoute(`/${href}`)}`

        let content =
          t("breadcrumb")?.[route] ||
          t("breadcrumb")?.[urlWithQueryAndAnchorRemoved] ||
          t("title", { title: "..." })?.[route] ||
          component

        if (idx === 0) {
          target = routeTranslations[component] || target
        } else {
          target = `/${href}`

          if (
            shouldFetchName(componentsSoFar[idx - 1]) &&
            component !== "new"
          ) {
            if (!awaitedCrumb) {
              target = undefined
              content = null
            } else {
              content = awaitedCrumb
              document.title =
                t("title", { title: content ?? "..." })?.[
                  getRoute(urlWithQueryAndAnchorRemoved)
                ] || document.title
            }
          }
        }

        return (
          <BreadcrumbComponent target={target} key={`breadcrumb-${component}`}>
            {content}
          </BreadcrumbComponent>
        )
      })}
    </BreadCrumbs>
  )
})

export default withRouter(DashboardBreadCrumbs)

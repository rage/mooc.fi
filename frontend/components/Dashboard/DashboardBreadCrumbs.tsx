import { FC, useState, useCallback, useEffect, memo } from "react"
import { withRouter, SingletonRouter } from "next/router"
import styled from "@emotion/styled"
import { gql, useApolloClient } from "@apollo/client"
import { Skeleton } from "@material-ui/core"
import LangLink from "/components/LangLink"
import { memoize } from "lodash"
import { DocumentNode } from "graphql"
import PageTranslations from "/translations/pages"
import { useTranslator } from "/util/useTranslator"
import { useLanguageContext } from "../../contexts/LanguageContext"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"

const BreadcrumbCourseQuery = gql`
  query BreadcrumbCourse(
    $slug: String
    $language: String
    $translationFallback: Boolean
  ) {
    course(
      slug: $slug
      language: $language
      translationFallback: $translationFallback
    ) {
      id
      slug
      name
    }
  }
`

const BreadcrumbModuleQuery = gql`
  query BreadcrumbModule(
    $slug: String
    $language: String
    $translationFallback: Boolean
  ) {
    study_module(
      slug: $slug
      language: $language
      translationFallback: $translationFallback
    ) {
      id
      slug
      name
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
  &:first-of-type a {
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

const BreadCrumbSkeletonWrapper = styled.div`
  ${BreadcrumbArrowStyle}
`

const asToHref = {
  "/(courses|study-modules)/(?!new)([^/]+)(/.+)?": "/$1/[slug]$3", // matches /(courses|study-modules)/[slug]*, doesn't match new
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
          <BreadCrumbSkeletonWrapper>
            <Skeleton width="100px" />
          </BreadCrumbSkeletonWrapper>
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
  const { language } = useLanguageContext()
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

  const t = useTranslator(PageTranslations)

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

    const variables = {
      slug,
      language: mapNextLanguageToLocaleCode(language),
      translationFallback: true,
    }

    let crumb = slug

    try {
      const data = await client.readQuery({
        query,
        variables,
      })
      // somehow this isn't throwing anymore when there's nothing found, so let's do that ourselves
      if (!data) throw new Error()
      crumb = data?.[path]?.name ?? crumb
    } catch {
      const { data } = await client.query({
        query,
        variables,
        fetchPolicy: "cache-first",
      })
      crumb = data?.[path]?.name ?? crumb
    }
    setAwaitedCrumb(crumb)
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

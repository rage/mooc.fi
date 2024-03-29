import React from "react"

import memo from "just-memoize"
import { useRouter } from "next/router"

import { Link, Skeleton } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { Breadcrumb, useBreadcrumbContext } from "/contexts/BreadcrumbContext"
import { useTranslator } from "/hooks/useTranslator"
import { isTranslationKey } from "/translations"
import BreadcrumbsTranslations, {
  Breadcrumbs as BreadcrumbsTranslationType,
} from "/translations/breadcrumbs"

const BreadcrumbContainer = styled("nav")`
  margin: 0 auto;
  width: 100vw;
  max-width: 1920px;
`
const BreadcrumbList = styled("ul")`
  list-style: none;
  overflow: hidden;
  margin: 0px !important;
  padding-left: 0px;
`

const BreadcrumbItem = styled("li")`
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

const BreadcrumbLinkBase = css`
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

const BreadcrumbLink = styled(Link)`
  ${BreadcrumbLinkBase.styles}
`

const BreadcrumbNonLink = styled("div")`
  ${BreadcrumbLinkBase.styles}
`

const BreadcrumbComponent: React.FunctionComponent<Breadcrumb> = ({
  href,
  label,
  translation,
}) => {
  const t = useTranslator(BreadcrumbsTranslations)

  const _translation = isTranslationKey<BreadcrumbsTranslationType>(translation)
    ? t(translation)
    : translation

  const text = label ?? _translation

  return (
    <BreadcrumbItem>
      {!text || !href ? (
        <BreadcrumbNonLink>
          {text ?? <Skeleton width="100px" />}
        </BreadcrumbNonLink>
      ) : (
        <BreadcrumbLink href={href}>{text}</BreadcrumbLink>
      )}
    </BreadcrumbItem>
  )
}

const createKey = memo(
  (href: string, prefix?: string) =>
    `${prefix ?? ""}${encodeURIComponent(href).replace(/[%#]/g, "-")}`,
)

export function Breadcrumbs() {
  const router = useRouter()
  const { breadcrumbs } = useBreadcrumbContext()

  const isHomePage = !!RegExp(/^(?:\/_old)?\/?$/).exec(
    router?.asPath?.replace(/#(.*)/, ""),
  )

  if (isHomePage) {
    return null
  }

  return (
    <BreadcrumbContainer id="breadcrumbs" aria-label="breadcrumbs">
      <BreadcrumbList>
        <BreadcrumbComponent translation="home" href="/" key="home" />
        {breadcrumbs.map((breadcrumb, index) => (
          <BreadcrumbComponent
            {...breadcrumb}
            key={createKey(breadcrumb.href ?? `${index}`, "breadcrumb")}
          />
        ))}
      </BreadcrumbList>
    </BreadcrumbContainer>
  )
}

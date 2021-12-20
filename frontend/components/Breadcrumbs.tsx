import { Skeleton } from "@mui/material"
import LangLink from "/components/LangLink"
import styled from "@emotion/styled"
import { Breadcrumb, useBreadcrumbContext } from "/contexts/BreadcrumbContext"
import { useTranslator } from "/util/useTranslator"
import BreadcrumbsTranslations from "/translations/breadcrumbs"
import { isTranslationKey } from "/translations"
import { memoize } from "lodash"

const BreadcrumbList = styled.ul`
  list-style: none;
  overflow: hidden;
  margin: 0px !important;
  padding-left: 0px;
`

const BreadcrumbItem = styled.li`
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

const BreadcrumbLink = styled.a`
  ${BreadcrumbArrowStyle}
`

const BreadcrumbNonLink = styled.div`
  ${BreadcrumbArrowStyle}
  cursor: default;
`

function BreadcrumbComponent({ href, label, translation }: Breadcrumb) {
  const t = useTranslator(BreadcrumbsTranslations)

  const _translation = isTranslationKey<typeof BreadcrumbsTranslations>(
    translation,
  )
    ? t(translation)
    : translation

  const text = label || _translation || undefined

  return (
    <BreadcrumbItem>
      {!text || !href ? (
        <>
          <BreadcrumbNonLink>
            {text || <Skeleton width="100px" />}
          </BreadcrumbNonLink>
        </>
      ) : (
        <LangLink href={href}>
          <BreadcrumbLink>{text}</BreadcrumbLink>
        </LangLink>
      )}
    </BreadcrumbItem>
  )
}

const createKey = memoize(
  (href: string, prefix?: string) =>
    `${prefix ?? ""}${encodeURIComponent(href).replace(/[%#]/g, "-")}`,
)

export function Breadcrumbs() {
  const { breadcrumbs } = useBreadcrumbContext()

  return (
    <BreadcrumbList>
      <BreadcrumbComponent translation="home" href="/" key="home" />
      {breadcrumbs.map((breadcrumb, index) => (
        <BreadcrumbComponent
          {...breadcrumb}
          key={createKey(breadcrumb.href ?? `${index}`, "breadcrumb")}
        />
      ))}
    </BreadcrumbList>
  )
}

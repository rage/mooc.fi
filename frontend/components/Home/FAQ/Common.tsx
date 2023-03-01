import React from "react"

import { range } from "lodash"
import { MDXComponents } from "mdx/types"
import dynamic from "next/dynamic"

import { MDXProvider } from "@mdx-js/react"
import {
  EnhancedLink,
  Link as MUILink,
  Skeleton,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import ErrorMessage from "/components/ErrorMessage"

export const Background = styled("section")`
  padding-top: 2em;
  padding-left: 1em;
  padding-right: 1em;
  padding-bottom: 2em;
  background-color: #ffc107;
`

export const Content = styled("div")`
  position: relative;
`

export const ContentBox = styled("div")`
  background-color: white;
  max-width: 39em;
  border: 3px solid black;
  border-radius: 15px;
  margin-left: auto;
  margin-right: auto;
  padding: 2em;
  margin-top: 1em;
  font-size: 18px;
  line-height: 37px;
  h2 {
    font-size: 37px;
    line-height: 64px;
    font-family: var(--header-font), sans-serif !important;
    padding: 0.5rem;
    margin-top: 1rem;
  }
  h3 {
    font-size: 29px;
    line-height: 53px;
    font-family: var(--header-font), sans-serif !important;
    text-decoration: underline;
    text-decoration-color: #00d2ff;
  }
  h4 {
    font-size: 23px;
    line-height: 44px;
    font-family: var(--header-font), sans-serif !important;
  }
  code {
    background-color: #e6f4f1;
    padding: 0.5rem;
  }
  img {
    margin-top: 1rem;
    margin-bottom: 1rem;
    background-color: #c3fcf2;
    padding: 1.5rem;
  }
`

export const Title = styled(Typography)`
  margin-bottom: 0.4em;
  padding: 1rem;
` as typeof Typography

export const TitleBackground = styled("div")`
  background-color: white;
  max-width: 75%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1em;
`

export const SectionBox = styled("div")`
  margin-bottom: 6rem;
`

export const Note = styled("section")`
  padding: 1em;
  background-color: #eeeeee;
`

export const Link = styled(MUILink)`
  color: default;
` as EnhancedLink

const List = styled("ul")``
const OrderedList = styled("ol")``
const ListItem = styled("li")``

export const Loader = () => (
  <Background>
    <TitleBackground>
      <Title component="h1" variant="h1" align="center">
        <Skeleton variant="text" width="100%" />
      </Title>
    </TitleBackground>
    <Content>
      <ContentBox>
        <SectionBox>
          {range(20).map((i) => (
            <Skeleton key={`content-skeleton-${i}`} />
          ))}
        </SectionBox>
      </ContentBox>
    </Content>
  </Background>
)

type DynamicImportType = <T>() => Promise<React.ComponentType<T>>

interface FAQComponentProps {
  mdxImport?: DynamicImportType
  onSuccess: <T>(mdx: React.ComponentType<T>) => React.ComponentType<T>
  onError: <C>(
    errorComponent?: React.ComponentType<C>,
  ) => React.ComponentType<C> | null
}

export function FAQComponent({
  mdxImport = () => Promise.resolve(() => <React.Fragment />),
  onSuccess,
  onError,
}: FAQComponentProps) {
  return dynamic(
    async () => {
      return mdxImport()
        .then(onSuccess)
        .catch((error: unknown) => {
          console.log(error)
          onError()
          return () => <ErrorMessage />
        })
    },
    {
      loading: ({ error }) => {
        if (error) {
          return <ErrorMessage />
        }
        return <Loader />
      },
    },
  )
}

interface FAQPageProps {
  error: boolean
  title: string
  ingress: string
  content: JSX.Element
}

const mdxComponents: MDXComponents = {
  a: Link as React.ElementType,
  ul: List,
  ol: OrderedList,
  li: ListItem,
}

export function FAQPage({ error, title, ingress, content }: FAQPageProps) {
  return (
    <Background>
      <MDXProvider components={mdxComponents}>
        {!error && (
          <>
            <TitleBackground>
              <Title component="h1" variant="h1" align="center">
                {title}
              </Title>
            </TitleBackground>
            {ingress && (
              <TitleBackground style={{ width: "45%", marginBottom: "4em" }}>
                <Title component="p" variant="subtitle1" align="center">
                  {ingress}
                </Title>
              </TitleBackground>
            )}
          </>
        )}
        <Content>{content}</Content>
      </MDXProvider>
    </Background>
  )
}

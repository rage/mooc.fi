import { useContext, useEffect, useState } from "react"
import LanguageContext from "/contexes/LanguageContext"
import getFAQTranslator from "/translations/faq"
import { useQueryParameter } from "/util/useQueryParameter"
import dynamic from "next/dynamic"
import styled from "styled-components"
import Skeleton from "@material-ui/lab/Skeleton"
import { range } from "lodash"
import { Typography } from "@material-ui/core"

const Background = styled.section`
  padding-top: 2em;
  padding-left: 1em;
  padding-right: 1em;
  padding-bottom: 2em;
  background-color: #ffc107;
`

const Content = styled.div`
  position: relative;
`

export const ContentBox = styled.div`
  background-color: white;
  max-width: 39em;
  border: 3px solid black;
  border-radius: 15px;
  margin-left: auto;
  margin-right: auto;
  padding: 2em;
  padding-top: 5em;
  margin-top: 1em;
  font-size: 18px;
  line-height: 37px;
  h2 {
    font-size: 37px;
    line-height: 64px;
    font-family: Open Sans Condensed, sans serif !important;
    padding: 0.5rem;
    margin-top: 1rem;
  }
  h3 {
    font-size: 29px;
    line-height: 53px;
    font-family: Open Sans Condensed, sans serif !important;
    text-decoration: underline;
    text-decoration-color: #00d2ff;
  }
  h4 {
    font-size: 23px;
    line-height: 44px;
    font-family: Open Sans Condensed, sans serif !important;
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

const TitleText = styled(Typography)<any>`
  margin-bottom: 0.4em;
  padding: 1rem;
`

const TitleBackground = styled.div`
  background-color: white;
  max-width: 75%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1em;
`

export const Title = ({ children }: any) => (
  <TitleBackground>
    <TitleText component="h1" variant="h1" align="center">
      {children}
    </TitleText>
  </TitleBackground>
)

const Loader = () => (
  <section>
    <Title>
      <Skeleton />
    </Title>
    {range(20).map((i) => (
      <Skeleton key={i} height={i % 3 === 0 ? 60 : 20} />
    ))}
  </section>
)

export default function FAQ() {
  const { language } = useContext(LanguageContext)
  const t = getFAQTranslator(language)

  const [render, setRender] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => setRender(true), [])

  const topic: string = useQueryParameter("topic")
  const sanitizedTopic = topic.replace(/[./\\]/g, "").trim()

  const Component = dynamic(
    () =>
      import(
        `../../../../static/md_pages/${sanitizedTopic}_${language}.mdx`
      ).catch(() => {
        setError(true)
      }),
    { loading: () => <Loader /> },
  )

  return (
    <Background>
      <Content>
        {render && !error ? <Component /> : null}
        {error ? t("unknownTopic", { topic }) : null}
      </Content>
    </Background>
  )
}

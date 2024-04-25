import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import { styled } from "@mui/material/styles"

import Spinner from "/components/Spinner"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"

const Container = styled("div")``

const AboutUsPage = () => {
  useBreadcrumbs([
    {
      translation: "aboutUs",
      href: `/about-us`,
    },
  ])

  const { locale } = useRouter()

  const Content = dynamic(
    async () => {
      return import(
        `../public/md_pages/information/about_us_${locale ?? "fi"}.mdx`
      )
        .then((mdx) => mdx)
        .catch(() => {
          return Spinner
        })
    },
    { loading: Spinner },
  )

  return <Container>{<Content />}</Container>
}

export default AboutUsPage

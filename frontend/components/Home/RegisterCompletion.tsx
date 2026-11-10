import { PropsWithChildren } from "react"

import { generateNextSeo } from "next-seo/pages"
import Head from "next/head"

import { Typography } from "@mui/material"

import Container from "/components/Container"
import { H1NoBackground } from "/components/Text/headers"

interface RegisterCompletionProps {
  title?: string
  pageTitle?: string
  message?: string
}

function RegisterCompletion({
  title,
  pageTitle,
  message,
  children,
}: PropsWithChildren<RegisterCompletionProps>) {
  return (
    <>
      {pageTitle && <Head>{generateNextSeo({ title: pageTitle })}</Head>}
      <Container>
        {/* <Alert severity="warning" variant="filled">
        {t("registrationClosed")}
      </Alert> */}
        {title && (
          <H1NoBackground variant="h1" component="h1" align="center">
            {title}
          </H1NoBackground>
        )}
        {message && <Typography>{message}</Typography>}
        {children}
      </Container>
    </>
  )
}

export default RegisterCompletion

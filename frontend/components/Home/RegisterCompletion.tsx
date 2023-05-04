import { PropsWithChildren } from "react"

import { NextSeo } from "next-seo"

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
      {pageTitle && <NextSeo title={pageTitle} />}
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

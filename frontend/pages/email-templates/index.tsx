import Link from "next/link"

import { useQuery } from "@apollo/client"
import styled from "@emotion/styled"
import Typography from "@mui/material/Typography"

import { WideContainer } from "/components/Container"
import CreateEmailTemplateDialog from "/components/CreateEmailTemplateDialog"
import AdminError from "/components/Dashboard/AdminError"
import Spinner from "/components/Spinner"
import { ClickableDiv } from "/components/Surfaces/ClickableCard"
import { H1Background } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withAdmin from "/lib/with-admin"
import notEmpty from "/util/notEmpty"

import { EmailTemplatesDocument } from "/graphql/generated"

const Background = styled.section`
  background-color: #61baad;
`

const TemplateList = styled.ul``
const TemplateEntry = styled.li`
  list-style-type: none;
`
const TemplateContainer = styled(ClickableDiv)`
  padding: 0.5rem;
  background-color: #fff;
`

const TemplateContent = styled((props: any) => (
  <Typography paragraph={true} variant="body1" {...props} />
))`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
`

const EmailTemplates = (admin: Boolean) => {
  const { loading, error, data } = useQuery(EmailTemplatesDocument)

  if (error) {
    ;<div>
      Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
    </div>
  }

  useBreadcrumbs([
    {
      translation: "emailTemplates",
      href: `/email-templates`,
    },
  ])

  if (!admin) {
    return <AdminError />
  }

  if (loading || !data) {
    return <Spinner />
  }

  return (
    <Background>
      <WideContainer>
        <H1Background component="h1" variant="h1" align="center">
          Email Templates
        </H1Background>
        <CreateEmailTemplateDialog buttonText="Create New" />
        <TemplateList>
          {data?.email_templates?.filter(notEmpty).map((p) => {
            return (
              <TemplateEntry key={p.id}>
                <Link
                  href={`/email-templates/${p.id}`}
                  prefetch={false}
                  passHref
                >
                  <TemplateContainer>
                    <Typography
                      style={{ marginBottom: "0.5rem" }}
                      variant="h5"
                      component="h2"
                    >
                      {p.name}
                    </Typography>
                    <TemplateContent
                      dangerouslySetInnerHTML={{
                        __html: p.txt_body?.replace(/\n/g, "<br />") ?? "",
                      }}
                    />
                  </TemplateContainer>
                </Link>
                <br></br>
              </TemplateEntry>
            )
          })}
        </TemplateList>
      </WideContainer>
    </Background>
  )
}

export default withAdmin(EmailTemplates)

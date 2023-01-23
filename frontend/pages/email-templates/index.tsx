import { useQuery } from "@apollo/client"
import { Link, Paper, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { WideContainer } from "/components/Container"
import CreateEmailTemplateDialog from "/components/CreateEmailTemplateDialog"
import AdminError from "/components/Dashboard/AdminError"
import Spinner from "/components/Spinner"
import { H1Background } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withAdmin from "/lib/with-admin"

import { EmailTemplatesDocument } from "/graphql/generated"

const Background = styled("section")`
  background-color: #61baad;
`

const EmailTemplates = (admin: boolean) => {
  const { loading, error, data } = useQuery(EmailTemplatesDocument)

  useBreadcrumbs([
    {
      translation: "emailTemplates",
      href: `/email-templates`,
    },
  ])

  if (error) {
    return (
      <div>
        Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
      </div>
    )
  }

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
        <br></br>
        <br></br>
        <ul>
          {data?.email_templates?.map((p) => {
            return (
              <li style={{ listStyleType: "none" }} key={p.id}>
                <Link
                  href={`/email-templates/${p.id}`}
                  prefetch={false}
                  passHref
                >
                  <Paper>
                    <Typography variant="h5" component="h2">
                      Name: {p.name}
                    </Typography>
                    <Typography component="p">
                      {" "}
                      Content: {p.txt_body}
                    </Typography>
                  </Paper>
                </Link>
                <br></br>
              </li>
            )
          })}
        </ul>
      </WideContainer>
    </Background>
  )
}

export default withAdmin(EmailTemplates)

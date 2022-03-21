import { WideContainer } from "/components/Container"
import CreateEmailTemplateDialog from "/components/CreateEmailTemplateDialog"
import AdminError from "/components/Dashboard/AdminError"
import Spinner from "/components/Spinner"
import { H1Background } from "/components/Text/headers"
import { AllEmailTemplatesQuery } from "/graphql/queries/email-templates"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withAdmin from "/lib/with-admin"
import { AllEmailTemplates } from "/static/types/generated/AllEmailTemplates"
import notEmpty from "/util/notEmpty"
import Link from "next/link"

import { useQuery } from "@apollo/client"
import styled from "@emotion/styled"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"

const Background = styled.section`
  background-color: #61baad;
`

const EmailTemplates = (admin: Boolean) => {
  const { loading, error, data } = useQuery<AllEmailTemplates>(
    AllEmailTemplatesQuery,
  )

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
        <br></br>
        <br></br>
        <ul>
          {data?.email_templates?.filter(notEmpty).map((p) => {
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

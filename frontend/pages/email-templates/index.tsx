import { useQuery } from "@apollo/client"
import { Paper, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { WideContainer } from "/components/Container"
import CreateEmailTemplateDialog from "/components/CreateEmailTemplateDialog"
import AdminError from "/components/Dashboard/AdminError"
import Spinner from "/components/Spinner"
import { ClickableButtonBase } from "/components/Surfaces/ClickableCard"
import { H1Background } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withAdmin from "/lib/with-admin"

import { EmailTemplatesDocument } from "/graphql/generated"

const Background = styled("section")`
  background-color: #61baad;
`

const CardBackground = styled(ClickableButtonBase)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  @media (max-width: 959px) {
    flex-direction: row;
  }
` as typeof ClickableButtonBase

const TemplateCard = styled(Paper)`
  width: 100%;
  padding: 0.5rem;
`
const TemplateListItem = styled("li")`
  list-style-type: none;
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
              <TemplateListItem key={p.id}>
                <CardBackground
                  href={`/email-templates/${p.id}`}
                  prefetch={false}
                  passHref
                >
                  <TemplateCard>
                    <Typography variant="h6" component="h2">
                      Name: {p.name}
                    </Typography>
                    <Typography component="p">
                      {" "}
                      Content: {p.txt_body}
                    </Typography>
                  </TemplateCard>
                </CardBackground>
                <br></br>
              </TemplateListItem>
            )
          })}
        </ul>
      </WideContainer>
    </Background>
  )
}

export default withAdmin(EmailTemplates)

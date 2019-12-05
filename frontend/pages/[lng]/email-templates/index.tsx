import * as React from "react"
import { WideContainer } from "/components/Container"
import { AllEmailTemplatesQuery } from "/graphql/queries/email-templates"
import { useQuery, ApolloConsumer } from "@apollo/react-hooks"
import AdminError from "/components/Dashboard/AdminError"
import Spinner from "/components/Spinner"
import { H1Background } from "/components/Text/headers"
import styled from "styled-components"
import { AllEmailTemplates } from "/static/types/generated/AllEmailTemplates"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import { Button } from "@material-ui/core"
import { AddEmailTemplateMutation } from "/graphql/mutations/email-templates"
import { AddEmailTemplate } from "/static/types/generated/AddEmailTemplate"

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
        <ApolloConsumer>
          {client => (
            <Button
              onClick={async () => {
                const { data } = await client.mutate<AddEmailTemplate>({
                  mutation: AddEmailTemplateMutation,
                  variables: { name: "New Email Template" },
                })
                console.log(data)
              }}
            >
              Create new
            </Button>
          )}
        </ApolloConsumer>
        <br></br>
        <br></br>
        {data.email_templates.map(p => {
          return (
            <div>
              <a href={"email-templates/".concat(p.id)}>
                <Paper>
                  <Typography variant="h5" component="h3">
                    {p.name}
                  </Typography>
                  <Typography component="p">{p.txt_body}</Typography>
                </Paper>
              </a>
              <br></br>
            </div>
          )
        })}
      </WideContainer>
    </Background>
  )
}

export default EmailTemplates

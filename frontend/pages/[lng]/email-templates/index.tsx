import * as React from "react"
import { WideContainer } from "/components/Container"
import { AllEmailTemplatesQuery } from "/graphql/queries/email-templates"
import { useQuery } from "@apollo/react-hooks"
import AdminError from "/components/Dashboard/AdminError"
import Spinner from "/components/Spinner"
import { H1Background } from "/components/Text/headers"
import styled from "styled-components"
import { AllEmailTemplates } from "/static/types/generated/AllEmailTemplates"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import redirect from "/lib/redirect"
import { isAdmin, isSignedIn } from "/lib/authentication"
import { NextPageContext as NextContext } from "next"
import CreateEmailTemplateDialog from "/components/CreateEmailTemplateDialog"
import { useContext } from "react"
import LanguageContext from "/contexes/LanguageContext"

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
  const { language } = useContext(LanguageContext)

  return (
    <Background>
      <WideContainer>
        <H1Background component="h1" variant="h1" align="center">
          Email Templates
        </H1Background>
        <CreateEmailTemplateDialog buttonText="Create New" />
        <br></br>
        <br></br>
        {data.email_templates.map(p => {
          return (
            <div>
              <a
                href={"/" + language + "/email-templates/".concat(p.id)}
                style={{ textDecoration: "none" }}
              >
                <Paper>
                  <Typography variant="h5" component="h3">
                    Name: {p.name}
                  </Typography>
                  <Typography component="p"> Content: {p.txt_body}</Typography>
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

EmailTemplates.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)

  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
  }
}

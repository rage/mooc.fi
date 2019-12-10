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
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@material-ui/core"
import { AddEmailTemplateMutation } from "/graphql/mutations/email-templates"
import { AddEmailTemplate } from "/static/types/generated/AddEmailTemplate"
import redirect from "/lib/redirect"
import { isAdmin, isSignedIn } from "/lib/authentication"
import { NextPageContext as NextContext } from "next"
import Router from "next/router"
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

  return (
    <Background>
      <WideContainer>
        <H1Background component="h1" variant="h1" align="center">
          Email Templates
        </H1Background>
        <CustomDialog />
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

const CustomDialog = () => {
  const [open, setOpen] = React.useState(false)
  const [nameInput, setNameInput] = React.useState("")
  const { language } = useContext(LanguageContext)
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button color="primary" onClick={handleClickOpen}>
        Create new
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Name your new Email Template. This will create new Email Template
            and you will be redirected to editing page.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <ApolloConsumer>
            {client => (
              <Button
                onClick={async () => {
                  const { data } = await client.mutate<AddEmailTemplate>({
                    mutation: AddEmailTemplateMutation,
                    variables: { name: nameInput },
                  })
                  console.log(data)
                  const url =
                    "/" +
                    language +
                    "/email-templates/" +
                    data?.addEmailTemplate.id
                  Router.push(url)
                }}
                color="primary"
              >
                Create
              </Button>
            )}
          </ApolloConsumer>
        </DialogActions>
      </Dialog>
    </div>
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

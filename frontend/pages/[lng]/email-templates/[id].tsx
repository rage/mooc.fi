import { useState, useContext } from "react"
import { WideContainer } from "/components/Container"
import { useQuery, ApolloConsumer } from "@apollo/client"
import { SubtitleNoBackground } from "/components/Text/headers"
import { useQueryParameter } from "/util/useQueryParameter"
import { EmailTemplate } from "/static/types/generated/EmailTemplate"
import { EmailTemplateQuery } from "/graphql/queries/email-templates"
import { Paper, TextField, Button } from "@material-ui/core"
import {
  UpdateEmailTemplateMutation,
  DeleteEmailTemplateMutation,
} from "/graphql/mutations/email-templates"
import { UpdateEmailTemplate } from "/static/types/generated/UpdateEmailTemplate"
import { DeleteEmailTemplate } from "static/types/generated/DeleteEmailTemplate"
import CustomSnackbar from "/components/CustomSnackbar"
import LanguageContext from "/contexes/LanguageContext"
import Router from "next/router"
import withAdmin from "/lib/with-admin"

const EmailTemplateView = () => {
  const [emailTemplate, setEmailTemplate] = useState<any>()
  const [name, setName] = useState<any>()
  const [txtBody, setTxtBody] = useState<any>()
  const [htmlBody, setHtmlBody] = useState<any>()
  const [title, setTitle] = useState<any>()
  const [didInit, setDidInit] = useState(false)

  const id = useQueryParameter("id")

  interface SnackbarData {
    type: "error" | "success" | "warning" | "error"
    message: string
  }
  const [snackbarData, setSnackbarData]: [SnackbarData, any] = useState({
    type: "error",
    message: "Error: Could not save",
  })

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)

  const { data, loading, error } = useQuery<EmailTemplate>(EmailTemplateQuery, {
    variables: { id: id },
  })

  const { language } = useContext(LanguageContext)

  //TODO add circular progress
  if (loading) {
    return null
  }
  //TODO fix error message
  if (error || !data) {
    return <p>Error has occurred</p>
  }

  if (data && !didInit) {
    setName(data.email_template?.name)
    setTxtBody(data.email_template?.txt_body)
    setHtmlBody(data.email_template?.html_body)
    setTitle(data.email_template?.title)
    setDidInit(true)
    setEmailTemplate(data.email_template)
  }

  return (
    <section>
      <WideContainer>
        <Paper>
          <form>
            <SubtitleNoBackground
              component="p"
              variant="subtitle1"
              align="center"
            >
              id: {data.email_template?.id}
            </SubtitleNoBackground>
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              value={name ?? ""}
              onChange={(e) => {
                e.preventDefault()
                setName(e.target.value)
              }}
            />
            <br></br>
            <br></br>
            <TextField
              id="title"
              label="Title"
              variant="outlined"
              value={title ?? ""}
              onChange={(e) => {
                e.preventDefault()
                setTitle(e.target.value)
              }}
            />
            <br></br>
            <br></br>
            <TextField
              id="txt-body"
              label="txt_body"
              multiline
              rows="4"
              maxRows="40"
              value={txtBody ?? ""}
              variant="outlined"
              onChange={(e) => {
                e.preventDefault()
                setTxtBody(e.target.value)
              }}
            />
            <br></br>
            <br></br>
            <TextField
              id="html-body"
              label="html_body (disabled)"
              multiline
              rows="4"
              maxRows="40"
              disabled={true}
              value={htmlBody ?? ""}
              variant="outlined"
              onChange={(e) => {
                e.preventDefault()
                setHtmlBody(e.target.value)
              }}
            />
            <br></br>
            <br></br>
            <ApolloConsumer>
              {(client) => (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    if (emailTemplate == null) return
                    try {
                      const { data } = await client.mutate<UpdateEmailTemplate>(
                        {
                          mutation: UpdateEmailTemplateMutation,
                          variables: {
                            id: emailTemplate.id,
                            name: name,
                            title: title,
                            txt_body: txtBody,
                            html_body: htmlBody,
                          },
                        },
                      )
                      console.log(data)
                      setSnackbarData({
                        type: "success",
                        message: "Saved succesfully",
                      })
                    } catch {
                      setSnackbarData({
                        type: "error",
                        message: "Error: Could not save",
                      })
                    }
                    setIsSnackbarOpen(true)
                  }}
                >
                  Update
                </Button>
              )}
            </ApolloConsumer>
            <ApolloConsumer>
              {(client) => (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    if (emailTemplate == null) return
                    try {
                      const { data } = await client.mutate<DeleteEmailTemplate>(
                        {
                          mutation: DeleteEmailTemplateMutation,
                          variables: { id: emailTemplate.id },
                        },
                      )
                      console.log(data)
                      setSnackbarData({
                        type: "success",
                        message: "Deleted successfully",
                      })

                      const url = "/" + language + "/email-templates/"
                      setTimeout(() => Router.push(url), 5000)
                    } catch {
                      setSnackbarData({
                        type: "error",
                        message: "Error: Could not delete",
                      })
                    }
                    setIsSnackbarOpen(true)
                  }}
                >
                  Delete
                </Button>
              )}
            </ApolloConsumer>

            <SubtitleNoBackground
              component="p"
              variant="subtitle1"
              align="center"
            >
              created_at: {data.email_template?.created_at}
            </SubtitleNoBackground>
            <SubtitleNoBackground
              component="p"
              variant="subtitle1"
              align="center"
            >
              updated_at: {data.email_template?.updated_at}
            </SubtitleNoBackground>
          </form>
        </Paper>
        <CustomSnackbar
          open={isSnackbarOpen}
          setOpen={setIsSnackbarOpen}
          type={snackbarData.type}
          message={snackbarData.message}
        />
      </WideContainer>
    </section>
  )
}

export default withAdmin(EmailTemplateView)

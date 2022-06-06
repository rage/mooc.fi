import { useState } from "react"

import CollapseButton from "/components/Buttons/CollapseButton"
import { WideContainer } from "/components/Container"
import CustomSnackbar from "/components/CustomSnackbar"
import Spinner from "/components/Spinner"
import { CardTitle, SubtitleNoBackground } from "/components/Text/headers"
import {
  DeleteEmailTemplateMutation,
  UpdateEmailTemplateMutation,
} from "/graphql/mutations/email-templates"
import { EmailTemplateQuery } from "/graphql/queries/email-templates"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useSubtitle from "/hooks/useSubtitle"
import withAdmin from "/lib/with-admin"
import { EmailTemplate } from "/static/types/generated/EmailTemplate"
import { UpdateEmailTemplate } from "/static/types/generated/UpdateEmailTemplate"
import {
  emailTemplateDescriptions,
  emailTemplateNames,
  EmailTemplateType,
} from "/types/emailTemplates"
import { useQueryParameter } from "/util/useQueryParameter"
import { NextSeo } from "next-seo"
import Router from "next/router"
import { DeleteEmailTemplate } from "static/types/generated/DeleteEmailTemplate"

import { useApolloClient, useQuery } from "@apollo/client"
import styled from "@emotion/styled"
import {
  Button,
  Card,
  CardContent,
  Collapse,
  Paper,
  TextField,
  Typography,
} from "@mui/material"

const TemplateList = styled.div`
  * + * {
    margin-top: 0.5rem;
  }
`

const EmailTemplateView = () => {
  // TODO: Get rid of any
  const [emailTemplate, setEmailTemplate] = useState<any>()
  const [name, setName] = useState<any>()
  const [txtBody, setTxtBody] = useState<any>()
  const [htmlBody, setHtmlBody] = useState<any>()
  const [title, setTitle] = useState<any>()
  const [exerciseThreshold, setExerciseThreshold] = useState<
    Number | null | undefined
  >()
  const [pointsThreshold, setPointsThreshold] = useState<
    Number | null | undefined
  >()
  const [templateType, setTemplateType] = useState<
    EmailTemplateType | null | undefined
  >()
  const [triggeredByCourseId, setTriggeredByCourseId] = useState<any>()
  const [didInit, setDidInit] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const id = useQueryParameter("id")
  const client = useApolloClient()

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

  useBreadcrumbs([
    {
      translation: "emailTemplates",
      href: `/email-templates`,
    },
    {
      label: data?.email_template?.name ?? undefined,
      href: `/email-templates/${id}`,
    },
  ])
  const pageTitle = useSubtitle(data?.email_template?.name ?? "")

  if (loading) {
    return <Spinner />
  }
  //TODO fix error message
  if (error || !data) {
    return <p>Error has occurred</p>
  }

  console.log("data", data)
  if (data && !didInit) {
    setName(data.email_template?.name)
    setTxtBody(data.email_template?.txt_body)
    setHtmlBody(data.email_template?.html_body)
    setTitle(data.email_template?.title)
    setTemplateType(data.email_template?.template_type as EmailTemplateType)
    setExerciseThreshold(data.email_template?.exercise_completions_threshold)
    setPointsThreshold(data.email_template?.points_threshold)
    setTriggeredByCourseId(
      data.email_template?.triggered_automatically_by_course_id,
    )
    setDidInit(true)
    setEmailTemplate(data.email_template)
  }

  return (
    <>
      <NextSeo title={pageTitle} />
      <section>
        <WideContainer>
          <Paper style={{ padding: "0.5rem" }}>
            <form>
              <SubtitleNoBackground variant="h4" align="center">
                id: {data.email_template?.id}
                {templateType && (
                  <p>type: {emailTemplateNames[templateType]}</p>
                )}
              </SubtitleNoBackground>
              <Typography variant="h4"></Typography>
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
                label="Email Subject"
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
                label="Email text body"
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
                label="Email HTML Body (disabled)"
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
              {templateType === "threshold" ? (
                <>
                  <TextField
                    type="number"
                    label="Exercise Completions threshold (not supported)"
                    fullWidth
                    autoComplete="off"
                    variant="outlined"
                    style={{ width: "60%" }}
                    value={exerciseThreshold}
                    onChange={(e) => {
                      e.preventDefault()
                      setExerciseThreshold(Number(e.target.value))
                    }}
                    disabled
                  />
                  <br />
                  <br />
                  <TextField
                    type="number"
                    label="Points threshold"
                    fullWidth
                    autoComplete="off"
                    variant="outlined"
                    style={{ width: "60%" }}
                    value={pointsThreshold}
                    onChange={(e) => {
                      e.preventDefault()
                      setPointsThreshold(Number(e.target.value))
                    }}
                  />
                </>
              ) : null}
              <CollapseButton
                open={isHelpOpen}
                label="Help"
                onClick={() => setIsHelpOpen((s) => !s)}
              />
              <Collapse in={isHelpOpen}>
                <div style={{ margin: "0.5rem", padding: "0.5rem" }}>
                  <Typography variant="subtitle2">
                    You can use these template values in the email:
                  </Typography>
                  <TemplateList>
                    {emailTemplateDescriptions
                      .filter((value) => {
                        if (value.types?.length && templateType) {
                          return value.types.includes(templateType)
                        }
                        return true
                      })
                      .map((value) => (
                        <Card key={value.name} style={{ padding: "0.5rem" }}>
                          <CardTitle>
                            <code>
                              {`{{ `}
                              {value.name}
                              {` }}`}
                            </code>
                          </CardTitle>
                          {(value.description || value.types?.length) && (
                            <CardContent>
                              <Typography variant="body1">
                                {value.description}
                              </Typography>
                              {value.types?.length && (
                                <p>
                                  Limited to template type
                                  {value.types.length > 1 ? "s" : ""}{" "}
                                  {value.types.map((type, index) => (
                                    <>
                                      {index > 0 ? ", " : ""}
                                      <strong>
                                        {emailTemplateNames[type] ?? type}
                                      </strong>
                                    </>
                                  ))}
                                </p>
                              )}
                            </CardContent>
                          )}
                        </Card>
                      ))}
                  </TemplateList>
                </div>
              </Collapse>
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  if (emailTemplate == null) return
                  try {
                    const { data } = await client.mutate<UpdateEmailTemplate>({
                      mutation: UpdateEmailTemplateMutation,
                      variables: {
                        id: emailTemplate.id,
                        name: name,
                        title: title,
                        txt_body: txtBody,
                        html_body: htmlBody,
                        triggered_automatically_by_course_id:
                          triggeredByCourseId,
                        exercise_completions_threshold: exerciseThreshold,
                        points_threshold: pointsThreshold,
                        template_type: templateType,
                      },
                    })
                    console.log(data)
                    setSnackbarData({
                      type: "success",
                      message: "Saved successfully",
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
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  if (emailTemplate == null) return
                  try {
                    const { data } = await client.mutate<DeleteEmailTemplate>({
                      mutation: DeleteEmailTemplateMutation,
                      variables: { id: emailTemplate.id },
                    })
                    console.log(data)
                    setSnackbarData({
                      type: "success",
                      message: "Deleted successfully",
                    })

                    const url = "/email-templates/"
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
    </>
  )
}

export default withAdmin(EmailTemplateView)

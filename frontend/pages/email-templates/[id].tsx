import { Reducer, useReducer, useState } from "react"

import { omit } from "lodash"
import { NextSeo } from "next-seo"
import Router from "next/router"

import { useMutation, useQuery } from "@apollo/client"
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

import CollapseButton from "/components/Buttons/CollapseButton"
import { WideContainer } from "/components/Container"
import CustomSnackbar from "/components/CustomSnackbar"
import Spinner from "/components/Spinner"
import { CardTitle, SubtitleNoBackground } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useSubtitle from "/hooks/useSubtitle"
import withAdmin from "/lib/with-admin"
import {
  emailTemplateDescriptions,
  emailTemplateNames,
  EmailTemplateType,
} from "/types/emailTemplates"
import { useQueryParameter } from "/util/useQueryParameter"

import {
  DeleteEmailTemplateDocument,
  EmailTemplateDocument,
  EmailTemplateFieldsFragment,
  UpdateEmailTemplateDocument,
} from "/graphql/generated"

const TemplateList = styled.div`
  * + * {
    margin-top: 0.5rem;
  }
`

interface SnackbarData {
  type: "error" | "success" | "warning"
  message: string
}

interface EmailTemplateState
  extends Omit<EmailTemplateFieldsFragment, "__typename" | "template_type"> {
  template_type?: EmailTemplateType | null
}

type SetEmailTemplateField<K extends keyof EmailTemplateState> = {
  type: "SET_FIELD"
  field: K
  value: EmailTemplateState[K]
}
type SetEmailTemplate = {
  type: "SET_TEMPLATE"
  value: EmailTemplateState
}
type EmailTemplateAction =
  | SetEmailTemplateField<keyof EmailTemplateState>
  | SetEmailTemplate

const reducer: Reducer<EmailTemplateState, EmailTemplateAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      }
    case "SET_TEMPLATE":
      return {
        ...action.value,
      }
    default:
      return state
  }
}

const defaultState: EmailTemplateState = {
  id: "",
  name: "",
  title: "",
  html_body: "",
  txt_body: "",
  template_type: null,
  exercise_completions_threshold: null,
  points_threshold: null,
  triggered_automatically_by_course_id: null,
  created_at: "",
  updated_at: "",
}

const EmailTemplateView = () => {
  /*const [emailTemplate, setEmailTemplate] =
    useState<EmailTemplateFieldsFragment | null>()
  const [name, setName] = useState<EmailTemplateFieldsFragment["name"]>()
  const [txtBody, setTxtBody] =
    useState<EmailTemplateFieldsFragment["txt_body"]>()
  const [htmlBody, setHtmlBody] =
    useState<EmailTemplateFieldsFragment["html_body"]>()
  const [title, setTitle] = useState<EmailTemplateFieldsFragment["title"]>()
  const [exerciseThreshold, setExerciseThreshold] =
    useState<EmailTemplateFieldsFragment["exercise_completions_threshold"]>()
  const [pointsThreshold, setPointsThreshold] =
    useState<EmailTemplateFieldsFragment["points_threshold"]>()
  const [templateType, setTemplateType] =
    useState<EmailTemplateType>()
  const [triggeredByCourseId, setTriggeredByCourseId] =
    useState<
      EmailTemplateFieldsFragment["triggered_automatically_by_course_id"]
    >()*/
  const [didInit, setDidInit] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const id = useQueryParameter("id")

  const [snackbarData, setSnackbarData] = useState<SnackbarData>({
    type: "error",
    message: "Error: Could not save",
  })

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)

  const { data, loading, error } = useQuery(EmailTemplateDocument, {
    variables: { id },
  })
  const [state, dispatch] = useReducer(
    reducer,
    (data?.email_template ?? defaultState) as EmailTemplateState,
  )

  const [updateEmailTemplateMutation] = useMutation(UpdateEmailTemplateDocument)
  const [deleteEmailTemplateMutation] = useMutation(DeleteEmailTemplateDocument)

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

  const filteredDescriptions = emailTemplateDescriptions.filter((value) => {
    if (value.types?.length && state.template_type) {
      return value.types.includes(state.template_type)
    }
    return true
  })

  console.log("data", data)
  /*if (data && !didInit) {
    setName(data.email_template?.name ?? undefined)
    setTxtBody(data.email_template?.txt_body ?? undefined)
    setHtmlBody(data.email_template?.html_body ?? undefined)
    setTitle(data.email_template?.title ?? undefined)
    setTemplateType(data.email_template?.template_type as EmailTemplateType)
    setExerciseThreshold(data.email_template?.exercise_completions_threshold)
    setPointsThreshold(data.email_template?.points_threshold)
    setTriggeredByCourseId(
      data.email_template?.triggered_automatically_by_course_id ?? undefined,
    )
    setDidInit(true)
    setEmailTemplate(data.email_template)
  }*/

  const setField = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_FIELD",
      field: e.target.name as keyof EmailTemplateState,
      value: e.target.value,
    })
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
                {state.template_type && (
                  <p>type: {emailTemplateNames[state.template_type]}</p>
                )}
              </SubtitleNoBackground>
              <Typography variant="h4"></Typography>
              <TextField
                id="name"
                label="Name"
                variant="outlined"
                value={state.name ?? ""}
                onChange={setField}
              />
              <br></br>
              <br></br>
              <TextField
                id="title"
                label="Email Subject"
                variant="outlined"
                value={state.title ?? ""}
                onChange={setField}
              />
              <br></br>
              <br></br>
              <TextField
                id="txt_body"
                label="Email text body"
                multiline
                rows="4"
                maxRows="40"
                value={state.txt_body ?? ""}
                variant="outlined"
                onChange={setField}
              />
              <br></br>
              <br></br>
              <TextField
                id="html_body"
                label="Email HTML Body (disabled)"
                multiline
                rows="4"
                maxRows="40"
                disabled={true}
                value={state.html_body ?? ""}
                variant="outlined"
                onChange={setField}
              />
              <br></br>
              <br></br>
              {state.template_type === "threshold" ? (
                <>
                  <TextField
                    type="number"
                    id="exercise_completions_threshold"
                    label="Exercise Completions threshold (not supported)"
                    fullWidth
                    autoComplete="off"
                    variant="outlined"
                    style={{ width: "60%" }}
                    value={state.exercise_completions_threshold}
                    onChange={setField}
                    disabled
                  />
                  <br />
                  <br />
                  <TextField
                    id="points_threshold"
                    type="number"
                    label="Points threshold"
                    fullWidth
                    autoComplete="off"
                    variant="outlined"
                    style={{ width: "60%" }}
                    value={state.points_threshold}
                    onChange={setField}
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
                    {filteredDescriptions.map((value) => (
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
                                {value.types
                                  .map((type) => (
                                    <strong key={type}>
                                      {emailTemplateNames[type] ?? type}
                                    </strong>
                                  ))
                                  .join(", ")}
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
                  if (!state?.id) return

                  try {
                    const { data } = await updateEmailTemplateMutation({
                      variables: omit(state, "__typename"),
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
                  if (!state?.id == null) return
                  try {
                    const { data } = await deleteEmailTemplateMutation({
                      variables: { id: state.id },
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

import React, { Reducer, useEffect, useReducer, useState } from "react"

import { NextSeo } from "next-seo"
import Router, { useRouter } from "next/router"
import { omit } from "remeda"

import { useMutation, useQuery } from "@apollo/client"
import {
  Button,
  Card,
  CardContent,
  Collapse,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import CollapseButton from "/components/Buttons/CollapseButton"
import { WideContainer } from "/components/Container"
import CustomSnackbar from "/components/CustomSnackbar"
import ErrorMessage from "/components/ErrorMessage"
import Spinner from "/components/Spinner"
import { CardTitle } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useQueryParameter } from "/hooks/useQueryParameter"
import withAdmin from "/lib/with-admin"
import {
  emailTemplateDescriptions,
  emailTemplateNames,
  EmailTemplateType,
} from "/types/emailTemplates"

import {
  DeleteEmailTemplateDocument,
  EmailTemplateDocument,
  EmailTemplateFieldsFragment,
  UpdateEmailTemplateDocument,
} from "/graphql/generated"

const TemplateList = styled("div")`
  * + * {
    margin-top: 0.5rem;
  }
`

const TemplateForm = styled("form")`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Row = styled("div")`
  display: flex;
  gap: 1rem;
  width: 100%;
`

const Stretch = styled("div")`
  width: 100%;
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
  course_instance_language: null,
}

const EmailTemplateView = () => {
  const { locale } = useRouter()
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
  const [state, dispatch] = useReducer(reducer, defaultState)

  useEffect(() => {
    if (data?.email_template) {
      dispatch({
        type: "SET_TEMPLATE",
        value: data.email_template as EmailTemplateState,
      })
    }
  }, [data?.email_template])

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
  const pageTitle = data?.email_template?.name ?? ""

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <ErrorMessage />
  }

  if (!data) {
    return <div>No template found</div>
  }

  const filteredDescriptions = emailTemplateDescriptions.filter((value) => {
    if (value.types?.length && state.template_type) {
      return value.types.includes(state.template_type)
    }
    return true
  })

  const setField = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_FIELD",
      field: e.target.id as keyof EmailTemplateState,
      value: e.target.value,
    })
  }

  return (
    <>
      <NextSeo title={pageTitle} />
      <section>
        <WideContainer>
          <Paper style={{ padding: "0.5rem" }}>
            <TemplateForm>
              <TextField id="id" label="ID" value={state.id} disabled />
              <TextField
                id="template_type"
                label="Template type"
                value={state.template_type}
                disabled
              />
              <TextField
                id="name"
                label="Name"
                variant="outlined"
                value={state.name ?? ""}
                onChange={setField}
              />
              <TextField
                id="title"
                label="Email Subject"
                variant="outlined"
                value={state.title ?? ""}
                onChange={setField}
              />
              <TextField
                id="txt_body"
                label="Email text body"
                multiline
                rows="4"
                value={state.txt_body ?? ""}
                variant="outlined"
                onChange={setField}
              />
              <TextField
                id="html_body"
                label="Email HTML Body (disabled)"
                multiline
                rows="4"
                disabled
                value={state.html_body ?? ""}
                variant="outlined"
                onChange={setField}
              />
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
              {state.template_type === "course-stats" ? (
                <>
                  <TextField
                    label="Course instance language (used if course is handled by a parent course; short code like fi, sv, fr-be)"
                    fullWidth
                    autoComplete="off"
                    variant="outlined"
                    value={state.course_instance_language ?? ""}
                    onChange={setField}
                  />
                </>
              ) : null}
              <Row>
                <Typography variant="body2">
                  Created at{" "}
                  {new Date(
                    data.email_template?.created_at ?? "",
                  ).toLocaleString(locale)}
                </Typography>
                <Typography variant="body2">
                  Updated at{" "}
                  {new Date(
                    data.email_template?.updated_at ?? "",
                  ).toLocaleString(locale)}
                </Typography>
              </Row>
              <Row>
                <Row>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      if (!state?.id) return

                      try {
                        const { data } = await updateEmailTemplateMutation({
                          // FIXME: some weird typing thing
                          variables: omit(state, "__typename" as any) as any,
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
                        setTimeout(() => {
                          Router.push(url)
                        }, 5000)
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
                </Row>
                <Stretch />
                <CollapseButton
                  open={isHelpOpen}
                  label="Help"
                  onClick={() => setIsHelpOpen((s) => !s)}
                />
              </Row>
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
                                  .map<React.ReactNode>((type) => (
                                    <strong key={type}>
                                      {emailTemplateNames[type] ?? type}
                                    </strong>
                                  ))
                                  .reduce((acc, curr) => [acc, ", ", curr])}
                              </p>
                            )}
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </TemplateList>
                </div>
              </Collapse>
            </TemplateForm>
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

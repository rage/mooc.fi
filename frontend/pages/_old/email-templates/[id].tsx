import React, { Reducer, useEffect, useReducer, useState } from "react"

import { useConfirm } from "material-ui-confirm"
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
import useIsOld from "/hooks/useIsOld"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withAdmin from "/lib/with-admin"
import EmailTemplatesTranslations from "/translations/emailTemplates"
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
  const isOld = useIsOld()
  const baseUrl = isOld ? "/_old" : "/admin"
  const { locale } = useRouter()
  const t = useTranslator(EmailTemplatesTranslations)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const id = useQueryParameter("id")

  const [snackbarData, setSnackbarData] = useState<SnackbarData>({
    type: "error",
    message: t("saveError"),
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
        value: {
          ...data.email_template,
          name: data.email_template.name ?? "",
          title: data.email_template.title ?? "",
          txt_body: data.email_template.txt_body ?? "",
          html_body: data.email_template.html_body ?? "",
        } as EmailTemplateState,
      })
    }
  }, [data?.email_template])

  const confirm = useConfirm()
  const [updateEmailTemplateMutation] = useMutation(UpdateEmailTemplateDocument)
  const [deleteEmailTemplateMutation] = useMutation(DeleteEmailTemplateDocument)

  useBreadcrumbs([
    {
      translation: "emailTemplates",
      href: `${baseUrl}/email-templates`,
    },
    {
      label: data?.email_template?.name ?? undefined,
      href: `${baseUrl}/email-templates/${id}`,
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
    return <div>{t("noTemplateFound")}</div>
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
              <TextField id="id" label={t("id")} value={state.id} disabled />
              <TextField
                id="template_type"
                label={t("templateType")}
                value={state.template_type ?? ""}
                disabled
              />
              <TextField
                id="name"
                label={t("name")}
                variant="outlined"
                value={state.name ?? ""}
                onChange={setField}
              />
              <TextField
                id="title"
                label={t("emailSubject")}
                variant="outlined"
                value={state.title ?? ""}
                onChange={setField}
              />
              <TextField
                id="txt_body"
                label={t("emailTextBody")}
                multiline
                rows="4"
                value={state.txt_body ?? ""}
                variant="outlined"
                onChange={setField}
              />
              <TextField
                id="html_body"
                label={t("emailHtmlBody")}
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
                    label={t("exerciseCompletionsThreshold")}
                    fullWidth
                    autoComplete="off"
                    variant="outlined"
                    style={{ width: "60%" }}
                    value={state.exercise_completions_threshold ?? ""}
                    onChange={setField}
                    disabled
                  />
                  <TextField
                    id="points_threshold"
                    type="number"
                    label={t("pointsThreshold")}
                    fullWidth
                    autoComplete="off"
                    variant="outlined"
                    style={{ width: "60%" }}
                    value={state.points_threshold ?? ""}
                    onChange={setField}
                  />
                </>
              ) : null}
              {state.template_type === "course-stats" ? (
                <>
                  <TextField
                    label={t("courseInstanceLanguage")}
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
                  {t("createdAt")}{" "}
                  {new Date(
                    data.email_template?.created_at ?? "",
                  ).toLocaleString(locale)}
                </Typography>
                <Typography variant="body2">
                  {t("updatedAt")}{" "}
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
                        await updateEmailTemplateMutation({
                          // FIXME: some weird typing thing
                          variables: omit(state, "__typename" as any) as any,
                        })
                        setSnackbarData({
                          type: "success",
                          message: t("savedSuccessfully"),
                        })
                      } catch {
                        setSnackbarData({
                          type: "error",
                          message: t("saveError"),
                        })
                      }
                      setIsSnackbarOpen(true)
                    }}
                  >
                    {t("update")}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      if (!state?.id) return
                      try {
                        await confirm({
                          title: t("deleteConfirmTitle"),
                          description: t("deleteConfirmDescription", {
                            name: state.name,
                          }),
                          confirmationText: t("delete"),
                          cancellationText: t("cancel"),
                        })
                      } catch {
                        return
                      }
                      try {
                        await deleteEmailTemplateMutation({
                          variables: { id: state.id },
                        })
                        setSnackbarData({
                          type: "success",
                          message: t("deletedSuccessfully"),
                        })

                        const url = `${baseUrl}/email-templates/`
                        setTimeout(() => {
                          Router.push(url)
                        }, 5000)
                      } catch {
                        setSnackbarData({
                          type: "error",
                          message: t("deleteError"),
                        })
                      }
                      setIsSnackbarOpen(true)
                    }}
                  >
                    {t("delete")}
                  </Button>
                </Row>
                <Stretch />
                <CollapseButton
                  open={isHelpOpen}
                  label={t("help")}
                  onClick={() => setIsHelpOpen((s) => !s)}
                />
              </Row>
              <Collapse in={isHelpOpen}>
                <div style={{ margin: "0.5rem", padding: "0.5rem" }}>
                  <Typography variant="subtitle2">{t("helpIntro")}</Typography>
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
                                {value.types.length > 1
                                  ? t("limitedToTypes")
                                  : t("limitedToType")}{" "}
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

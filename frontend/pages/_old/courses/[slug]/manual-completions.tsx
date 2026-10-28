import { useState } from "react"

import { DateTime } from "luxon"
import { useConfirm } from "material-ui-confirm"
import { NextSeo } from "next-seo"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { parse } from "papaparse"

import { useMutation, useQuery } from "@apollo/client"
import {
  Alert,
  AlertTitle,
  Button,
  Container,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { type DatePickerProps } from "@mui/x-date-pickers"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"

import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useIsOld from "/hooks/useIsOld"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withAdminOrCourseOwner from "/lib/with-admin-or-course-owner"
import CoursesTranslations from "/translations/courses"

import {
  AddManualCompletionDocument,
  CourseFromSlugDocument,
} from "/graphql/generated"

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
`

const DynamicDatePicker = dynamic<DatePickerProps<Date | null>>(
  () => import("@mui/x-date-pickers").then((mod) => mod.DatePicker),
  { ssr: false, loading: () => <Skeleton variant="rectangular" /> },
)

interface CompletionData {
  user_id: string
  grade?: string
  completion_date?: string
}

const ManualCompletions = () => {
  const isOld = useIsOld()
  const baseUrl = isOld ? "/_old" : "/admin"
  const { locale } = useRouter()
  const t = useTranslator(CoursesTranslations)
  const confirm = useConfirm()
  const [submitting, setSubmitting] = useState(false)
  const [input, setInput] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [messageTitle, setMessageTitle] = useState<string>("")
  const [messageSeverity, setMessageSeverity] = useState<
    "info" | "error" | "success" | "warning" | undefined
  >("info")
  const [completionDate, setCompletionDate] = useState<Date | null>(null)
  const [
    addCompletions,
    { loading: mutationLoading, error: mutationError, reset: resetMutation },
  ] = useMutation(AddManualCompletionDocument, {
    onCompleted: () => {
      setInput("")
      setMessage(t("manualCompletionsAdded"))
      setMessageTitle(t("manualCompletionsSuccess"))
      setMessageSeverity("success")
    },
  })
  const slug = useQueryParameter("slug") ?? ""
  const {
    data: courseData,
    loading: courseLoading,
    error: courseError,
  } = useQuery(CourseFromSlugDocument, {
    variables: { slug },
  })

  useBreadcrumbs([
    {
      translation: "courses",
      href: `${baseUrl}/courses`,
    },
    {
      label: courseData?.course?.name,
      href: `${baseUrl}/courses/${slug}`,
    },
    {
      translation: "courseManualCompletions",
      href: `${baseUrl}/courses/${slug}/manual-completions`,
    },
  ])
  const title = courseData?.course?.name ?? "..."

  const onSubmit = async () => {
    setSubmitting(true)
    setMessage(null)
    setMessageSeverity("info")
    resetMutation()
    const parsed = parse<CompletionData>(input, {
      header: true,
      delimiter: ",",
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    })
    const parseErrors = parsed.errors.filter((e) => e.code !== "TooFewFields")
    if (parseErrors.length > 0) {
      setMessage(
        parseErrors
          .map((e) =>
            typeof e.row === "number"
              ? `${t("manualCompletionsRow", { row: e.row + 1 })}: ${e.message}`
              : e.message,
          )
          .join("\n"),
      )
      setMessageSeverity("error")
      setMessageTitle(t("manualCompletionsParseError"))
      setSubmitting(false)
      return
    }

    const data: CompletionData[] = parsed.data.map((d) => ({
      ...d,
      user_id: d.user_id?.trim(),
      grade: d.grade ? d.grade.trim() : undefined,
      completion_date:
        d.completion_date === "" || !d.completion_date
          ? completionDate
            ? completionDate?.toString()
            : undefined
          : DateTime.fromISO(d.completion_date).toString(),
    }))
    if (data.length === 0) {
      setMessage(t("manualCompletionsNoRows"))
      setMessageSeverity("error")
      setMessageTitle(t("manualCompletionsNoRowsTitle"))
      setSubmitting(false)
      return
    }
    if (!data.every((o) => o.user_id)) {
      setMessage(t("manualCompletionsMissingUserId"))
      setMessageSeverity("error")
      setMessageTitle(t("manualCompletionsInvalidCsvTitle"))
      setSubmitting(false)
      return
    }

    const invalidUserIds = data
      .map((o, row) => ({ row, userId: o.user_id }))
      .filter(({ userId }) => !/^\d+$/.test(userId))
    if (invalidUserIds.length > 0) {
      setMessage(
        invalidUserIds
          .map(
            ({ row, userId }) =>
              `${t("manualCompletionsRow", { row: row + 1 })}: "${userId}"`,
          )
          .join("\n"),
      )
      setMessageSeverity("error")
      setMessageTitle(t("manualCompletionsInvalidUserId"))
      setSubmitting(false)
      return
    }

    const checkedDates = data.map((o, row) => {
      if (!o.completion_date) {
        return { row, error: undefined, age: 0 }
      }
      const { days } = DateTime.fromISO(o.completion_date ?? "")
        .diff(DateTime.local())
        .shiftTo("days")
        .toObject()
      const error = !days
        ? t("manualCompletionsDateErroneous", { date: o.completion_date })
        : days > 0
        ? t("manualCompletionsDateFuture", {
            days: Math.round(days),
            date: o.completion_date,
          })
        : days < -30 * 4
        ? t("manualCompletionsDatePast", {
            days: -Math.round(days),
            date: o.completion_date,
          })
        : undefined

      return {
        row,
        error,
        age: -Math.floor(days ?? 0),
      }
    })

    const filteredData = data.map((d) =>
      Object.entries(d).reduce((acc, [key, value]) => {
        if (key.trim() === "") return acc

        return { ...acc, [key]: value }
      }, {} as CompletionData),
    )

    const okDates = !checkedDates.some((c) => Boolean(c.error))

    if (!okDates) {
      confirm({
        title: t("manualCompletionsErrorsTitle"),
        description: (
          <span
            style={{
              display: "block",
              maxHeight: "30rem",
              overflow: "auto",
            }}
          >
            {t("manualCompletionsErrorsIntro")}
            <span
              style={{
                display: "block",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
              }}
            >
              {checkedDates
                .filter((c) => Boolean(c.error))
                .map(
                  (c) =>
                    `${t("manualCompletionsRow", { row: c.row + 1 })}: ${
                      c.error
                    }`,
                )
                .join("\n")}
            </span>
          </span>
        ),
        confirmationText: t("manualCompletionsContinue"),
        cancellationText: t("manualCompletionsCancel"),
      })
        .then(() =>
          addCompletions({
            variables: {
              course_slug: slug,
              completions: filteredData,
            },
          }),
        )
        .catch(() => undefined)
        .finally(() => setSubmitting(false))
    } else {
      await addCompletions({
        variables: {
          course_slug: slug,
          completions: filteredData,
        },
      }).catch(() => undefined)
      setSubmitting(false)
    }
  }

  if (courseError || (!courseLoading && !courseData?.course)) {
    return <div>{t("courseNotFound")}</div>
  }
  if (courseLoading) {
    return <div>{t("manualCompletionsLoading")}</div>
  }

  return (
    <>
      <NextSeo title={title} />
      <Container>
        <Typography variant="h3" component="h1">
          {t("manualCompletionsTitle")}
        </Typography>
        {message && (
          <Alert severity={messageSeverity}>
            <AlertTitle>{messageTitle}</AlertTitle>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{message}</pre>
          </Alert>
        )}
        {mutationLoading && <p>{t("manualCompletionsLoading")}...</p>}
        {mutationError && (
          <Alert severity="error">
            <AlertTitle>{t("manualCompletionsAddError")}</AlertTitle>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {mutationError.graphQLErrors.length > 0
                ? mutationError.graphQLErrors.map((e) => e.message).join("\n")
                : mutationError.message}
            </pre>
          </Alert>
        )}
        <br />
        <Typography>{t("manualCompletionsDateHelp")}</Typography>
        <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={locale}>
          <DynamicDatePicker
            onChange={setCompletionDate}
            value={completionDate}
            slotProps={{
              textField: {
                variant: "outlined",
              },
            }}
          />
        </LocalizationProvider>
        <Typography>
          {t("manualCompletionsFormatPre")}{" "}
          <code>user_id[,grade][,completion_date]</code>
          {t("manualCompletionsFormatPost")}
        </Typography>
        <br />
        <StyledTextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          label={t("manualCompletionsCsvLabel")}
          fullWidth
          rows={20}
          multiline
        />
        <Button disabled={submitting} onClick={onSubmit}>
          {t("manualCompletionsSubmit")}
        </Button>
      </Container>
    </>
  )
}

export default withAdminOrCourseOwner(ManualCompletions)

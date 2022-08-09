import { useState } from "react"

import { DateTime } from "luxon"
import { useConfirm } from "material-ui-confirm"
import { NextSeo } from "next-seo"
import { withRouter } from "next/router"
import * as Papa from "papaparse"

import { useMutation, useQuery } from "@apollo/client"
import styled from "@emotion/styled"
import AdapterLuxon from "@mui/lab/AdapterLuxon"
import DatePicker from "@mui/lab/DatePicker"
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import { Button, Container, TextField } from "@mui/material"
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Typography from "@mui/material/Typography"

import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useSubtitle from "/hooks/useSubtitle"
import withAdmin from "/lib/with-admin"
import { useQueryParameter } from "/util/useQueryParameter"

import {
  AddManualCompletionDocument,
  CourseFromSlugDocument,
} from "/static/types/generated"

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
`

interface CompletionData {
  user_id: string
  grade?: string
  completion_date?: string
}

const ManualCompletions = () => {
  const confirm = useConfirm()

  const [submitting, setSubmitting] = useState(false)
  const [input, setInput] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [messageTitle, setMessageTitle] = useState<string>("")
  const [messageSeverity, setMessageSeverity] = useState<
    "info" | "error" | "success" | "warning" | undefined
  >("info")
  const [completionDate, setCompletionDate] = useState<DateTime | null>(null)
  const [addCompletions, { loading: mutationLoading, error: mutationError }] =
    useMutation(AddManualCompletionDocument, {
      onCompleted: () => {
        setInput("")
        setMessage("Completions added")
        setMessageTitle("Success")
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
      href: `/courses`,
    },
    {
      label: courseData?.course?.name,
      href: `/courses/${slug}`,
    },
    {
      translation: "courseManualCompletions",
      href: `/courses/${slug}/manual-completions`,
    },
  ])
  const title = useSubtitle(courseData?.course?.name)

  const onSubmit = () => {
    setSubmitting(true)
    setMessage(null)
    setMessageSeverity("info")
    const parsed = Papa.parse<CompletionData>(input, { header: true })
    if (parsed.errors.length > 0) {
      setMessage(JSON.stringify(parsed.errors, undefined, 2))
      setMessageSeverity("error")
      setMessageTitle("Error while parsing csv")
      setSubmitting(false)
      return
    }

    const data: CompletionData[] = parsed.data.map((d) => ({
      ...d,
      completion_date:
        d.completion_date === "" || !d.completion_date
          ? completionDate
            ? completionDate?.toString()
            : undefined
          : DateTime.fromISO(d.completion_date).toString(),
    }))
    console.log(data)
    if (data.length === 0) {
      setMessage("Parsed 0 rows from csv. Did you only include the header row?")
      setMessageSeverity("error")
      setMessageTitle("No rows found")
      setSubmitting(false)
      return
    }
    if (!data.every((o) => o.user_id)) {
      setMessage("Did not find column user_id for each row.")
      setMessageSeverity("error")
      setMessageTitle("Invalid csv")
      setSubmitting(false)
      return
    }

    const checkedDates = data.map((o, row) => {
      const { days } = DateTime.fromISO(o.completion_date ?? "")
        .diff(DateTime.local())
        .shiftTo("days")
        .toObject()
      const error = !days
        ? `The date is erroneous ((${o.completion_date})`
        : days > 0
        ? `The date is ${Math.round(days)} days in the future (${
            o.completion_date
          })`
        : days < -30 * 4
        ? `The date is ${-Math.round(days)} days in the past (${
            o.completion_date
          })`
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
        title: "There are errors",
        description: (
          <div
            style={{
              maxHeight: "30rem",
              overflow: "scroll",
            }}
          >
            There were errors in your data:
            <pre>
              {checkedDates
                .filter((c) => Boolean(c.error))
                .map((c) => `Row ${c.row}: ${c.error}`)
                .join("\n")}
            </pre>
          </div>
        ),
        confirmationText: "Continue anyway",
        cancellationText: "Cancel",
      })
        .then(() =>
          addCompletions({
            variables: {
              course_id: courseData!.course!.id,
              completions: filteredData,
            },
          }),
        )
        .catch(() => setSubmitting(false))
        .finally(() => setSubmitting(false))
    } else {
      addCompletions({
        variables: {
          course_id: courseData!.course!.id,
          completions: filteredData,
        },
      })
      setSubmitting(false)
    }
  }

  if (courseError) {
    return <div>Could not find course</div>
  }
  if (courseLoading) {
    return <div>Loading</div>
  }

  return (
    <>
      <NextSeo title={title} />
      <Container>
        <Typography variant="h3" component="h1">
          Manually add completions
        </Typography>
        {message && (
          <Alert severity={messageSeverity}>
            <AlertTitle>{messageTitle}</AlertTitle>
            <pre>{message}</pre>
          </Alert>
        )}
        {mutationLoading && <p>Loading...</p>}
        {mutationError && (
          <Alert severity="error">
            <AlertTitle>Error while adding completions:</AlertTitle>
            <pre>{JSON.stringify(mutationError, undefined, 2)}</pre>
          </Alert>
        )}
        <br />
        <Typography>
          Completion date (optional) - if provided, will be default for every
          completion with no date set
        </Typography>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <DatePicker
            inputFormat="yyyy-MM-dd"
            onChange={setCompletionDate}
            value={completionDate}
            renderInput={(props: any) => (
              <TextField {...props} variant="outlined" />
            )}
          />
        </LocalizationProvider>
        <Typography>
          Format: csv with header with fields:{" "}
          <code>user_id[,grade][,completion_date]</code> - optional date in ISO
          8601 format. At least one comma in header required, so if only user_id
          is given, please give header as <code>user_id,</code>
        </Typography>
        <br />
        <StyledTextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          label="csv"
          fullWidth
          rows={20}
          maxRows={5000}
          multiline
        />
        <Button disabled={submitting} onClick={onSubmit}>
          Add completions
        </Button>
      </Container>
    </>
  )
}

export default withRouter(withAdmin(ManualCompletions) as any)

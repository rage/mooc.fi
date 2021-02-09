import { useState } from "react"
import Typography from "@material-ui/core/Typography"
import { withRouter } from "next/router"
import withAdmin from "/lib/with-admin"
import { Container, TextField, Button } from "@material-ui/core"
import * as Papa from "papaparse"
import styled from "@emotion/styled"
import Alert from "@material-ui/lab/Alert"
import AlertTitle from "@material-ui/lab/AlertTitle"
import { gql, useMutation, useQuery } from "@apollo/client"
import { useQueryParameter } from "/util/useQueryParameter"
import DatePicker from "@material-ui/lab/DatePicker"
import LocalizationProvider from "@material-ui/lab/LocalizationProvider"
import AdapterLuxon from "@material-ui/lab/AdapterLuxon"
import { DateTime } from "luxon"

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
`

const AddManualCompletionQuery = gql`
  mutation AddManualCompletion(
    $course_id: String!
    $completions: [ManualCompletionArg!]
  ) {
    addManualCompletion(course_id: $course_id, completions: $completions) {
      id
      created_at
      updated_at
      completion_language
      grade
      user {
        upstream_id
        username
        email
      }
    }
  }
`

export const CourseIdBySluq = gql`
  query CourseIdBySluq($slug: String) {
    course(slug: $slug) {
      id
    }
  }
`

const ManualCompletions = () => {
  const [submitting, setSubmitting] = useState(false)
  const [input, setInput] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [messageTitle, setMessageTitle] = useState<string>("")
  const [messageSeverity, setMessageSeverity] = useState<
    "info" | "error" | "success" | "warning" | undefined
  >("info")
  const [completionDate, setCompletionDate] = useState<DateTime | null>(null)

  const [
    addCompletions,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(AddManualCompletionQuery, {
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
  } = useQuery(CourseIdBySluq, {
    variables: { slug },
  })
  if (courseError) {
    return <div>Could not find course</div>
  }
  if (courseLoading) {
    return <div>Loading</div>
  }
  return (
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
          renderInput={(props) => <TextField {...props} variant="outlined" />}
        />
      </LocalizationProvider>
      <Typography>
        Format: csv with header with fields: user_id,grade[,completion_date] -
        optional date in ISO 8601 format
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
      <Button
        disabled={submitting}
        onClick={() => {
          setSubmitting(true)
          setMessage(null)
          setMessageSeverity("info")
          const parsed = Papa.parse(input, { header: true })
          if (parsed.errors.length > 0) {
            setMessage(JSON.stringify(parsed.errors, undefined, 2))
            setMessageSeverity("error")
            setMessageTitle("Error while parsing csv")
            setSubmitting(false)
            return
          }

          const data: {
            user_id: string
            grade: string
            completion_date?: string
          }[] = parsed.data.map((d: any) => ({
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
            setMessage(
              "Parsed 0 rows from csv. Did you only include the header row?",
            )
            setMessageSeverity("error")
            setMessageTitle("No rows found")
            setSubmitting(false)
            return
          }
          if (!data.every((o) => o.user_id && o.grade)) {
            setMessage("Did not find columns user_id and grade for each row.")
            setMessageSeverity("error")
            setMessageTitle("Invalid csv")
            setSubmitting(false)
            return
          }

          addCompletions({
            variables: { course_id: courseData.course.id, completions: data },
          })
          setSubmitting(false)
        }}
      >
        Add completions
      </Button>
    </Container>
  )
}

export default withRouter(withAdmin(ManualCompletions) as any)

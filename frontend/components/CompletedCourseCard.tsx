import React from "react"
import styled from "styled-components"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import DoneIcon from "@material-ui/icons/Done"

const Background = styled(Paper)`
  background-color: white;

  position: relative;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  @media (min-width: 600px) {
    flex-direction: row;
  }
  height: 100%;
  width: 100%;
`

const CourseTitle = styled(Typography)`
  margin: 0.5rem;
  padding-left: 1rem;
`
const CardText = styled(Typography)`
  margin: 0.5rem;
  padding-top: 0.2rem;
`
const RegistrationDetails = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 600px) {
    flex-direction: row;
  }
`

type Organization = {
  slug: string
}
type Registration = {
  id: any
  created_at: any
  organization: Organization
}
type Course = {
  id: any
  slug: string
  name: string
}
type Completion = {
  id: any
  completion_language: string
  student_number: string
  created_at: any
  course: Course
  completions_registered: Registration[]
}
interface CourseCardProps {
  completion: Completion
}

function CompletedCourseCard(props: CourseCardProps) {
  const { completion } = props
  const isRegistered = completion.completions_registered.length > 0
  return (
    <Grid item xs={12}>
      <Background>
        <CourseTitle component="h3" variant="h6" gutterBottom={true}>
          {completion.course.name}
        </CourseTitle>
        <CardText>Completed: {completion.created_at}</CardText>
        <CardText>{completion.completion_language}</CardText>
        {isRegistered ? (
          completion.completions_registered.map(r => (
            <RegistrationDetails>
              <CardText>Registered: {r.created_at}</CardText>
              <CardText>{r.organization}</CardText>

              <DoneIcon style={{ color: "green", marginTop: "0.5rem" }} />
            </RegistrationDetails>
          ))
        ) : (
          <Button
            href={`/register-completion`}
            style={{ color: "red", marginRight: "0.5rem" }}
          >
            Register
          </Button>
        )}
      </Background>
    </Grid>
  )
}

export default CompletedCourseCard

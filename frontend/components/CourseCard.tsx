import React from "react"
import {
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia as MUICardMedia,
  Button,
} from "@material-ui/core"

import DashboardIcon from "@material-ui/icons/Dashboard"
import EditIcon from "@material-ui/icons/Edit"
import { Add as AddIcon, AddCircle as AddCircleIcon } from "@material-ui/icons"
import CourseImage from "./CourseImage"
import { AllEditorCourses_courses } from "/static/types/generated/AllEditorCourses"
import styled from "styled-components"
import LangLink from "/components/LangLink"
import { CardTitle } from "/components/Text/headers"

const CardBase = styled(Card)<{ ishidden?: number | null }>`
  padding: 0.8em;
  background-color: ${props => (props.ishidden ? "#E0E0E0" : "#FFFFFF")};
  box-shadow: 18px 7px 28px -12px rgba(0, 0, 0, 0.41);
  &:hover {
    box-shadow: 18px 7px 48px -12px rgba(0, 0, 0, 1);
  }
  height: 100%;
  display: flex;
  flex-direction: column;
`

const StyledButton = styled(Button)`
  margin: 0.5rem;
  color: #4e4637;
  font-size: 18px;
  text-decoration: none;
  padding: 0.5em;
`

const CardMedia = styled(MUICardMedia)`
  width: 100%;
  height: 250px;
  object-fit: cover;
`
const StyledLink = styled.a`
  text-decoration: none;
`
const CourseCard = React.memo(
  ({ course }: { course?: AllEditorCourses_courses }) => (
    <Grid item xs={12} sm={6} lg={3}>
      <CardBase ishidden={course && course.hidden ? 1 : undefined}>
        <CardMedia>
          {course ? (
            <CourseImage photo={course.photo} alt={course.name} />
          ) : (
            <LangLink href={`/courses/new`}>
              <a>
                <Grid
                  container
                  justify="center"
                  alignItems="center"
                  style={{ height: "100%" }}
                >
                  <AddCircleIcon fontSize="large" />
                </Grid>
              </a>
            </LangLink>
          )}
        </CardMedia>
        <CardContent style={{ flex: 1 }}>
          <CardTitle variant="h3" component="h2" align="left">
            {course ? course.name : "New Course"}
          </CardTitle>
        </CardContent>
        <CardActionArea component="div">
          {course ? (
            <React.Fragment>
              <LangLink as={`/courses/${course.slug}`} href="/courses/[id]">
                <StyledLink
                  aria-label={`To the homepage of course ${course.name}`}
                >
                  <StyledButton variant="text" startIcon={<DashboardIcon />}>
                    Dashboard
                  </StyledButton>
                </StyledLink>
              </LangLink>
              <LangLink
                href="/courses/[id]/edit"
                as={`/courses/${course.slug}/edit`}
                prefetch={false}
              >
                <StyledLink>
                  <StyledButton variant="text" startIcon={<EditIcon />}>
                    Edit
                  </StyledButton>
                </StyledLink>
              </LangLink>
            </React.Fragment>
          ) : (
            <LangLink href={`/courses/new`}>
              <a>
                <Button variant="contained" color="secondary" fullWidth>
                  <AddIcon />
                  Create
                </Button>
              </a>
            </LangLink>
          )}
        </CardActionArea>
      </CardBase>
    </Grid>
  ),
)

export default CourseCard

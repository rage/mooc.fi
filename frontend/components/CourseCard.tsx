import React from "react"
import { Grid, CardContent, CardActionArea, Button } from "@material-ui/core"

import DashboardIcon from "@material-ui/icons/Dashboard"
import EditIcon from "@material-ui/icons/Edit"
import { Add as AddIcon, AddCircle as AddCircleIcon } from "@material-ui/icons"
import CourseImage from "./CourseImage"
import { AllEditorCourses_courses } from "/static/types/generated/AllEditorCourses"
import styled from "styled-components"
import LangLink from "/components/LangLink"
import { CardTitle } from "/components/Text/headers"
import { ClicableButtonBase } from "/components/Surfaces/ClicableCard"
import { CourseImageBase } from "/components/Images/CardBackgroundFullCover"

const CardBase = styled(ClicableButtonBase)<{ ishidden?: number | null }>`
  background-color: ${props => (props.ishidden ? "#E0E0E0" : "#FFFFFF")};
  height: 100%;
  width: 100%;
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

const StyledLink = styled.a`
  text-decoration: none;
`
const CourseCard = React.memo(
  ({ course }: { course?: AllEditorCourses_courses }) => (
    <Grid item xs={12} sm={4} lg={3}>
      <CardBase ishidden={course?.hidden ? 1 : undefined}>
        <CourseImageBase>
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
        </CourseImageBase>
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

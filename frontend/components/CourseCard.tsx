import React from "react"
import { Grid, CardContent, CardActionArea } from "@material-ui/core"

import DashboardIcon from "@material-ui/icons/Dashboard"
import EditIcon from "@material-ui/icons/Edit"
import { Add as AddIcon, AddCircle as AddCircleIcon } from "@material-ui/icons"
import CourseImage from "./CourseImage"
import { AllEditorCourses_courses } from "/static/types/generated/AllEditorCourses"
import styled from "styled-components"
import LangLink from "/components/LangLink"
import { CardTitle } from "/components/Text/headers"
import { ClickableButtonBase } from "/components/Surfaces/ClickableCard"
import { CourseImageBase } from "/components/Images/CardBackgroundFullCover"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import Skeleton from "@material-ui/lab/Skeleton"

const CardBase = styled(ClickableButtonBase)<{
  ishidden?: number | null
  component?: any
}>`
  background-color: ${props => (props.ishidden ? "#E0E0E0" : "#FFFFFF")};
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const StyledLink = styled.a`
  text-decoration: none;
`
interface CourseCardProps {
  course?: AllEditorCourses_courses
  loading?: boolean
}

const CourseCard = React.memo(({ course, loading }: CourseCardProps) => (
  <Grid item xs={12} sm={4} lg={3}>
    <CardBase component="div" ishidden={course?.hidden ? 1 : undefined}>
      <CourseImageBase>
        {loading ? (
          <Skeleton variant="rect" height="100%" />
        ) : course ? (
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
      <CardContent style={{ flex: 1, width: "100%" }}>
        <CardTitle variant="h3" component="h2" align="center">
          {loading ? (
            <Skeleton variant="text" />
          ) : course ? (
            course.name
          ) : (
            "New Course"
          )}
        </CardTitle>
      </CardContent>
      <CardActionArea component="div" style={{ display: "flex" }}>
        {loading ? (
          <>
            <Skeleton variant="rect" width="100%" />
          </>
        ) : course ? (
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
            <StyledLink>
              <StyledButton variant="text" color="secondary">
                <AddIcon />
                Create
              </StyledButton>
            </StyledLink>
          </LangLink>
        )}
      </CardActionArea>
    </CardBase>
  </Grid>
))

export default CourseCard

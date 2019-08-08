import React from "react"
import {
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia as MUICardMedia,
  Typography,
  Button,
} from "@material-ui/core"
import DashboardIcon from "@material-ui/icons/Dashboard"
import EditIcon from "@material-ui/icons/Edit"
import { Add as AddIcon, AddCircle as AddCircleIcon } from "@material-ui/icons"
import NextI18Next from "i18n"
import CourseImage from "./CourseImage"
import { AllCourses_courses } from "/static/types/generated/AllCourses"
import styled from "styled-components"

const CardBase = styled(Card)`
  padding: 0.8em;
`

const CardMedia = styled(MUICardMedia)`
  width: 100%;
  height: 250px;
  object-fit: cover;
`

const CourseCard = ({ course }: { course?: AllCourses_courses }) => (
  <Grid item xs={12} sm={6} lg={3}>
    <CardBase>
      <CardMedia>
        {course ? (
          <CourseImage photo={course.photo} alt={course.name} />
        ) : (
          <NextI18Next.Link href={`/courses/new`}>
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
          </NextI18Next.Link>
        )}
      </CardMedia>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom={true}>
          {course ? course.name : "New Course"}
        </Typography>
      </CardContent>
      <CardActionArea>
        {course ? (
          <React.Fragment>
            <NextI18Next.Link
              as={`/courses/${course.slug}`}
              href="/courses/[id]"
            >
              <a aria-label={`To the homepage of course ${course.name}`}>
                <Button variant="contained" color="secondary" fullWidth>
                  <DashboardIcon />
                  Course Dashboard
                </Button>
              </a>
            </NextI18Next.Link>
            <NextI18Next.Link
              as={`/courses/${course.slug}/edit`}
              href={`/courses/[id]/edit`}
            >
              <a>
                <Button variant="contained" color="secondary" fullWidth>
                  <EditIcon />
                  Edit
                </Button>
              </a>
            </NextI18Next.Link>
          </React.Fragment>
        ) : (
          <NextI18Next.Link href={`/courses/new`}>
            <a>
              <Button variant="contained" color="secondary" fullWidth>
                <AddIcon />
                Create
              </Button>
            </a>
          </NextI18Next.Link>
        )}
      </CardActionArea>
    </CardBase>
  </Grid>
)

export default CourseCard

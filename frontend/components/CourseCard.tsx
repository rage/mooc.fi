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
import CourseImage from "./CourseImage"
import { AllCourses_courses } from "/static/types/generated/AllCourses"
import styled from "styled-components"
import Link from "/components/LangLink"

const CardBase = styled(Card)<{ ishidden?: boolean | null }>`
  padding: 0.8em;
  background-color: ${props => (props.ishidden ? "#E0E0E0" : "#FFFFFF")};
`

const CardMedia = styled(MUICardMedia)`
  width: 100%;
  height: 250px;
  object-fit: cover;
`

const CourseCard = ({ course }: { course?: AllCourses_courses }) => (
  <Grid item xs={12} sm={6} lg={3}>
    <CardBase ishidden={course && course.hidden}>
      <CardMedia>
        {course ? (
          <CourseImage photo={course.photo} alt={course.name} />
        ) : (
          <Link href={`/courses/new`}>
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
          </Link>
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
            <Link as={`/courses/${course.slug}`} href="/[lng]/courses/[id]">
              <a aria-label={`To the homepage of course ${course.name}`}>
                <Button variant="contained" color="secondary" fullWidth>
                  <DashboardIcon />
                  Course Dashboard
                </Button>
              </a>
            </Link>
            <Link
              as={`/courses/${course.slug}/edit`}
              href={`/[lng]/courses/[id]/edit`}
            >
              <a>
                <Button variant="contained" color="secondary" fullWidth>
                  <EditIcon />
                  Edit
                </Button>
              </a>
            </Link>
          </React.Fragment>
        ) : (
          <Link href={`/[lng]/courses/new`}>
            <a>
              <Button variant="contained" color="secondary" fullWidth>
                <AddIcon />
                Create
              </Button>
            </a>
          </Link>
        )}
      </CardActionArea>
    </CardBase>
  </Grid>
)

export default CourseCard

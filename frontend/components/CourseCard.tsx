import React from "react"
import {
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Typography,
  Button,
  ButtonBase,
} from "@material-ui/core"
import DashboardIcon from "@material-ui/icons/Dashboard"
import EditIcon from "@material-ui/icons/Edit"
import { Add as AddIcon, AddCircle as AddCircleIcon } from "@material-ui/icons"
import NextI18Next from "../i18n"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import get from "lodash/get"
import { AllCourses_courses } from "./../static/types/AllCourses"
import { addDomain } from "../util/imageUtils"
import CourseImage from "./CourseImage"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      padding: "0.8em",
    },
    media: {
      // minHeight: 250,
      width: "100%",
      height: 250,
      objectFit: "cover",
    },
  }),
)

function CourseCard({
  course,
  key,
}: {
  course?: AllCourses_courses
  key: string
}) {
  const classes = useStyles()

  //  require(`../static/images/courseimages/${course.slug}.png`)
  // removed doggos as a placeholder for the time being

  return (
    <Grid item xs={12} sm={6} lg={3}>
      <Card className={classes.card}>
        <CardMedia
          /*           component={course ? "img" : "div"}
          alt="Course Logo"
          image={
            course
              ? addDomain(get(course, "photo.compressed"))
              : undefined
          }*/
          className={classes.media}
        >
          {course ? (
            <CourseImage photo={course.photo} status={course.status} />
          ) : (
            <NextI18Next.Link as={`/courses/new`} href={`/courses/new`}>
              <a href="/courses/new">
                <Grid
                  container
                  justify="center"
                  alignItems="center"
                  style={{ height: "100%" }}
                  // style={{ display: "flex", height: "100%" }}
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
                as={`/course/${course.slug}`}
                href={`/course?course=${course.slug}`}
              >
                <a
                  href={`/course?course=${course.slug}`}
                  aria-label={`To the homepage of course ${course.name}`}
                >
                  <Button variant="contained" color="secondary" fullWidth>
                    <DashboardIcon />
                    Course Dashboard
                  </Button>
                </a>
              </NextI18Next.Link>
              <NextI18Next.Link
                as={`/courses/${course.slug}/edit`}
                href={`/courses/${course.slug}/edit`}
              >
                <a href={`/courses/${course.slug}/edit`}>
                  <Button variant="contained" color="secondary" fullWidth>
                    <EditIcon />
                    Edit
                  </Button>
                </a>
              </NextI18Next.Link>
            </React.Fragment>
          ) : (
            <NextI18Next.Link as={`/courses/new`} href={`/courses/new`}>
              <a href="/courses/new">
                <Button variant="contained" color="secondary" fullWidth>
                  <AddIcon />
                  Create
                </Button>
              </a>
            </NextI18Next.Link>
          )}
        </CardActionArea>
      </Card>
    </Grid>
  )
}

export default CourseCard

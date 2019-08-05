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
import NextI18Next from "i18n"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import CourseImage from "./CourseImage"
import { AllCourses_courses } from "static/types/AllCourses"

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

function CourseCard({ course }: { course?: AllCourses_courses }) {
  const classes = useStyles()

  //  require(`../static/images/courseimages/${course.slug}.png`)
  // removed doggos as a placeholder for the time being

  return (
    <Grid item xs={12} sm={6} lg={3}>
      <Card className={classes.card}>
        <CardMedia className={classes.media}>
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
              <NextI18Next.Link href={`/courses/${course.slug}`}>
                <a aria-label={`To the homepage of course ${course.name}`}>
                  <Button variant="contained" color="secondary" fullWidth>
                    <DashboardIcon />
                    Course Dashboard
                  </Button>
                </a>
              </NextI18Next.Link>
              <NextI18Next.Link href={`/courses/${course.slug}/edit`}>
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
      </Card>
    </Grid>
  )
}

export default CourseCard

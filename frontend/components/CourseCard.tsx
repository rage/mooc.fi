import React from "react"
import {
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Typography,
  Button,
} from "@material-ui/core"
import DashboardIcon from "@material-ui/icons/Dashboard"
import EditIcon from "@material-ui/icons/Edit"
import NextI18Next from "../i18n"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      padding: "0.8em",
    },
    media: {
      height: 250,
    },
  }),
)

function CourseCard({ course }) {
  const classes = useStyles()
  return (
    <Grid item xs={12} sm={6} lg={3}>
      <Card className={classes.card}>
        <CardMedia
          component="img"
          alt="Course Logo"
          image={require(`../static/images/courseimages/${course.slug}.png`)}
          className={classes.media}
        />
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom={true}>
            {course.name}
          </Typography>
        </CardContent>
        <CardActionArea>
          <NextI18Next.Link
            as={`/course/${course.slug}`}
            href={`/course?course=${course.slug}`}
          >
            <a href={`/course?course=${course.slug}`}>
              <Button variant="contained" color="secondary" fullWidth>
                <DashboardIcon />
                Course Dashboard
              </Button>
            </a>
          </NextI18Next.Link>
          <NextI18Next.Link
            as={`/courses/${course.slug}/edit`}
            href={`/edit-course?course=${course.slug}`}
          >
            <a href={`/edit-course?course=${course.slug}`}>
              <Button variant="contained" color="secondary" fullWidth>
                <EditIcon />
                Edit
              </Button>
            </a>
          </NextI18Next.Link>
        </CardActionArea>
      </Card>
    </Grid>
  )
}

export default CourseCard

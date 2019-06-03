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
import Link from "next/link"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      padding: "0.8em",
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
          image={`../static/images/courseimages/${course.slug}.png`}
        />
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom={true}>
            {course.name}
          </Typography>
        </CardContent>
        <CardActionArea>
          <Link
            as={`/course/${course.slug}`}
            href={`/course?course=${course.slug}`}
          >
            <Button variant="contained" color="secondary" fullWidth>
              <DashboardIcon />
              Course Dashboard
            </Button>
          </Link>
        </CardActionArea>
      </Card>
    </Grid>
  )
}

export default CourseCard

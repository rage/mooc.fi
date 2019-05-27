import React from "react"
import {
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Typography,
  Button
} from "@material-ui/core"
import DashboardIcon from '@material-ui/icons/Dashboard'
import Link from 'next/link'

function CourseCard({ course }) {
  console.log(course.name)
  return (
    <Grid item xs={12} sm={6} lg={3}  >
      <Card>
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
          <Link as={`/course/${course.slug}`} href={`/course?course=${course.slug}`}>
            <Button
            variant='contained'
            color='secondary'
            size='large'
           >
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

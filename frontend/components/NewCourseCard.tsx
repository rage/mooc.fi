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
import { Add as AddIcon, AddCircle as AddCircleIcon } from "@material-ui/icons"
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
    header: {
      height: 250
    }
  }),
)

function NewCourseCard() {
  const classes = useStyles()

  return (
    <Grid item xs={12} sm={6} lg={3}>
      <Card className={classes.card}>
        <CardMedia
          component="div"
          alt="Course Logo"
          image={''}
          //image={''}
          className={classes.media}
        >
          <Grid container justify="center" alignItems="center" style={{ display: 'flex', height: '100%' }}>
            <AddCircleIcon fontSize='large' />
          </Grid>
        </CardMedia>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom={true}>
            New course
          </Typography>
        </CardContent>
        <CardActionArea>
          <NextI18Next.Link
            as={`/courses/new`}
            href={`/new-course`}
          >
            <a href='/new-course'>
              <Button variant="contained" color="secondary" fullWidth>
                <AddIcon />
                Create
              </Button>
            </a>
          </NextI18Next.Link>
        </CardActionArea>
      </Card>
    </Grid>
  )
}

export default NewCourseCard
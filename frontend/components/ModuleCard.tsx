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
import { AllModules_study_modules } from "./../static/types/AllModules"
/* import { addDomain } from "../util/imageUtils"
import CourseImage from "./CourseImage" */

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

function ModuleCard({ module }: { module?: AllModules_study_modules }) {
  const classes = useStyles()

  //  require(`../static/images/courseimages/${course.slug}.png`)
  // removed doggos as a placeholder for the time being

  return (
    <Grid item xs={12} sm={6} lg={3}>
      <Card className={classes.card}>
        <CardMedia className={classes.media}>
          {module ? (
            <p>module image placeholder</p>
          ) : (
            <NextI18Next.Link
              as={`/study-modules/new`}
              href={`/study-modules/new`}
            >
              <a href="/study-modules/new">
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
            {module ? "Module name placeholder" : "New Module"}
          </Typography>
        </CardContent>
        <CardActionArea>
          {module ? (
            <React.Fragment>
              <NextI18Next.Link
                as={`/study-modules/${module.id}`}
                href={`/study-modules/${module.id}`}
              >
                <a
                  href={`/study-modules/${module.id}`}
                  aria-label={`To the homepage of study module ${"placeholder"}`}
                >
                  <Button variant="contained" color="secondary" fullWidth>
                    <DashboardIcon />
                    Module Dashboard
                  </Button>
                </a>
              </NextI18Next.Link>
              <NextI18Next.Link
                as={`/study-modules/${module.id}/edit`}
                href={`/study-modules/${module.id}/edit`}
              >
                <a href={`/study-modules/${module.id}/edit`}>
                  <Button variant="contained" color="secondary" fullWidth>
                    <EditIcon />
                    Edit
                  </Button>
                </a>
              </NextI18Next.Link>
            </React.Fragment>
          ) : (
            <NextI18Next.Link
              as={`/study-modules/new`}
              href={`/study-modules/new`}
            >
              <a href="/study-mdules/new">
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

export default ModuleCard

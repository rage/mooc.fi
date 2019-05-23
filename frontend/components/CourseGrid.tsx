<<<<<<< HEAD
import React  from 'react';
import { Grid
        } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CourseCard from './CourseCard'
=======
import React from "react"
import { Grid } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import CourseCard from "./CourseCard"
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
<<<<<<< HEAD
     padding: '0.7em',
    }
  }),
);

function CourseGrid({ courses }) {
    const classes = useStyles()
    
    return(
      <section>
        <Grid container className={classes.grid}>
            {courses.map(course => <CourseCard key={course.id} course={course}/>)}
        </Grid>
      </section>
    )
  }

export default CourseGrid
=======
      padding: "0.7em",
    },
  }),
)

function CourseGrid({ courses }) {
  const classes = useStyles()

  return (
    <section>
      <Grid container className={classes.grid}>
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </Grid>
    </section>
  )
}

export default CourseGrid
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e

import React  from 'react';
import { Grid
        } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CourseCard from './CourseCard'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
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
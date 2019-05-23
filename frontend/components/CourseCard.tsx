import React  from 'react';
import { Grid,
        Card,
        CardContent,
        CardActionArea,
        CardMedia,
        Typography,
        } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    griditem: {
     padding: '1em',
    }
  }),
);



function CourseCard({ course }) {
    const classes = useStyles()
    console.log(course.name)
    return(
      <Grid item className={classes.griditem}>
          <Card>
              <CardActionArea>
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
              </CardActionArea>
          </Card>
      </Grid>
        
    )
  }

export default CourseCard
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


function DashboardOption(props:any) {
    const classes = useStyles()
    const {title, subtitle, icon} = props
    console.log(icon)
    return(
      <Grid item className={classes.griditem}>
          <Card>
              <CardActionArea>
                  <CardContent>
                      { icon }
                      <Typography variant="h5" component="h2" gutterBottom={true}>
                          {title}
                      </Typography>
                      <Typography variant="body1" paragraph>
                          {subtitle}
                      </Typography>
                  </CardContent>
              </CardActionArea>
          </Card>
      </Grid>
        
    )
  }

export default DashboardOption
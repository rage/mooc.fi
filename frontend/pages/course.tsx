import  React,{ useState } from "react";
import {  Typography, Grid } from '@material-ui/core'
import { NextContext } from "next";
import { isSignedIn, isAdmin } from "../lib/authentication";
import redirect from "../lib/redirect";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ApolloClient, gql } from "apollo-boost";
import { AllCourses as AllCoursesData } from "./__generated__/AllCourses";
import { useQuery } from "react-apollo-hooks";
import AdminError from '../components/AdminError'
import DashboardOption from '../components/DashboardOption'
import ViewListIcon from '@material-ui/icons/ViewList'
import ScatterplotIcon from '@material-ui/icons/ScatterPlot'
import LanguageSelectorBar from '../components/LanguageSelectorBar'

export const AllCoursesQuery = gql`
query AllCourses {
  courses {
    id
    name
    slug
  }
  currentUser {
    id
    administrator
  }
}
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      margin: 'auto',
      padding: '0.5em'
    },
    gridItem: {
      margin: '0.5em'
    }
  }),
);


const  Course = ({ admin } ) => {

    const [languageValue, setLanguageValue] = useState(4)
    const [ course, setCourse ] = useState('')


    const classes = useStyles()

    const handleChange = (event, value) => {
      setLanguageValue(value)
    }

    const { loading, error, data } = useQuery<AllCoursesData>(
      AllCoursesQuery
    );

    if(error){
      <div>
        Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
      </div>
    }
    
    if (!admin) {
      return <AdminError />
    }

    if (loading || !data) {
        return <div>Loading</div>;
    }

    return (
      <section>
        <Typography 
          component='h1' 
          variant='h2' 
          align='center'
          className={classes.title}>
            Elements of Ai
        </Typography>
        <LanguageSelectorBar
          value={languageValue}
          handleChange={handleChange} />
        <Grid container>
          <DashboardOption 
            title='Completions'
            subtitle='See all students who have completed the course'
            icon={<ViewListIcon />}/>
          <DashboardOption 
            title='Points'
            subtitle='See the points of all students'
            icon={<ScatterplotIcon />} />
        </Grid>
      </section>
        
    )
  }

Course.getInitialProps = function(context: NextContext) {
    const admin = isAdmin(context)
    console.log(admin)
    if (!isSignedIn(context)) {
      redirect(context, "/sign-in");
    }
    return {
      admin,
      namespacesRequired: ['common'],
    };
  };

export default Course
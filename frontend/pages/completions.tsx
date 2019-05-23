<<<<<<< HEAD
import  React,{ useState } from "react";
import {  Typography,
           } from '@material-ui/core'
import { NextContext } from "next";
import { isSignedIn, isAdmin } from "../lib/authentication";
import redirect from "../lib/redirect";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ApolloClient, gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import AdminError from '../components/AdminError'
import CompletionsList from '../components/CompletionsList'
import LanguageSelectorBar from '../components/LanguageSelectorBar'
import { AllCompletions as AllCompletionsData} from "./__generated__/AllCompletions";

export const AllCompletionsQuery = gql`
query AllCompletions
  { completions(course: "elements-of-ai" first:40) {
    id
    email
    completion_language
    created_at
    user{
      first_name
      last_name
      student_number
      }
    }
  }

`;
=======
import React, { useState } from "react"
import { Typography, Table } from "@material-ui/core"
import { NextContext } from "next"
import { isSignedIn, isAdmin } from "../lib/authentication"
import redirect from "../lib/redirect"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { ApolloClient, gql } from "apollo-boost"
import { AllCourses as AllCoursesData } from "./__generated__/AllCourses"
import { useQuery } from "react-apollo-hooks"
import AdminError from "../components/AdminError"
import { WideContainer } from "../components/Container"

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
`
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
<<<<<<< HEAD
      margin: 'auto',
      padding: '0.5em'
    }
  }),
);


const  Completions= ({ admin } ) => {

    const [languageValue, setLanguageValue] = useState(4)
    const [ courseDetails, setCourseDetails ] = useState({})


    const classes = useStyles()

    const handleChange = (event, value) => {
      setLanguageValue(value)
    }

    const { loading, error, data } = useQuery<AllCompletionsData>(
      AllCompletionsQuery
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
    console.log(data)
    return (
      <section>
        <Typography 
          component='h1' 
          variant='h2' 
          align='center'
          className={classes.title}>
            Completions
        </Typography>
        <LanguageSelectorBar 
          value={languageValue}
          handleChange={handleChange} />
        <CompletionsList completions={data.completions}/>

      </section>
        
    )
  }

Completions.getInitialProps = function(context: NextContext) {
    const admin = isAdmin(context)
    console.log(admin)
    if (!isSignedIn(context)) {
      redirect(context, "/sign-in");
    }
    return {
      admin,
    };
  };

export default Completions
=======
      margin: "auto",
      padding: "0.5em",
    },
  }),
)

const Completions = ({ admin }) => {
  const [languageValue, setLanguageValue] = useState(4)
  const [courseDetails, setCourseDetails] = useState({})

  const classes = useStyles()

  const handleChange = (event, value) => {
    setLanguageValue(value)
  }

  const { loading, error, data } = useQuery<AllCoursesData>(AllCoursesQuery)

  if (error) {
    ;<div>
      Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
    </div>
  }

  if (!admin) {
    return <AdminError />
  }

  if (loading || !data) {
    return <div>Loading</div>
  }

  return (
    <section>
      <WideContainer>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          className={classes.title}
        >
          Completions
        </Typography>
        <Table />
      </WideContainer>
    </section>
  )
}

Completions.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  console.log(admin)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
  }
}

export default Completions
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e

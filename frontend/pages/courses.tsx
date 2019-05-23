import * as React from "react";
import {  Typography } from '@material-ui/core'
import NextI18Next from '../i18n';
import { NextContext } from "next";
import { isSignedIn } from "../lib/authentication";
import redirect from "../lib/redirect";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ApolloClient, gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import { UserOverView as UserOverViewData } from "./__generated__/UserOverView";


export const UserOverViewQuery = gql`
  query UserOverView {
    currentUser {
      id
      administrator
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      widht: 'auto',
      display: 'block',

    },
    paper: {
     display: 'flex',
     flexDirection: 'column',
     alignItems: 'center',
     padding: '1em',
    },
    title: {
      margin: 'auto'
    }
  }),
);


const  CompletionDashboard = ({ t } ) => {
    const classes = useStyles()
    const { loading, error, data } = useQuery<UserOverViewData>(
      UserOverViewQuery
    );
    if(error){
      <div>
        Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
      </div>
    }

    if (loading || !data) {
        return <div>Loading</div>;
    }
    return (
      
      <main className={classes.root} id='main'>
      <Typography 
        component='h1' 
        variant='h2' 
        gutterBottom={true}
        align='center'>
            All Courses
      </Typography>
      
        
        
      </main>
    )
  }

CompletionDashboard.getInitialProps = function(context: NextContext) {
    if (!isSignedIn(context)) {
      redirect(context, "/sign-in");
    }
    return {
      namespacesRequired: ['common'],
    };
  };

export default NextI18Next.withNamespaces('common')(CompletionDashboard)
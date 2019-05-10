import * as React from "react";
import { ApolloClient, gql } from "apollo-boost";
import { NextContext } from "next";
import { isSignedIn, userDetails } from "../lib/authentication"
import redirect from "../lib/redirect";
import { useQuery } from "react-apollo-hooks";
import { UserOverView as UserOverViewData } from "./__generated__/UserOverView";
import { 
  Typography, 
  Paper, } from "@material-ui/core";
import RegisterCompletionText from '../components/RegisterCompletionText'
import ImportantNotice from '../components/ImportantNotice'
import NextI18Next from '../i18n';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
     padding: '1em',
     margin: '1em'
    },
    
  }),
);

export const UserOverViewQuery = gql`
  query UserOverView {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      email
    }
  }
`;

const RegisterCompletion = ({ t }) => {
    const classes = useStyles()
    const { loading, error, data } = useQuery<UserOverViewData>(
        UserOverViewQuery
      );
    if(error){
        console.log('no work')
    }
    if (loading || !data) {
        return <div>Loading</div>;
    }
    return (
      <main>
        <Typography variant="h3" component='h1'  gutterBottom={true} align='center' >
          {t('title')}
        </Typography>
        <Typography variant="body1" >
          {t('course')}
        </Typography>
        <Typography variant="body1"  paragraph>
          {t('credits')}
        </Typography>
        <Paper className={classes.paper}>
          <Typography variant='h5' component='h2' gutterBottom={true}>
            Aliotsikko
          </Typography>
          <Typography variant='body1' paragraph>
            {t('credits_details')}
          </Typography>
          <Typography variant='body1' paragraph>
            {t('donow')}
          </Typography>
        </Paper>
        <ImportantNotice email={data.currentUser.email}/>
        <RegisterCompletionText 
        email={data.currentUser.email} 
        link=" https://www.avoin.helsinki.fi/palvelut/esittely.aspx?o=127290002"
        />
      </main>

    );
  }

  RegisterCompletion.getInitialProps = function(context: NextContext) {
    if (!isSignedIn(context)) {
      redirect(context, "/sign-in");
    }
    return {
      namespacesRequired: ['register-completion'],
    };
  };

  export default NextI18Next.withNamespaces('register-completion')(RegisterCompletion)

  
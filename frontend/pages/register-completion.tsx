import * as React from "react";
import { ApolloClient, gql } from "apollo-boost";
import { NextContext } from "next";
import { isSignedIn, userDetails } from "../lib/authentication"
import redirect from "../lib/redirect";
import { useQuery } from "react-apollo-hooks";
import { UserOverView as UserOverViewData } from "./__generated__/UserOverView";
import { 
  Typography, 
  Paper,
  SvgIcon } from "@material-ui/core";
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
    icon: {
      width: 30,
      height: 30,
      margin: '0.5em'
    },
    paperWithRow: {
      padding: '1em',
     margin: '1em',
     display: 'flex',
     flexDirection: 'row',
     alignItems: 'center',
    }
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
        <Paper className={classes.paperWithRow}>
          <SvgIcon className={classes.icon} color='primary'>
             <path  d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
          </SvgIcon>
          <Typography variant='body1'>
            {t('NB')}
          </Typography>
        </Paper>
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

  
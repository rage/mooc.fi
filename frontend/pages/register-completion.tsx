import * as React from "react";
import { ApolloClient, gql } from "apollo-boost";
import { NextContext } from "next";
import { isSignedIn, userDetails } from "../lib/authentication"
import redirect from "../lib/redirect";
import { useQuery } from "react-apollo-hooks";
import { UserOverView as UserOverViewData } from "./__generated__/UserOverView";
import { Typography, Card, CardContent } from "@material-ui/core";
import RegisterCompletionText from '../components/RegisterCompletionText'
import NextI18Next from '../i18n';



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
     <div role='Main'>
      <Typography variant="h2"  gutterBottom={true}>
        {t('title')}
      </Typography>
      <Typography variant="body1"  paragraph>
        {t('intro')}
      </Typography>
      <Typography variant="body1"  paragraph>
        {t('donow')}
      </Typography>
      <RegisterCompletionText email={data.currentUser.email} />
     </div>
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
import * as React from "react";
import { ApolloClient, gql } from "apollo-boost";
import { NextContext } from "next";
import { isSignedIn, userDetails } from "../lib/authentication"
import redirect from "../lib/redirect";
import { useQuery } from "react-apollo-hooks";
import { UserOverView as UserOverViewData } from "./__generated__/UserOverView";
import { 
  Typography, 
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails } from "@material-ui/core";
import RegisterCompletionText from '../components/RegisterCompletionText'
import NextI18Next from '../i18n';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from "styled-components";

const TextArea = styled.div`
  margin: 1.5rem;
`;

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
      <Typography variant="h2"  gutterBottom={true} align='center' >
        {t('title')}
      </Typography>
      <TextArea>
      <Typography variant="body1"  paragraph >
        {t('course')}
      </Typography>
      <Typography variant="body1"  paragraph>
        {t('credits')}
      </Typography>
      
      <RegisterCompletionText 
        email={data.currentUser.email} 
        link=" https://www.avoin.helsinki.fi/palvelut/esittely.aspx?o=127290002"
        />
        <ExpansionPanel >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='h4'>Lisätietoa</Typography>
          </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <Typography variant="body1"  paragraph>
          {t('credits_details')}
        </Typography>
        <Typography variant="body1"  paragraph>
          {t('donow')}
        </Typography>
        </ExpansionPanelDetails>

        </ExpansionPanel>
        </TextArea>
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
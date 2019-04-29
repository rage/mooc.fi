import * as React from "react";
import { ApolloClient, gql } from "apollo-boost";
import { NextContext } from "next";
import { isSignedIn } from "../lib/authentication"
import redirect from "../lib/redirect";
import { useQuery } from "react-apollo-hooks";
import { UserOverView as UserOverViewData } from "./__generated__/UserOverView";
import RegisterCompletionText from "../components/RegisterCompletionText"


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



function RegisterCompletion() {
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
     <div>
       <RegisterCompletionText email={data.currentUser.email} />
     </div>
    );
  }

  RegisterCompletion.getInitialProps = function(context: NextContext) {
    if (!isSignedIn(context)) {
      redirect(context, "/sign-in");
    }
    return {};
  };

  export default RegisterCompletion
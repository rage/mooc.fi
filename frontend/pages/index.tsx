import * as React from "react";
import { ApolloClient, gql } from "apollo-boost";
import { NextContext } from "next";
import { isSignedIn } from "../lib/authentication";
import redirect from "../lib/redirect";
import { Typography } from "@material-ui/core";
import { useQuery } from "react-apollo-hooks";

export const UserOverViewQuery = gql`
  query UserOverView {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      email
      administrator
    }
  }
`;

function Home() {
  return (
    <div>
      <Typography variant="h3" component="h1">
        There will be things
      </Typography>
      
    </div>
  );
}

Home.getInitialProps = function(context: NextContext) {
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in");
  }
  return {};
};

export default Home;

import * as React from "react";
import gql from "graphql-tag";
import { Query, QueryResult } from "react-apollo";

export const UserOverViewQuery = gql`
  query currentUser {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      email
      slot {
        id
      }
    }
  }
`;

export default () => (
  <Query query={UserOverViewQuery}>
    {({ loading, error, data }: QueryResult) => {
      if (loading) {
        return <div>Loading</div>;
      }
      if (error) {
        return (
          <div>
            Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
          </div>
        );
      }
      const { currentUser }: { currentUser: User } = data;
      return <pre>{JSON.stringify(currentUser, undefined, 2)}</pre>;
    }}
  </Query>
);

export interface User {}

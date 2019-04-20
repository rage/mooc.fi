import * as React from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import { UserOverView } from "./__generated__/UserOverView";

export const UserOverViewQuery = gql`
  query UserOverView {
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

export default () => {
  const { loading, error, data } = useQuery<UserOverView>(UserOverViewQuery);
  if (error) {
    return (
      <div>
        Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
      </div>
    );
  }
  if (loading || !data) {
    return <div>Loading</div>;
  }

  const { currentUser } = data;
  return <pre>{JSON.stringify(currentUser, undefined, 2)}</pre>;
};

export interface User {}

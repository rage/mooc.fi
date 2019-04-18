import * as React from "react";
import gql from "graphql-tag";
import { Query, QueryResult } from "react-apollo";
import Slot from "./Slot";

export const SlotListQuery = gql`
  query slots {
    slots {
      id
      capacity
      registered_count
      starts_at
      ends_at
    }
  }
`;

export default () => (
  <Query query={SlotListQuery}>
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
      const { slots }: { slots: [Slot] } = data;
      return slots.map(slot => <Slot id={slot.id} slot={slot} />);
    }}
  </Query>
);

export interface Slot {
  id: string;
  capacity: string;
  registered_count: number;
  starts_at: string;
  ends_at: string;
}

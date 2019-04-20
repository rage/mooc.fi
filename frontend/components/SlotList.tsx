import * as React from "react";
import gql from "graphql-tag";
import Slot from "./Slot";
import { get } from "lodash";
import { useQuery } from "react-apollo-hooks";
import { Slots } from "./__generated__/Slots";

export const SlotListQuery = gql`
  query Slots {
    slots {
      id
      capacity
      registered_count
      starts_at
      ends_at
    }
    currentUser {
      id
      slot {
        id
      }
    }
  }
`;

export default () => {
  const { loading, error, data } = useQuery<Slots>(SlotListQuery);

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

  const currentSlotId = get(data, "currentUser.slot.id");
  return data.slots.map(slot => (
    <Slot key={slot.id} slot={slot} currentSlotId={currentSlotId} />
  ));
};

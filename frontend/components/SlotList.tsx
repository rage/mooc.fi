import * as React from "react";
import gql from "graphql-tag";
import Slot from "./Slot";
import { get } from "lodash";
import { useQuery } from "react-apollo-hooks";
import { Slots } from "./__generated__/Slots";
import { Typography } from "@material-ui/core";

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
  return (
    <>
      <Typography variant="h4" component="h2">
        Näyttökoeajan valinta
      </Typography>
      <p>
        Valitse listasta yksi sinulle sopiva näyttökoeaika. Huomaa että paikkoja
        jokaisessa ajassa on saatavilla vain rajallisesti, joten suosittelemme
        että valitset ajan mahdollisimman ajoissa.
      </p>
      {data.slots.map(slot => (
        <Slot key={slot.id} slot={slot} currentSlotId={currentSlotId} />
      ))}
    </>
  );
};

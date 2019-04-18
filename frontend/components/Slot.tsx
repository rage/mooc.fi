import * as React from "react";
import { Slot as SlotDetails } from "./SlotList";
import { Card, CardContent, Button } from "@material-ui/core";
import styled from "styled-components";
import { DateTime } from "luxon";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const SELECT_SLOT = gql`
  mutation ChooseSlot($id: ID) {
    chooseSlot(id: $id) {
      id
      slot {
        id
      }
    }
  }
`;

interface Props {
  slot: SlotDetails;
  currentSlotId: string;
}

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
`;

const Slot = ({ slot, currentSlotId }: Props) => {
  const starts = DateTime.fromISO(slot.starts_at);
  const ends = DateTime.fromISO(slot.ends_at);
  const selected = slot.id === currentSlotId;
  return (
    <Mutation mutation={SELECT_SLOT}>
      {(chooseSlot: any) => (
        <StyledCard>
          <CardContent>
            {starts.toFormat("d.M.yyyy T")} - {ends.toFormat("T")}
            <p>
              {slot.registered_count}/{slot.capacity}
            </p>
            <Button
              onClick={() => {
                chooseSlot({ variables: { id: slot.id } });
              }}
              color="primary"
              variant="contained"
              disabled={selected}
            >
              {selected ? "Valittu" : "Valitse"}
            </Button>
          </CardContent>
        </StyledCard>
      )}
    </Mutation>
  );
};

export default Slot;

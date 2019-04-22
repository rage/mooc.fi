import * as React from "react";
import { Card, CardContent, Button, Typography } from "@material-ui/core";
import styled from "styled-components";
import { DateTime } from "luxon";
import gql from "graphql-tag";
import { useMutation } from "react-apollo-hooks";
import { ChooseSlotVariables, ChooseSlot } from "./__generated__/ChooseSlot";
import { Slots_slots } from "./__generated__/Slots";
import { get } from "lodash";
import { SlotListQuery } from "./SlotList";
import { Slots_slots as SlotData } from "./__generated__/Slots";

const SELECT_SLOT = gql`
  mutation ChooseSlot($id: ID) {
    chooseSlot(id: $id) {
      id
      slot {
        id
        registered_count
        capacity
      }
    }
  }
`;

interface Props {
  slot: Slots_slots;
  currentSlotId: string;
}

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
`;
const StyledCardContent = styled(CardContent)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 16px !important;
  h4 {
    flex: 1;
  }
  & > * {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
`;

const FullText = styled.div`
  color: red;
  font-weight: bold;
  width: 90px;
  text-align: center;
`;

const Slot = ({ slot, currentSlotId }: Props) => {
  const starts = DateTime.fromISO(slot.starts_at);
  const ends = DateTime.fromISO(slot.ends_at);
  const selected = slot.id === currentSlotId;
  const full = slot.registered_count >= slot.capacity;
  const [submitting, setSubmitting] = React.useState(false);
  const chooseSlot = useMutation<ChooseSlot, ChooseSlotVariables>(SELECT_SLOT, {
    variables: { id: slot.id },
    update: (store, _mutationResult) => {
      const prevId = currentSlotId;
      const cachedData = store.readQuery({ query: SlotListQuery });
      const slots: [SlotData] | undefined = get(cachedData, "slots");
      if (!slots) {
        return;
      }
      // Update the old slot count, new slot count gets updated automatically
      const prevSlot = slots.find(o => o.id === prevId);
      if (!prevSlot) {
        return;
      }
      prevSlot.registered_count -= 1;
      store.writeQuery({ query: SlotListQuery, data: cachedData });
      setSubmitting(false);
    }
  });
  return (
    <>
      <StyledCard>
        <StyledCardContent>
          <Typography variant="h5" component="h4">
            {starts.toFormat("T")} - {ends.toFormat("T")}
          </Typography>
          <div>
            {slot.registered_count}/{slot.capacity}
          </div>
          <div>
            {selected || !full ? (
              <Button
                onClick={() => {
                  setSubmitting(true);
                  chooseSlot();
                }}
                color="primary"
                variant="contained"
                disabled={selected || submitting}
              >
                {selected ? "Valittu" : "Valitse"}
              </Button>
            ) : (
              <FullText>Täynnä</FullText>
            )}
          </div>
        </StyledCardContent>
      </StyledCard>
    </>
  );
};

export default Slot;

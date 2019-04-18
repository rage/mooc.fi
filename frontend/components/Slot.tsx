import * as React from "react";
import { Slot as SlotDetails } from "./SlotList";
import { Card, CardContent, Button } from "@material-ui/core";
import styled from "styled-components";
import { DateTime } from "luxon";

interface Props {
  slot: SlotDetails;
  id: string;
}

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
`;

const Slot = ({ slot }: Props) => {
  const starts = DateTime.fromISO(slot.starts_at);
  const ends = DateTime.fromISO(slot.ends_at);
  return (
    <StyledCard>
      <CardContent>
        {starts.toFormat("d.M.yyyy T")} - {ends.toFormat("T")}
        <p>
          {slot.registered_count}/{slot.capacity}
        </p>
        <Button color="primary" variant="contained">
          Valitse
        </Button>
      </CardContent>
    </StyledCard>
  );
};

export default Slot;

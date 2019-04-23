import * as React from "react";
import { Stepper, Step, StepLabel, Card, CardContent } from "@material-ui/core";
import gql from "graphql-tag";
import { get } from "lodash";
import { useQuery } from "react-apollo-hooks";
import { UserSlotInfo } from "./__generated__/UserSlotInfo";
import styled from "styled-components";
import { DateTime } from "luxon";

const steps = [
  "Valitse näyttökoeaika",
  "Kirjoita motivaatioesseet",
  "Osallistu näyttökokeeseen"
];

export const StepsQuery = gql`
  query UserSlotInfo {
    currentUser {
      id
      slot {
        id
        starts_at
      }
      essays {
        id
      }
    }
    essayTopics {
      id
    }
  }
`;

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
`;

const StyledCardContent = styled(CardContent)`
  padding: 16px !important;
`;

const Steps = () => {
  let step = 0;

  const { data, loading, error } = useQuery<UserSlotInfo>(StepsQuery);

  if (error) {
    return <div>Error</div>;
  }

  if (loading || !data) {
    return <div>Loading</div>;
  }

  const currentSlot = get(data, "currentUser.slot");

  const essaysComplete =
    get(data, "currentUser.essays.length") === get(data, "essayTopics.length");

  if (get(data, "currentUser.slot.id")) {
    step = 1;
    if (essaysComplete) {
      step = 2;
    }
  }
  return (
    <>
      <StyledCard>
        <CardContent>
          <Stepper activeStep={step} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </StyledCard>
      <StyledCard>
        <StyledCardContent>
          {currentSlot ? (
            <div>
              Olet valinnut ajan{" "}
              {DateTime.fromISO(currentSlot.starts_at).toFormat("d.M.yyyy T")}
            </div>
          ) : (
            <div>Et ole vielä valinnut aikaa</div>
          )}
        </StyledCardContent>
      </StyledCard>
      <StyledCard>
        <StyledCardContent>
          Olet kirjoittanut {get(data, "currentUser.essays.length")}/
          {get(data, "essayTopics.length")} pakollisista motivaatioesseistä.{" "}
          {!essaysComplete &&
            "Huomaathan kirjoittaa nämä kaikki ennen valitsemaasi näyttökoeaikaa."}
        </StyledCardContent>
      </StyledCard>
    </>
  );
};

export default Steps;

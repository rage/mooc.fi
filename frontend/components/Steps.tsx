import * as React from "react";
import { Stepper, Step, StepLabel, Card, CardContent } from "@material-ui/core";
import gql from "graphql-tag";
import { get } from "lodash";
import { useQuery } from "react-apollo-hooks";
import { UserSlotInfo } from "./__generated__/UserSlotInfo";

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

const Steps = () => {
  let step = 0;

  const { data, loading, error } = useQuery<UserSlotInfo>(StepsQuery);

  if (error) {
    return <div>Error</div>;
  }

  if (loading || !data) {
    return <div>Loading</div>;
  }

  if (get(data, "currentUser.slot.id")) {
    step = 1;
    if (
      get(data, "currentUser.essays.length") === get(data, "essayTopics.length")
    ) {
      step = 2;
    }
  }
  return (
    <Card>
      <CardContent>
        <Stepper activeStep={step} alternativeLabel>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </CardContent>
    </Card>
  );
};

export default Steps;

import * as React from "react";
import { Stepper, Step, StepLabel, Card, CardContent } from "@material-ui/core";
import gql from "graphql-tag";
import { Query, QueryResult } from "react-apollo";
import { get } from "lodash";

const steps = [
  "Valitse näyttökoeaika",
  "Kirjoita motivaatioesseet",
  "Osallistu näyttökokeeseen"
];

export const StepsQuery = gql`
  query currentUser {
    currentUser {
      id
      slot {
        id
      }
    }
  }
`;

const Steps = () => {
  let step = 0;
  return (
    <Query query={StepsQuery}>
      {({ data, loading, error }: QueryResult) => {
        if (loading) {
          return <div>Loading</div>;
        }
        if (error) {
          return <div>Error</div>;
        }
        if (get(data, "currentUser.slot.id")) {
          step = 1;
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
      }}
    </Query>
  );
};

export default Steps;

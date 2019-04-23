import * as React from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import { AnswereableEssays } from "./__generated__/AnswereableEssays";
import { Typography } from "@material-ui/core";
import AnswerEssay from "./AnswerEssay";

const AnswereableEssaysQuery = gql`
  query AnswereableEssays {
    essayTopics {
      id
      title
      description
      min_words
      max_words
      currentUserAnswer {
        id
        createdAt
        updatedAt
        text
      }
    }
  }
`;

const AnswerEssays = () => {
  const { data, loading, error } = useQuery<AnswereableEssays>(
    AnswereableEssaysQuery
  );
  if (error) {
    return <div>Error</div>;
  }
  if (loading || !data) {
    return <div>Loading..</div>;
  }
  return (
    <div>
      <Typography variant="h4" component="h2">
        Ennen näyttökoetta
      </Typography>
      <p>
        Alla on useampi esseeaihe. Kirjoita jokaiseen aiheeseen liittyvä otsikon
        mukainen essee ennen näyttökoettasi.
      </p>
      {data.essayTopics.map(topic => (
        <AnswerEssay key={topic.id} topic={topic} />
      ))}
    </div>
  );
};

export default AnswerEssays;

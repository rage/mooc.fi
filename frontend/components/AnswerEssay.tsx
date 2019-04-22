import * as React from "react";
import { AnswereableEssays_essayTopics } from "./__generated__/AnswereableEssays";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button
} from "@material-ui/core";
import styled from "styled-components";
import { get } from "lodash";
import gql from "graphql-tag";
import { useMutation } from "react-apollo-hooks";
import { SaveEssay, SaveEssayVariables } from "./__generated__/SaveEssay";
import { StepsQuery } from "./Steps";

interface AnswerEssayProps {
  topic: AnswereableEssays_essayTopics;
}

const SAVE_ESSAY = gql`
  mutation SaveEssay($topicID: ID, $text: String) {
    saveEssay(topicId: $topicID, text: $text) {
      id
      currentUserAnswer {
        id
        createdAt
        updatedAt
        text
        author {
          id
          first_name
          last_name
        }
      }
    }
  }
`;

const StyledCard = styled(Card)`
  margin-bottom: 2rem;
`;

const TextFieldContainer = styled.div`
  margin-bottom: 1rem;
`;

const AnswerEssay = ({ topic }: AnswerEssayProps) => {
  const savedText: string = get(topic, "currentUserAnswer.text") || "";
  const [text, setText] = React.useState(savedText);
  const words = wordCount(text);
  const acceptableLength = words >= topic.min_words && words <= topic.max_words;
  const saveEssay = useMutation<SaveEssay, SaveEssayVariables>(SAVE_ESSAY, {
    variables: {
      topicID: topic.id,
      text: text.trim()
    },
    refetchQueries: [ { query: StepsQuery } ]
  });

  const currentVersionSaved =
    savedText.trim() !== "" && savedText.trim() === text.trim();

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h5" component="h3">
          {topic.title}
        </Typography>
        <p>{topic.description}</p>

        <p>
          Minimipituus {topic.min_words} sanaa, maksimipituus {topic.max_words}{" "}
          sanaa.
        </p>
        <TextFieldContainer>
          <TextField
            label="Teksti"
            value={text}
            onChange={e => setText(e.target.value)}
            rows="20"
            rowsMax="200"
            multiline
            fullWidth
            grow
            variant="outlined"
            helperText={`Sanoja: ${words}`}
          />
        </TextFieldContainer>
        <Button
          color="primary"
          variant="contained"
          disabled={!acceptableLength || currentVersionSaved}
          onClick={() => saveEssay()}
        >
          {currentVersionSaved ? "Tallennettu!" : "Tallenna"}
        </Button>
      </CardContent>
    </StyledCard>
  );
};

export default AnswerEssay;

function wordCount(string: String) {
  if (!string) {
    return 0;
  }
  const matches = string.match(/[^\s]+/g);
  return matches ? matches.length : 0;
}

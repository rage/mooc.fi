/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AnswereableEssays
// ====================================================

export interface AnswereableEssays_essayTopics_currentUserAnswer {
  __typename: "Essay";
  id: string;
  createdAt: any;
  updatedAt: any;
  text: string;
}

export interface AnswereableEssays_essayTopics {
  __typename: "EssayTopic";
  id: string;
  title: string;
  description: string;
  min_words: number;
  max_words: number;
  currentUserAnswer: AnswereableEssays_essayTopics_currentUserAnswer | null;
}

export interface AnswereableEssays {
  essayTopics: AnswereableEssays_essayTopics[];
}

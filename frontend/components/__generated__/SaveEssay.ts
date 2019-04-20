/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SaveEssay
// ====================================================

export interface SaveEssay_saveEssay_currentUserAnswer_author {
  __typename: "User";
  id: string;
  first_name: string | null;
  last_name: string | null;
}

export interface SaveEssay_saveEssay_currentUserAnswer {
  __typename: "Essay";
  id: string;
  createdAt: any;
  updatedAt: any;
  text: string;
  author: SaveEssay_saveEssay_currentUserAnswer_author;
}

export interface SaveEssay_saveEssay {
  __typename: "EssayTopic";
  id: string;
  currentUserAnswer: SaveEssay_saveEssay_currentUserAnswer | null;
}

export interface SaveEssay {
  saveEssay: SaveEssay_saveEssay;
}

export interface SaveEssayVariables {
  topicID?: string | null;
  text?: string | null;
}

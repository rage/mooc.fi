/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addImage
// ====================================================

export interface addImage_addImage {
  __typename: "Image";
  id: any;
  name: string | null;
  original: string;
  original_mimetype: string;
  compressed: string | null;
  compressed_mimetype: string | null;
  uncompressed: string;
  uncompressed_mimetype: string;
  encoding: string | null;
  default: boolean | null;
}

export interface addImage {
  addImage: addImage_addImage;
}

export interface addImageVariables {
  file: any;
  base64?: boolean | null;
}

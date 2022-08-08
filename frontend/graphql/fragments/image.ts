import { gql } from "@apollo/client"

export const ImageCoreFieldsFragment = gql`
  fragment ImageCoreFields on Image {
    id
    name
    original
    original_mimetype
    compressed
    compressed_mimetype
    uncompressed
    uncompressed_mimetype
    created_at
    updated_at
  }
`

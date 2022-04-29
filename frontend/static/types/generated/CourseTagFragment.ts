/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CourseTagFragment
// ====================================================

export interface CourseTagFragment_tag_tag_translations {
  __typename: "TagTranslation"
  language: string
  name: string
  description: string | null
}

export interface CourseTagFragment_tag {
  __typename: "Tag"
  id: string
  color: string | null
  tag_translations: CourseTagFragment_tag_tag_translations[]
}

export interface CourseTagFragment {
  __typename: "CourseTag"
  tag: CourseTagFragment_tag | null
}

import {
  Completion,
  CompletionDetailedFieldsWithCourseFragment,
} from "/graphql/generated"

export const completionHasCourse = (
  completion: CompletionDetailedFieldsWithCourseFragment,
): completion is CompletionDetailedFieldsWithCourseFragment & {
  course: NonNullable<Completion["course"]>
} => Boolean(completion.course)

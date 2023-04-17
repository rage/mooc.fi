import {
  Completion,
  CompletionDetailedFieldsWithCourseFragment,
} from "/graphql/generated"

export const completionHasCourse = (
  completion: CompletionDetailedFieldsWithCourseFragment,
): completion is CompletionDetailedFieldsWithCourseFragment & {
  course: NonNullable<Completion["course"]>
} => Boolean(completion.course)

export const isNullOrUndefined = <TValue>(
  value: TValue | null | undefined,
): value is null | undefined => value === null || typeof value === "undefined"

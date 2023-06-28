import notEmpty from "./notEmpty"

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

export const notEmptyOrEmptyString = <TValue>(
  value: TValue | null | undefined,
): value is TValue => notEmpty(value) && value !== "" && value !== false

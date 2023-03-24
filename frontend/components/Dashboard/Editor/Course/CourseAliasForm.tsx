import { useCallback, useMemo } from "react"

import { styled } from "@mui/material/styles"

import {
  ControlledFieldArrayList,
  ControlledFieldArrayListProps,
  ControlledHiddenField,
  ControlledTextField,
} from "../Common/Fields"
import { initialAlias } from "./form-validation"
import { CourseFormValues } from "./types"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

function CourseAliasForm() {
  const t = useTranslator(CoursesTranslations)

  const renderArrayListItem: ControlledFieldArrayListProps<
    CourseFormValues,
    "course_aliases"
  >["render"] = useCallback(
    ({ item, index }) => (
      <>
        <ControlledHiddenField
          name={`course_aliases.${index}._id`}
          defaultValue={item._id}
        />
        <ControlledTextField
          name={`course_aliases.${index}.course_code`}
          label={t("courseAliasCourseCode")}
          defaultValue={item.course_code}
          containerProps={{ style: { minWidth: "300px", flexGrow: 1 } }}
        />
      </>
    ),
    [],
  )

  const conditions: ControlledFieldArrayListProps<
    CourseFormValues,
    "course_aliases"
  >["conditions"] = useMemo(
    () => ({
      add: (values) => values?.[values.length - 1]?.course_code !== "",
      remove: (item) => !item._id && item.course_code === "",
    }),
    [],
  )

  return (
    <ControlledFieldArrayList<CourseFormValues, "course_aliases">
      name="course_aliases"
      label={t("courseAliases")}
      initialValues={initialAlias}
      texts={{
        description: t("confirmationRemoveAlias"),
        noFields: t("courseNoAliases"),
      }}
      conditions={conditions}
      render={renderArrayListItem}
    />
  )
}

export default CourseAliasForm

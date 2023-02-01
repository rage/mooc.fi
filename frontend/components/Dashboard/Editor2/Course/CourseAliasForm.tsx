import { useCallback, useMemo } from "react"

import { styled } from "@mui/material/styles"

import {
  ControlledFieldArrayList,
  ControlledFieldArrayListProps,
  ControlledHiddenField,
  ControlledTextField,
} from "/components/Dashboard/Editor2/Common/Fields"
import { initialAlias } from "/components/Dashboard/Editor2/Course/form-validation"
import { CourseFormValues } from "/components/Dashboard/Editor2/Course/types"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

const FullWidthControlledTextField = styled(ControlledTextField)`
  width: 100%;
`
function CourseAliasForm() {
  const t = useTranslator(CoursesTranslations)

  const renderArrayListItem: ControlledFieldArrayListProps<
    CourseFormValues,
    "course_aliases"
  >["render"] = useCallback(
    (item, index) => (
      <>
        <ControlledHiddenField
          name={`course_aliases.${index}._id`}
          defaultValue={item._id}
        />
        <FullWidthControlledTextField
          name={`course_aliases.${index}.course_code`}
          label={t("courseAliasCourseCode")}
          defaultValue={item.course_code}
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

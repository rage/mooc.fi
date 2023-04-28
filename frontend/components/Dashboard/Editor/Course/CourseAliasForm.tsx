import { useCallback, useMemo } from "react"

import { FormSubtitleWithMargin } from "../Common"
import {
  ControlledFieldArrayList,
  ControlledFieldArrayListProps,
  ControlledHiddenField,
  ControlledTextField,
} from "../Common/Fields"
import { initialAlias } from "./form-validation"
import { CourseFormValues } from "./types"
import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"

const courseCodeContainerProps = {
  style: {
    minWidth: "300px",
    flexGrow: 1,
  },
}

const conditions: ControlledFieldArrayListProps<
  CourseFormValues,
  "course_aliases"
>["conditions"] = {
  add: (values) => values?.[values.length - 1]?.course_code !== "",
  remove: (item) => !item._id && item.course_code === "",
}

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
          required
          defaultValue={item.course_code}
          containerProps={courseCodeContainerProps}
        />
      </>
    ),
    [t],
  )

  const texts = useMemo(
    () => ({
      description: t("confirmationRemoveAlias"),
      noFields: t("courseNoAliases"),
    }),
    [t],
  )

  return (
    <>
      <FormSubtitleWithMargin variant="h6" component="h3" align="center">
        {t("courseAliasesTitle")}
      </FormSubtitleWithMargin>

      <ControlledFieldArrayList
        name="course_aliases"
        label={t("courseAliases")}
        initialValues={initialAlias}
        texts={texts}
        conditions={conditions}
        render={renderArrayListItem}
      />
    </>
  )
}

export default CourseAliasForm

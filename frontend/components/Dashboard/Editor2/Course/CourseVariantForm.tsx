import { useCallback, useMemo } from "react"

import { styled } from "@mui/material/styles"

import {
  ControlledFieldArrayList,
  ControlledFieldArrayListProps,
  ControlledHiddenField,
  ControlledTextField,
} from "/components/Dashboard/Editor2/Common/Fields"
import { initialVariant } from "/components/Dashboard/Editor2/Course/form-validation"
import { CourseFormValues } from "/components/Dashboard/Editor2/Course/types"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

const FullWidthControlledTextField = styled(ControlledTextField)`
  width: 100%;
`

function CourseVariantForm() {
  const t = useTranslator(CoursesTranslations)

  const renderArrayListItem: ControlledFieldArrayListProps<
    CourseFormValues,
    "course_variants"
  >["render"] = useCallback(
    (item, index) => (
      <>
        <ControlledHiddenField
          name={`course_variants.${index}._id`}
          defaultValue={item._id}
        />
        <ControlledTextField
          name={`course_variants.${index}.slug`}
          label={t("courseSlug")}
        />
        <FullWidthControlledTextField
          name={`course_variants.${index}.description`}
          label={t("courseDescription")}
        />
      </>
    ),
    [],
  )

  const conditions: ControlledFieldArrayListProps<
    CourseFormValues,
    "course_variants"
  >["conditions"] = useMemo(
    () => ({
      add: (values) => values[values.length - 1].slug !== "",
      remove: (item) => !item._id && item.slug === "",
    }),
    [],
  )

  return (
    <ControlledFieldArrayList<CourseFormValues, "course_variants">
      name="course_variants"
      label={t("courseVariants")}
      initialValues={initialVariant}
      texts={{
        description: t("confirmationRemoveVariant"),
        noFields: t("courseNoVariants"),
      }}
      conditions={conditions}
      render={renderArrayListItem}
    />
  )
}

export default CourseVariantForm

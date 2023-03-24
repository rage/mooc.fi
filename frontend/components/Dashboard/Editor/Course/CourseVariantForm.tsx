import { useCallback, useMemo } from "react"

import { styled } from "@mui/material/styles"

import {
  ControlledFieldArrayList,
  ControlledFieldArrayListProps,
  ControlledHiddenField,
  ControlledTextField,
} from "../Common/Fields"
import { initialVariant } from "./form-validation"
import { CourseFormValues } from "./types"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

const CourseVariantEntryContainer = styled("div")`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  gap: 1rem;
`

function CourseVariantForm() {
  const t = useTranslator(CoursesTranslations)

  const renderArrayListItem: ControlledFieldArrayListProps<
    CourseFormValues,
    "course_variants"
  >["render"] = useCallback(
    ({ item, index }) => (
      <CourseVariantEntryContainer>
        <ControlledHiddenField
          name={`course_variants.${index}._id`}
          defaultValue={item._id}
        />
        <ControlledTextField
          name={`course_variants.${index}.slug`}
          label={t("courseSlug")}
          containerProps={{ style: { flexGrow: 1, minWidth: "100px" } }}
        />
        <ControlledTextField
          name={`course_variants.${index}.description`}
          label={t("courseDescription")}
          containerProps={{ style: { minWidth: "300px", flexGrow: 1 } }}
        />
      </CourseVariantEntryContainer>
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

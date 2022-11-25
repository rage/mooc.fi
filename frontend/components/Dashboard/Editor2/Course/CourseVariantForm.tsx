import { styled } from "@mui/material/styles"

import {
  ControlledFieldArrayList,
  ControlledHiddenField,
  ControlledTextField,
} from "/components/Dashboard/Editor2/Common/Fields"
import { initialVariant } from "/components/Dashboard/Editor2/Course/form-validation"
import { CourseVariantFormValues } from "/components/Dashboard/Editor2/Course/types"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

const FullWidthControlledTextField = styled(ControlledTextField)`
  width: 100%;
`

export default function CourseVariantForm() {
  const t = useTranslator(CoursesTranslations)

  return (
    <ControlledFieldArrayList<CourseVariantFormValues>
      name="course_variants"
      label={t("courseVariants")}
      initialValues={initialVariant}
      texts={{
        description: t("confirmationRemoveVariant"),
        noFields: t("courseNoVariants"),
      }}
      conditions={{
        add: (values) => values[values.length - 1].slug !== "",
        remove: (item) => !item._id && item.slug === "",
      }}
      render={(item, index) => (
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
      )}
    />
  )
}

import { CourseVariantFormValues } from "/components/Dashboard/Editor2/Course/types"
import { useTranslator } from "/util/useTranslator"
import CoursesTranslations from "/translations/courses"
import {
  ControlledFieldArrayList,
  ControlledHiddenField,
  ControlledTextField,
} from "/components/Dashboard/Editor2/FormFields"
import { initialVariant } from "/components/Dashboard/Editor2/Course/form-validation"

export default function CourseVariantForm() {
  const t = useTranslator(CoursesTranslations)

  return (
    <ControlledFieldArrayList<CourseVariantFormValues>
      name="course_variants"
      label={t("courseVariants")}
      initialValues={initialVariant}
      removeConfirmationDescription={t("confirmationRemoveVariant")}
      noFieldsDescription={t("courseNoVariants")}
      addCondition={(values) => values[values.length - 1].slug !== ""}
      removeWithoutConfirmationCondition={(item) =>
        !item._id && item.slug === ""
      }
      render={(item, index) => (
        <>
          <ControlledHiddenField
            name={`course_variants[${index}]._id`}
            defaultValue={item._id}
          />
          <ControlledTextField
            name={`course_variants[${index}].slug`}
            label={t("courseSlug")}
          />
          <ControlledTextField
            name={`course_variants[${index}].description`}
            label={t("courseDescription")}
          />
        </>
      )}
    />
  )
}

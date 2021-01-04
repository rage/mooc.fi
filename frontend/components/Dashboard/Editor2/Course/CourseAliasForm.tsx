import { CourseAliasFormValues } from "/components/Dashboard/Editor2/Course/types"
import { useTranslator } from "/util/useTranslator"
import CoursesTranslations from "/translations/courses"
import {
  ControlledFieldArrayList,
  ControlledHiddenField,
  ControlledTextField,
} from "/components/Dashboard/Editor2/FormFields"
import { initialAlias } from "/components/Dashboard/Editor2/Course/form-validation"

export default function CourseAliasForm() {
  const t = useTranslator(CoursesTranslations)

  return (
    <ControlledFieldArrayList<CourseAliasFormValues>
      name="course_aliases"
      label={t("courseAliases")}
      initialValues={initialAlias}
      removeConfirmationDescription={t("confirmationRemoveAlias")}
      noFieldsDescription={t("courseNoAliases")}
      addCondition={(item) => item.course_code !== ""}
      removeWithoutConfirmationCondition={(item) =>
        !item._id && item.course_code === ""
      }
      render={(item, index) => (
        <>
          <ControlledHiddenField
            name={`course_aliases[${index}]._id`}
            defaultValue={item._id}
          />
          <ControlledTextField
            name={`course_aliases[${index}].course_code`}
            label={t("courseAliasCourseCode")}
            defaultValue={item.course_code}
          />
        </>
      )}
    />
  )
}

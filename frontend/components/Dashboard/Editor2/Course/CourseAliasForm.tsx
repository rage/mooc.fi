import {
  ControlledFieldArrayList,
  ControlledHiddenField,
  ControlledTextField,
} from "/components/Dashboard/Editor2/Common/Fields"
import { initialAlias } from "/components/Dashboard/Editor2/Course/form-validation"
import { CourseFormValues } from "/components/Dashboard/Editor2/Course/types"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

export default function CourseAliasForm() {
  const t = useTranslator(CoursesTranslations)

  return (
    <ControlledFieldArrayList<CourseFormValues, "course_aliases">
      name="course_aliases"
      label={t("courseAliases")}
      initialValues={initialAlias}
      texts={{
        description: t("confirmationRemoveAlias"),
        noFields: t("courseNoAliases"),
      }}
      conditions={{
        add: (values) => values?.[values.length - 1]?.course_code !== "",
        remove: (item) => !item._id && item.course_code === "",
      }}
      render={(item, index) => (
        <>
          <ControlledHiddenField
            name={`course_aliases.${index}._id`}
            defaultValue={item._id}
          />
          <ControlledTextField
            name={`course_aliases.${index}.course_code`}
            label={t("courseAliasCourseCode")}
            defaultValue={item.course_code}
          />
        </>
      )}
    />
  )
}

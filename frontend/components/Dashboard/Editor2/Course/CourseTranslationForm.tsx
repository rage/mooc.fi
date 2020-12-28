import { useFormContext, useFieldArray } from "react-hook-form"
import { Typography } from "@material-ui/core"
import { ControlledTextField } from "/components/Dashboard/Editor2/FormFields"
import { useTranslator } from "/util/useTranslator"
import CoursesTranslations from "/translations/courses"
import styled from "styled-components"

const LanguageVersionTitle = styled(Typography)<any>`
  margin-bottom: 1.5rem;
  font-size: 33px;
  line-height: 52px;
  color: #005b5b;
`
export default function CourseTranslationForm() {
  const t = useTranslator(CoursesTranslations)

  const { control, errors, setValue, methods } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "course_translations",
  })

  console.log("fields", fields)

  return (
    <section>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id}>
            <LanguageVersionTitle component="h2" variant="h3" align="left">
              {t("courseLanguageVersion")}
            </LanguageVersionTitle>
            <ControlledTextField
              name={`course_translations[${index}].name`}
              label={t("courseName")}
              required={true}
            />
            <ControlledTextField
              name={`course_translations[${index}].description`}
              label={t("courseDescription")}
            />
            <ControlledTextField
              name={`course_translations[${index}].link`}
              label={t("courseLink")}
            />
            <ControlledTextField
              name={`course_translations[${index}].open_university_course_link.course_code`}
              label={t("courseOpenCode")}
            />
            <ControlledTextField
              name={`course_translations[${index}].open_university_course_link.link`}
              label={t("courseOpenLink")}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

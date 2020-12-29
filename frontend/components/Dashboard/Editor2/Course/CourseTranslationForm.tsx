import { useFormContext, useFieldArray } from "react-hook-form"
import { Typography } from "@material-ui/core"
import {
  ControlledTextField,
  ControlledHiddenField,
} from "/components/Dashboard/Editor2/FormFields"
import { useTranslator } from "/util/useTranslator"
import CoursesTranslations from "/translations/courses"
import styled from "styled-components"
import { CourseTranslationFormValues } from "/components/Dashboard/Editor2/Course/types"

const LanguageVersionTitle = styled(Typography)<any>`
  margin-bottom: 1.5rem;
  font-size: 33px;
  line-height: 52px;
  color: #005b5b;
`
export default function CourseTranslationForm() {
  const t = useTranslator(CoursesTranslations)

  const { control, errors, setValue, methods } = useFormContext()
  const { fields, append, remove } = useFieldArray<CourseTranslationFormValues>(
    {
      control,
      name: "course_translations",
    },
  )

  return (
    <section>
      <ul>
        {fields.map((item, index) => (
          <li key={item._id}>
            <LanguageVersionTitle component="h2" variant="h3" align="left">
              {t("courseLanguageVersion")}
            </LanguageVersionTitle>
            <ControlledHiddenField
              name={`course_translations[${index}]._id`}
              defaultValue={item._id}
            />
            <ControlledHiddenField
              name={`course_translations[${index}].language`}
              defaultValue={item.language}
            />
            <ControlledTextField
              name={`course_translations[${index}].name`}
              label={t("courseName")}
              defaultValue={item.name}
              required={true}
            />
            <ControlledTextField
              name={`course_translations[${index}].description`}
              label={t("courseDescription")}
              defaultValue={item.description}
            />
            <ControlledTextField
              name={`course_translations[${index}].link`}
              label={t("courseLink")}
              defaultValue={item.link}
            />
            <ControlledTextField
              name={`course_translations[${index}].open_university_course_link.course_code`}
              label={t("courseOpenCode")}
              defaultValue={item.open_university_course_link?.course_code ?? ""}
            />
            <ControlledTextField
              name={`course_translations[${index}].open_university_course_link.link`}
              label={t("courseOpenLink")}
              defaultValue={item.open_university_course_link?.link ?? ""}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

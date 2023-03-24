import { useFormContext } from "react-hook-form"

import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  ControlledHiddenField,
  ControlledTextField,
} from "../Common/Fields"
import { CourseTranslationFormValues } from "./types"
import { EntryContainer } from "/components/Surfaces/EntryContainer"
import CoursesTranslations from "/translations/courses"
import { mapLangToLanguage } from "/util/dataFormatFunctions"
import { useTranslator } from "/util/useTranslator"

const LanguageVersionTitle = styled(Typography)`
  margin-bottom: 1.5rem;
  font-size: 33px;
  line-height: 52px;
  color: #005b5b;
` as typeof Typography

const AddTranslationNotice = styled(EntryContainer)`
  margin-bottom: 1rem;
  border: 1px solid #88732d;
  background-color: #88732d;
  color: white;
`

const CourseTranslationList = styled("ul")`
  list-style: none;
  margin-block-start: 0;
  padding-inline-start: 0;
`

const CourseTranslationItem = styled("li")`
  padding-top: 1rem;
  padding-bottom: 1.5rem;
  width: 90%;
  margin: auto;
`

function CourseTranslationForm() {
  const t = useTranslator(CoursesTranslations)

  const { watch } = useFormContext()
  const fields: CourseTranslationFormValues[] = watch("course_translations")

  return (
    <section>
      <CourseTranslationList>
        {fields.length ? (
          fields.map((item, index) => (
            <CourseTranslationItem
              key={`translation-${item.language ?? index}`}
            >
              <LanguageVersionTitle component="h2" variant="h3" align="left">
                {`${t("courseLanguageVersion")}: ${
                  mapLangToLanguage[item.language ?? ""]
                }`}
              </LanguageVersionTitle>
              <ControlledHiddenField
                name={`course_translations.${index}._id`}
                defaultValue={item._id}
              />
              <ControlledHiddenField
                name={`course_translations.${index}.language`}
                defaultValue={item.language}
              />
              <ControlledTextField
                name={`course_translations.${index}.name`}
                label={t("courseName")}
                required
                defaultValue={item.name}
                revertable
              />
              <ControlledTextField
                name={`course_translations.${index}.description`}
                label={t("courseDescription")}
                defaultValue={item.description}
                type="textarea"
                rows={5}
                revertable
              />
              <ControlledTextField
                name={`course_translations.${index}.instructions`}
                label={t("courseInstructions")}
                defaultValue={item.instructions}
                type="textarea"
                rows={5}
                revertable
              />
              <ControlledTextField
                name={`course_translations.${index}.link`}
                label={t("courseLink")}
                defaultValue={item.link}
                revertable
              />
              <ControlledHiddenField
                name={`course_translations.${index}.open_university_course_link._id`}
                defaultValue={item.open_university_course_link?._id ?? ""}
              />
              <ControlledTextField
                name={`course_translations.${index}.open_university_course_link.course_code`}
                label={t("courseOpenCode")}
                defaultValue={
                  item.open_university_course_link?.course_code ?? ""
                }
                revertable
              />
              <ControlledTextField
                name={`course_translations.${index}.open_university_course_link.link`}
                label={t("courseOpenLink")}
                defaultValue={item.open_university_course_link?.link ?? ""}
                revertable
              />
            </CourseTranslationItem>
          ))
        ) : (
          <AddTranslationNotice elevation={1}>
            <Typography variant="body1">
              {t("courseAtLeastOneTranslation")}
            </Typography>
          </AddTranslationNotice>
        )}
      </CourseTranslationList>
    </section>
  )
}

export default CourseTranslationForm

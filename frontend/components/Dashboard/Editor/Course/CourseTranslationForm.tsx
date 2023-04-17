import { useFieldArray } from "react-hook-form"

import { FormControl, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { ControlledHiddenField, ControlledTextField } from "../Common/Fields"
import { CourseFormValues } from "./types"
import { EntryContainer } from "/components/Surfaces/EntryContainer"
import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"
import { mapLangToLanguage } from "/util/dataFormatFunctions"

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

// require key to ensure re-render on selected language change
function CourseTranslationForm(_: { key: React.Key }) {
  const t = useTranslator(CoursesTranslations)
  const { fields } = useFieldArray<CourseFormValues, "course_translations">({
    name: "course_translations",
  })

  return (
    <FormControl component="fieldset">
      <CourseTranslationList>
        {fields.length ? (
          fields.map((item, index) => (
            <CourseTranslationItem key={item._id ?? item.language}>
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
              />
              <ControlledTextField
                name={`course_translations.${index}.name`}
                label={t("courseName")}
                required
                revertable
              />
              <ControlledTextField
                name={`course_translations.${index}.description`}
                label={t("courseDescription")}
                required
                type="textarea"
                rows={5}
                revertable
              />
              <ControlledTextField
                name={`course_translations.${index}.instructions`}
                label={t("courseInstructions")}
                type="textarea"
                rows={5}
                revertable
              />
              <ControlledTextField
                name={`course_translations.${index}.link`}
                label={t("courseLink")}
                revertable
              />
              <ControlledHiddenField
                name={`course_translations.${index}.open_university_course_link._id`}
                defaultValue={item.open_university_course_link?._id ?? ""}
              />
              <ControlledTextField
                name={`course_translations.${index}.open_university_course_link.course_code`}
                label={t("courseOpenCode")}
                revertable
              />
              <ControlledTextField
                name={`course_translations.${index}.open_university_course_link.link`}
                label={t("courseOpenLink")}
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
    </FormControl>
  )
}

export default CourseTranslationForm

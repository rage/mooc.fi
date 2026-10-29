import React, { useEffect, useRef } from "react"

import { useFormContext, useWatch } from "react-hook-form"

import { styled } from "@mui/material/styles"

import { FormFieldGroup, FormSubtitle } from "../Common"
import { ControlledDatePicker, ControlledTextField } from "../Common/Fields"
import CourseInstanceLanguageSelector from "./CourseInstanceLanguageSelector"
import { CourseFormValues } from "./types"
import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"
import { slugify } from "/util/slugify"

const validateOtherFields = ["start_date"] as const

const Row = styled("div")`
  display: grid;
  width: 100%;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-flow: row;
  grid-auto-columns: minmax(200px, 1fr);
`
// Keeps name and slug following the translations until the user edits them.
function useSuggestedNameAndSlug(isNewCourse: boolean) {
  const { control, getValues, setValue, formState } =
    useFormContext<CourseFormValues>()
  const translations = useWatch({ control, name: "course_translations" })
  const suggested = useRef({ name: "", slug: "" })
  const { isSubmitted } = formState

  useEffect(() => {
    if (!isNewCourse) {
      return
    }
    const source =
      translations.find((translation) => translation.name)?.name ?? ""
    const next = { name: source, slug: slugify(source) }
    const { name, new_slug } = getValues()

    if (name === suggested.current.name) {
      setValue("name", next.name, { shouldValidate: isSubmitted })
    }
    if (new_slug === suggested.current.slug) {
      setValue("new_slug", next.slug, { shouldValidate: isSubmitted })
    }
    suggested.current = next
  }, [translations])
}

function CourseInfoForm() {
  const t = useTranslator(CoursesTranslations)
  const isNewCourse = !useWatch<CourseFormValues, "id">({ name: "id" })

  useSuggestedNameAndSlug(isNewCourse)

  return (
    <>
      <FormSubtitle variant="h6" component="h3" align="center">
        {t("courseDetails")}
      </FormSubtitle>
      <FormFieldGroup>
        <ControlledTextField
          name="name"
          label={t("courseName")}
          tip={t("helpName")}
          required
          revertable
        />
        <ControlledTextField
          name="new_slug"
          label={t("courseSlug")}
          required
          revertable
          tip={t("helpSlug")}
        />
        <Row>
          <ControlledTextField
            name="ects"
            label={t("courseECTS")}
            fullWidth
            revertable
          />
          <CourseInstanceLanguageSelector />
        </Row>
      </FormFieldGroup>

      <FormFieldGroup>
        <ControlledDatePicker
          name="start_date"
          label={t("courseStartDate")}
          required
        />
        <ControlledDatePicker
          name="end_date"
          label={t("courseEndDate")}
          validateOtherFields={validateOtherFields}
        />
      </FormFieldGroup>

      <FormFieldGroup>
        <ControlledTextField
          name="teacher_in_charge_name"
          label={t("courseTeacherInChargeName")}
          required
        />
        <ControlledTextField
          name="teacher_in_charge_email"
          label={t("courseTeacherInChargeEmail")}
          required
        />
        <ControlledTextField
          name="support_email"
          label={t("courseSupportEmail")}
        />
      </FormFieldGroup>
    </>
  )
}

export default CourseInfoForm

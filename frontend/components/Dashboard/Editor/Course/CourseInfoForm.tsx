import React from "react"

import { FormFieldGroup, FormSubtitle } from "../Common"
import { ControlledDatePicker, ControlledTextField } from "../Common/Fields"
import CourseInstanceLanguageSelector from "./CourseInstanceLanguageSelector"
import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"

const validateOtherFields = ["start_date"] as const

function CourseInfoForm() {
  const t = useTranslator(CoursesTranslations)

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
        <ControlledTextField name="ects" label={t("courseECTS")} />
        <CourseInstanceLanguageSelector />
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

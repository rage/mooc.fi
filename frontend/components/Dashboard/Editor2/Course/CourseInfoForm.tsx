import React from "react"
import {
  FormSubtitle,
  FormFieldGroup,
} from "/components/Dashboard/Editor2/Common"
import {
  ControlledDatePicker,
  ControlledTextField,
} from "/components/Dashboard/Editor2/Common/Fields"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

export default function CourseInfoForm() {
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
      </FormFieldGroup>

      <FormFieldGroup>
        <ControlledDatePicker
          name="start_date"
          label={t("courseStartDate")}
          required={true}
        />
        <ControlledDatePicker
          name="end_date"
          label={t("courseEndDate")}
          validateOtherFields={["start_date"]}
        />
      </FormFieldGroup>

      <FormFieldGroup>
        <ControlledTextField
          name="teacher_in_charge_name"
          label={t("courseTeacherInChargeName")}
          required={true}
        />
        <ControlledTextField
          name="teacher_in_charge_email"
          label={t("courseTeacherInChargeEmail")}
          required={true}
        />
        <ControlledTextField
          name="support_email"
          label={t("courseSupportEmail")}
        />
      </FormFieldGroup>
    </>
  )
}

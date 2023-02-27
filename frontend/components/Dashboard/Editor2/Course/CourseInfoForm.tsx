import React from "react"

import dynamic from "next/dynamic"

import { Skeleton } from "@mui/material"

import CourseInstanceLanguageSelector from "./CourseInstanceLanguageSelector"
import {
  FormFieldGroup,
  FormSubtitle,
} from "/components/Dashboard/Editor2/Common"
import { ControlledTextField } from "/components/Dashboard/Editor2/Common/Fields"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

const DynamicControlledDatePicker = dynamic(
  () =>
    import("../Common/Fields/ControlledDatePicker").then(
      (c) => c.ControlledDatePicker,
    ),
  {
    ssr: false,
    loading: () => {
      return <Skeleton variant="rectangular" />
    },
  },
)

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
        <DynamicControlledDatePicker
          name="start_date"
          label={t("courseStartDate")}
          required
        />
        <DynamicControlledDatePicker
          name="end_date"
          label={t("courseEndDate")}
          validateOtherFields={["start_date"]}
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

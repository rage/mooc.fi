import { useMemo } from "react"

import { useRouter } from "next/router"

import { FormControl, FormLabel } from "@mui/material"

import { FormFieldGroup } from "../Common"
import {
  ControlledCheckbox,
  ControlledModuleList,
  ControlledRadioGroup,
  ControlledTextField,
} from "../Common/Fields"
import { useCourseEditorData } from "./CourseEditorDataContext"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
import CoursesTranslations from "/translations/courses"

import { CourseStatus } from "/graphql/generated"

function CourseStatusForm() {
  const { studyModules } = useCourseEditorData()
  const t = useTranslator(CoursesTranslations, CommonTranslations)
  const { locale } = useRouter()

  const statuses = useMemo(
    () =>
      Object.keys(CourseStatus).map((value) => ({
        value,
        label: t(`course${value.toString()}` as CourseStatus),
      })),
    [locale, t],
  )

  return (
    <>
      <FormFieldGroup>
        <ControlledRadioGroup
          name="status"
          label={t("courseStatus")}
          options={statuses}
        />
      </FormFieldGroup>
      <FormFieldGroup>
        <ControlledModuleList
          name="study_modules"
          label={t("courseModules")}
          modules={studyModules}
        />
      </FormFieldGroup>
      <FormFieldGroup>
        <FormControl component="fieldset">
          <FormLabel component="legend">{t("courseProperties")}</FormLabel>
          <ControlledCheckbox name="promote" label={t("coursePromote")} />
          <ControlledCheckbox
            name="start_point"
            label={t("courseStartPoint")}
            tip={t("helpStartPoint")}
          />
          <ControlledCheckbox name="hidden" label={t("courseHidden")} />
          <ControlledCheckbox
            name="has_certificate"
            label={t("courseHasCertificate")}
            tip={t("helpHasCertificate")}
          />
          <ControlledCheckbox
            name="upcoming_active_link"
            label={t("courseUpcomingActiveLink")}
            tip={t("helpUpcomingActiveLink")}
          />
        </FormControl>
      </FormFieldGroup>
      <FormFieldGroup>
        <ControlledTextField
          name="order"
          label={t("courseOrder")}
          type="number"
          defaultValue=""
          tip={t("helpOrder")}
        />
        <ControlledTextField
          name="study_module_order"
          label={t("courseModuleOrder")}
          type="number"
          defaultValue=""
          tip={t("helpModuleOrder")}
        />
      </FormFieldGroup>
    </>
  )
}

export default CourseStatusForm

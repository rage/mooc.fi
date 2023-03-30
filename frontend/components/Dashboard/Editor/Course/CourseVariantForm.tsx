import { useCallback, useMemo } from "react"

import { useRouter } from "next/router"

import { styled } from "@mui/material/styles"

import { FormSubtitleWithMargin } from "../Common"
import {
  ControlledFieldArrayList,
  ControlledFieldArrayListProps,
  ControlledHiddenField,
  ControlledTextField,
} from "../Common/Fields"
import { initialVariant } from "./form-validation"
import { CourseFormValues } from "./types"
import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"

const CourseVariantEntryContainer = styled("div")`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  gap: 1rem;
`

const slugContainerProps = {
  style: {
    flexGrow: 1,
    minWidth: "100px",
  },
}
const descriptionContainerProps = {
  style: {
    minWidth: "300px",
    flexGrow: 1,
  },
}

function CourseVariantForm() {
  const t = useTranslator(CoursesTranslations)
  const { locale } = useRouter()

  const renderArrayListItem: ControlledFieldArrayListProps<
    CourseFormValues,
    "course_variants"
  >["render"] = useCallback(
    ({ item, index }) => (
      <CourseVariantEntryContainer>
        <ControlledHiddenField
          name={`course_variants.${index}._id`}
          defaultValue={item._id}
        />
        <ControlledTextField
          name={`course_variants.${index}.slug`}
          label={t("courseSlug")}
          required
          containerProps={slugContainerProps}
        />
        <ControlledTextField
          name={`course_variants.${index}.description`}
          label={t("courseDescription")}
          containerProps={descriptionContainerProps}
        />
      </CourseVariantEntryContainer>
    ),
    [],
  )

  const conditions: ControlledFieldArrayListProps<
    CourseFormValues,
    "course_variants"
  >["conditions"] = useMemo(
    () => ({
      add: (values) => values[values.length - 1].slug !== "",
      remove: (item) => !item._id && item.slug === "",
    }),
    [],
  )

  const texts = useMemo(
    () => ({
      description: t("confirmationRemoveVariant"),
      noFields: t("courseNoVariants"),
    }),
    [t, locale],
  )

  return (
    <>
      <FormSubtitleWithMargin variant="h6" component="h3" align="center">
        {t("courseVariantsTitle")}
      </FormSubtitleWithMargin>
      <ControlledFieldArrayList<CourseFormValues, "course_variants">
        name="course_variants"
        label={t("courseVariants")}
        initialValues={initialVariant}
        texts={texts}
        conditions={conditions}
        render={renderArrayListItem}
      />
    </>
  )
}

export default CourseVariantForm
import React, { useContext } from "react"
import { FormFieldGroup } from "./CourseEditForm"
import { FormControl } from "@material-ui/core"
import { Field, FieldProps } from "formik"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"
import { CourseFormValues } from "./types"
import ImageDropzoneInput from "/components/Dashboard/ImageDropzoneInput"
import ImagePreview from "/components/Dashboard/ImagePreview"
import { addDomain } from "/util/imageUtils"
import { FormSubtitle } from "./CourseEditForm"

interface ImageInputProps {
  errors: any
  values: any
  setFieldValue: any
}
const CourseImageInput = (props: ImageInputProps) => {
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)
  const { errors, values, setFieldValue } = props
  return (
    <FormFieldGroup>
      <FormSubtitle variant="h6" component="h3" align="center">
        {t("coursePhoto")}
      </FormSubtitle>
      <FormControl>
        <Field name="thumbnail" type="hidden" />
        <Field
          name="new_photo"
          type="file"
          label={t("courseNewPhoto")}
          errors={errors.new_photo}
          fullWidth
          render={({ field, form }: FieldProps<CourseFormValues>) => (
            <ImageDropzoneInput
              field={field}
              form={form}
              onImageLoad={(value: any) => setFieldValue("thumbnail", value)}
            >
              <ImagePreview
                file={addDomain(values.thumbnail)}
                onClose={(
                  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                ): void => {
                  e.stopPropagation()
                  e.nativeEvent.stopImmediatePropagation()
                  setFieldValue("photo", undefined)
                  setFieldValue("new_photo", undefined)
                  setFieldValue("thumbnail", undefined)
                }}
              />
            </ImageDropzoneInput>
          )}
        />
      </FormControl>
    </FormFieldGroup>
  )
}

export default CourseImageInput

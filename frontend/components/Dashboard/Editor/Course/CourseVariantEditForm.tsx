import React, { useState } from "react"
import { CourseVariantFormValues } from "/components/Dashboard/Editor/Course/types"
import { Field, FieldArray, FormikErrors, getIn } from "formik"
import { Grid } from "@material-ui/core"
import { initialVariant } from "./form-validation"
import AddIcon from "@material-ui/icons/Add"
import RemoveIcon from "@material-ui/icons/Remove"
import ConfirmationDialog from "/components/Dashboard/ConfirmationDialog"
import {
  OutlinedFormControl,
  OutlinedInputLabel,
  OutlinedFormGroup,
  StyledTextField,
} from "/components/Dashboard/Editor/common"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import styled from "styled-components"

const ButtonWithWhiteText = styled(StyledButton)`
  color: white;
`
const CourseVariantEditForm = ({
  values,
  errors,
  isSubmitting,
}: {
  values: CourseVariantFormValues[]
  errors: (FormikErrors<CourseVariantFormValues> | undefined)[] | undefined
  isSubmitting: boolean
}) => {
  const [removeDialogVisible, setRemoveDialogVisible] = useState(false)
  const [removableIndex, setRemovableIndex] = useState(-1)

  return (
    <section>
      <Grid item xs={12}>
        <OutlinedFormControl>
          <OutlinedInputLabel shrink>Course variants</OutlinedInputLabel>
          <OutlinedFormGroup>
            <FieldArray
              name="course_variants"
              render={helpers => (
                <>
                  <ConfirmationDialog
                    title="Are you sure?"
                    content="Do you want to remove this course variant?"
                    acceptText="Yes"
                    rejectText="No"
                    onAccept={() => {
                      setRemoveDialogVisible(false)
                      removableIndex >= 0 && helpers.remove(removableIndex)
                      setRemovableIndex(-1)
                    }}
                    onReject={() => {
                      setRemoveDialogVisible(false)
                      setRemovableIndex(-1)
                    }}
                    show={removeDialogVisible}
                  />
                  {values!.length
                    ? values!.map((variant, index: number) => (
                        <Grid container spacing={2} key={`variant-${index}`}>
                          <Grid item xs={4}>
                            <Field
                              name={`course_variants[${index}].slug`}
                              label="slug"
                              type="text"
                              component={StyledTextField}
                              value={variant.slug}
                              errors={[getIn(errors, `[${index}].slug`)]}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Field
                              name={`course_variants[${index}].description`}
                              label="description"
                              type="text"
                              component={StyledTextField}
                              value={variant.description}
                              errors={[getIn(errors, `[${index}].description`)]}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <Grid
                              container
                              justify="flex-end"
                              alignItems="center"
                            >
                              <StyledButton
                                variant="contained"
                                disabled={isSubmitting}
                                color="secondary"
                                onClick={() => {
                                  if (!variant.id && variant.slug === "") {
                                    helpers.remove(index)
                                  } else {
                                    setRemoveDialogVisible(true)
                                    setRemovableIndex(index)
                                  }
                                }}
                                endIcon={<RemoveIcon>remove</RemoveIcon>}
                              >
                                Remove
                              </StyledButton>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))
                    : "no variants"}
                  {(values!.length == 0 ||
                    (values!.length &&
                      values![values!.length - 1].slug !== "")) && (
                    <Grid container justify="flex-end">
                      <ButtonWithWhiteText
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={() => helpers.push({ ...initialVariant })}
                        endIcon={<AddIcon>add</AddIcon>}
                      >
                        Add
                      </ButtonWithWhiteText>
                    </Grid>
                  )}
                </>
              )}
            />
          </OutlinedFormGroup>
        </OutlinedFormControl>
      </Grid>
    </section>
  )
}

export default CourseVariantEditForm

import { useConfirm } from "material-ui-confirm"
import {
  FieldArrayWithId,
  Path,
  UnpackNestedValue,
  useFieldArray,
  useFormContext,
} from "react-hook-form"

import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import { FormGroup, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import { ButtonWithWhiteText } from "/components/Dashboard/Editor2/Common"
import { ControlledFieldProps } from "/components/Dashboard/Editor2/Common/Fields"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

export const ArrayList = styled("ul")`
  list-style: none;
  margin-block-start: 0;
  padding-inline-start: 0;
`

export const ArrayItem = styled("li")``

interface ControlledFieldArrayListProps<T extends { _id?: string }>
  extends ControlledFieldProps {
  initialValues: Partial<UnpackNestedValue<FieldArrayWithId<T, any, "_id">>>
  render: (
    item: Partial<FieldArrayWithId<T, any, string>>,
    index: number,
  ) => JSX.Element
  conditions: {
    add: (item: Partial<T>[]) => boolean
    remove: (item: Partial<FieldArrayWithId<T, any, string>>) => boolean
  }
  texts: {
    title?: string
    description?: string
    confirmationText?: string
    cancellationText?: string
    noFields?: string
    addText?: string
    removeText?: string
  }
}

export function ControlledFieldArrayList<T extends { _id?: string }>(
  props: ControlledFieldArrayListProps<T>,
) {
  const t = useTranslator(CoursesTranslations)
  const {
    render,
    initialValues,
    conditions,
    texts: {
      title = t("confirmationAreYouSure"),
      description = "default description",
      confirmationText = t("confirmationYes"),
      cancellationText = t("confirmationNo"),
      noFields = "no fields",
      addText = t("courseAdd"),
      removeText = t("courseRemove"),
    },
  } = props
  const name = props.name as Path<T>
  const { control, formState, watch, trigger } = useFormContext<T>()
  const { fields, append, remove } = useFieldArray<T, any, "_id">({
    name,
    control,
  })
  const { isSubmitting } = formState
  const confirm = useConfirm()

  const watchedFields = watch([name])

  return (
    <FormGroup>
      <ArrayList>
        {fields.length ? (
          fields.map((item, index) => (
            <ArrayItem key={`${name}-${item._id ?? index}`}>
              {render(item, index)}
              <StyledButton
                style={{ margin: "auto" }}
                variant="contained"
                disabled={isSubmitting}
                color="secondary"
                onClick={(e) => {
                  e.preventDefault()
                  if (conditions.remove(item)) {
                    remove(index)
                  } else {
                    confirm({
                      title,
                      description,
                      confirmationText,
                      cancellationText,
                    })
                      .then(() => {
                        remove(index)
                      })
                      .catch(() => {})
                  }
                }}
                endIcon={<RemoveIcon>{removeText}</RemoveIcon>}
              >
                {removeText}
              </StyledButton>
            </ArrayItem>
          ))
        ) : (
          <Typography
            variant="h3"
            component="p"
            align="center"
            gutterBottom={true}
          >
            {noFields}
          </Typography>
        )}
        {conditions.add(watchedFields as Partial<T>[]) ? (
          <ButtonWithWhiteText
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault()
              append({ ...initialValues })
              trigger(name)
            }}
            endIcon={<AddIcon>{addText}</AddIcon>}
            fullWidth
          >
            {addText}
          </ButtonWithWhiteText>
        ) : null}
      </ArrayList>
    </FormGroup>
  )
}

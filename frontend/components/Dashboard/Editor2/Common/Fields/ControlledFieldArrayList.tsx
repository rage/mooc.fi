import { useConfirm } from "material-ui-confirm"
import {
  FieldArray,
  FieldArrayPath,
  FieldArrayPathValue,
  FieldValues,
  Path,
  useFieldArray,
  useFormContext,
} from "react-hook-form"

import styled from "@emotion/styled"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import { FormGroup, Typography } from "@mui/material"

import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import { ButtonWithWhiteText } from "/components/Dashboard/Editor2/Common"
import { ControlledFieldArrayProps } from "/components/Dashboard/Editor2/Common/Fields"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

export const ArrayList = styled.ul`
  list-style: none;
  margin-block-start: 0;
  padding-inline-start: 0;
`

export const ArrayItem = styled.li``

type UnwrapArray<T> = T extends (infer U)[] ? U : T

type FieldArrayWithOptionalId<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = "id",
> = FieldArray<TFieldValues, TFieldArrayName> &
  Partial<Record<TKeyName, string>>

interface ControlledFieldArrayListProps<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = "_id",
  TItem extends FieldArrayWithOptionalId<
    TFieldValues,
    TFieldArrayName,
    TKeyName
  > = FieldArrayWithOptionalId<TFieldValues, TFieldArrayName, TKeyName>,
> extends ControlledFieldArrayProps<TFieldValues, TFieldArrayName> {
  initialValues: UnwrapArray<FieldArrayPathValue<TFieldValues, TFieldArrayName>>
  render: (item: TItem, index: number) => JSX.Element
  conditions: {
    add: (item: Array<TItem>) => boolean
    remove: (item: TItem) => boolean
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

export function ControlledFieldArrayList<
  TFieldValues extends Partial<FieldValues> & Partial<Record<"_id", string>>,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
>(props: ControlledFieldArrayListProps<TFieldValues, TFieldArrayName>) {
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
  const name = props.name
  const { control, formState, watch, trigger } = useFormContext<TFieldValues>()
  const { fields, append, remove } = useFieldArray({
    name,
    control,
    keyName: "_id",
  })
  const { isSubmitting } = formState
  const confirm = useConfirm()

  const watchedFields = watch([name as Path<TFieldValues>])

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
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
        {conditions.add(watchedFields) ? (
          <ButtonWithWhiteText
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault()
              append({ ...initialValues })
              trigger(name as Path<TFieldValues>)
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

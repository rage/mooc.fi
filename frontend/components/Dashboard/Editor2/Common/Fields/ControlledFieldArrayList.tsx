import { useCallback } from "react"

import { useConfirm } from "material-ui-confirm"
import {
  FieldArray,
  FieldArrayPath,
  FieldArrayPathValue,
  FieldArrayWithId,
  FieldValues,
  Path,
  useFieldArray,
  useFormContext,
} from "react-hook-form"

import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import { Button, FormGroup, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { ButtonWithWhiteText } from ".."
import { ControlledFieldArrayProps } from "."
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

export const ArrayList = styled("ul")`
  list-style: none;
  margin-block-start: 0;
  padding-inline-start: 0;
  align-content: center;
`

export const ArrayItem = styled("li")`
  display: flex;
  flex-direction: row;
  margin-bottom: 1.5rem;
  width: 100%;
  align-items: stretch;
`

type UnwrapArray<T> = T extends (infer U)[] ? U : T

export type FieldArrayWithOptionalId<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = "id",
> = FieldArray<TFieldValues, TFieldArrayName> &
  Partial<Record<TKeyName, string>>

export interface ControlledFieldArrayListProps<
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

export const StyledButton = styled(Button)`
  margin: 0.25rem;
  height: 3rem;
`

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

  const onRemove = useCallback(
    (
        item: FieldArrayWithId<TFieldValues, TFieldArrayName, "_id">,
        index: number,
      ) =>
      (e: React.MouseEvent<HTMLButtonElement>) => {
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
            .catch(() => {
              // ignore
            })
        }
      },
    [conditions, confirm, description, remove, title],
  )

  const onAdd = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      append({ ...initialValues })
      trigger(name as Path<TFieldValues>)
    },
    [append, initialValues, name, trigger],
  )

  return (
    <FormGroup>
      <ArrayList>
        {fields.length ? (
          fields.map((item, index) => (
            <ArrayItem key={`${name}-${item._id ?? index}`}>
              {render(item, index)}
              <StyledButton
                variant="contained"
                disabled={isSubmitting}
                color="secondary"
                onClick={onRemove(item, index)}
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
            onClick={onAdd}
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

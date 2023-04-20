import React, { useCallback, useMemo } from "react"

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

import { ControlledFieldArrayProps } from "."
import { ButtonWithWhiteText } from ".."
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
import CoursesTranslations from "/translations/courses"

export const ArrayList = styled("ul")`
  list-style: none;
  margin-block-start: 0;
  padding-inline-start: 0;
  align-content: center;
  width: 100%;
`

export const ArrayItem = styled("li")`
  display: flex;
  flex-direction: row;
  margin-bottom: 1.5rem;
  width: 100%;
  align-items: stretch;
  gap: 1rem;
`

type UnwrapArray<T> = T extends (infer U)[] ? U : T

export type FieldArrayWithOptionalId<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = "id",
> = FieldArray<TFieldValues, TFieldArrayName> &
  Partial<Record<TKeyName, string>>

export interface RenderItemProps<TItem> {
  item: TItem
  index: number
  children?: React.ReactNode
}
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
  render: (props: RenderItemProps<TItem>) => JSX.Element
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

function ControlledFieldArrayListImpl<
  TFieldValues extends Partial<FieldValues> & Partial<Record<"_id", string>>,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
>(props: ControlledFieldArrayListProps<TFieldValues, TFieldArrayName>) {
  const t = useTranslator(CoursesTranslations, CommonTranslations)
  const {
    render,
    initialValues,
    conditions,
    texts: {
      title = t("confirmationAreYouSure"),
      description,
      confirmationText = t("confirmationYes"),
      cancellationText = t("confirmationNo"),
      noFields = t("noFields"),
      addText = t("add"),
      removeText = t("remove"),
    },
    name,
  } = props
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

  const canAddField = useMemo(
    () => conditions.add(watchedFields),
    [conditions, watchedFields],
  )

  return (
    <FormGroup key={name}>
      <ArrayList>
        {fields.length ? (
          fields.map((item, index) => (
            <ArrayItem key={item._id ?? index}>
              {render({ item, index })}
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
          <Typography variant="h3" component="p" align="center" gutterBottom>
            {noFields}
          </Typography>
        )}
        {canAddField && (
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
        )}
      </ArrayList>
    </FormGroup>
  )
}

export const ControlledFieldArrayList = React.memo(
  ControlledFieldArrayListImpl,
) as typeof ControlledFieldArrayListImpl

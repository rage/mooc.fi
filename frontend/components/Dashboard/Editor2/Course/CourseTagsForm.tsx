import { useCallback, useMemo } from "react"

import { omit } from "lodash"
import { Controller, FieldValues, useFormContext } from "react-hook-form"

import {
  Autocomplete,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderInputParams,
  Chip,
  TextField,
} from "@mui/material"

import { DefaultFieldRenderProps } from "../Common/Fields"
import { TagFormValues } from "./types"
import CoursesTranslations from "/translations/courses"
import notEmpty from "/util/notEmpty"
import { useTranslator } from "/util/useTranslator"

import { TagCoreFieldsFragment } from "/graphql/generated"
import { FormFieldGroup } from "../Common"

interface CourseTagFormProps {
  tags: TagCoreFieldsFragment[]
}

function CourseTagsForm({ tags }: CourseTagFormProps) {
  const t = useTranslator(CoursesTranslations)
  const { control, setValue, getValues } = useFormContext()

  const options = useMemo(
    () => tags?.map((tag) => tag.name).filter(notEmpty),
    [tags],
  )

  const onChange = useCallback(
    (_: any, newValue: string[]) => {
      console.log("new value", newValue)
      setValue("tags", newValue, { shouldDirty: true })
    },
    [setValue],
  )

  const onDelete = useCallback(
    (index: number) => () =>
      setValue(
        "tags",
        getValues("tags").filter((_: any, _index: number) => index !== _index),
        { shouldDirty: true },
      ),
    [setValue, getValues],
  )

  const renderTags = useCallback(
    (value: any[], getTagProps: AutocompleteRenderGetTagProps) =>
      value.map((field: string, index) => (
        <Chip
          {...getTagProps({ index })}
          variant="outlined"
          label={field ?? ""}
          onDelete={onDelete(index)}
        />
      )),
    [setValue, getValues],
  )

  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <TextField {...params} variant="outlined" label={t("courseTags")} />
    ),
    [],
  )

  const renderAutocomplete = useCallback(
    (renderProps: DefaultFieldRenderProps<FieldValues, "tags">) => (
      <Autocomplete
        {...omit(renderProps, ["formState", "fieldState"])}
        multiple
        options={options}
        value={renderProps.field?.value ?? []}
        onChange={onChange}
        renderTags={renderTags}
        renderInput={renderInput}
      />
    ),
    [onChange, renderTags, renderInput],
  )

  return (
    <FormFieldGroup>
      <Controller name="tags" control={control} render={renderAutocomplete} />
    </FormFieldGroup>
  )
}

export default CourseTagsForm

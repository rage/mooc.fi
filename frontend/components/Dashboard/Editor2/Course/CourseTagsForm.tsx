import { useCallback, useMemo } from "react"

import { omit, orderBy } from "lodash"
import { Controller, useFormContext } from "react-hook-form"

import {
  Autocomplete,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderInputParams,
  Chip,
  TextField,
} from "@mui/material"

import { FormFieldGroup } from "../Common"
import { DefaultFieldRenderProps } from "../Common/Fields"
import { FormValues } from "../types"
import { TagFormValue } from "./types"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

interface CourseTagFormProps {
  tags: TagFormValue[]
}

function CourseTagsForm({ tags }: CourseTagFormProps) {
  const t = useTranslator(CoursesTranslations)
  const { control, setValue, getValues } = useFormContext()

  const options = useMemo(
    () =>
      orderBy(tags ?? [], [
        (tag) => tag.types,
        (tag) => tag.name?.toLocaleLowerCase(),
      ]),
    [tags],
  )

  const onChange = useCallback(
    (_: any, newValue: Array<TagFormValue>) => {
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
    (value: Array<TagFormValue>, getTagProps: AutocompleteRenderGetTagProps) =>
      value.map((field, index) => (
        <Chip
          {...getTagProps({ index })}
          variant="outlined"
          label={field.name ?? ""}
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

  const renderOption = useCallback(
    (props: React.HTMLAttributes<HTMLLIElement>, option: TagFormValue) => (
      <li {...props}>{option.name}</li>
    ),
    [],
  )

  const renderAutocomplete = useCallback(
    (renderProps: DefaultFieldRenderProps<FormValues, "tags">) => (
      <Autocomplete
        {...omit(renderProps, ["formState", "fieldState"])}
        multiple
        options={options}
        value={renderProps.field?.value ?? []}
        onChange={onChange}
        renderTags={renderTags}
        renderInput={renderInput}
        renderOption={renderOption}
        getOptionLabel={(option) => option.name ?? ""}
        isOptionEqualToValue={(option, value) => option._id === value._id}
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

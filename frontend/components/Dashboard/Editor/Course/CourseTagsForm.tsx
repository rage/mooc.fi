import { useCallback, useMemo } from "react"

import { omit, orderBy } from "lodash"
import {
  Controller,
  UseControllerReturn,
  useFormContext,
} from "react-hook-form"

import {
  Autocomplete,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderInputParams,
  Chip,
  TextField,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { FormFieldGroup } from "../Common"
import { FormValues } from "../types"
import { TagFormValue } from "./types"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

const TagTypeChip = styled(Chip)`
  margin-right: 0.5rem;
`
interface CourseTagFormProps {
  tags: TagFormValue[]
}

const hasNoLanguageTag = (tag: TagFormValue) =>
  !(tag.types ?? []).includes("language")
const filterLanguageTags = (tags: TagFormValue[]) =>
  tags.filter(hasNoLanguageTag)

function CourseTagsForm({ tags }: CourseTagFormProps) {
  const t = useTranslator(CoursesTranslations)
  const { control, setValue, getValues } = useFormContext()

  const options = useMemo(
    () =>
      orderBy(tags ?? [], [
        (tag) => tag.types,
        (tag) => tag.name?.toLocaleLowerCase(),
      ]).filter(hasNoLanguageTag), // language tag should come from course instance language
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
    (tags: Array<TagFormValue>, getTagProps: AutocompleteRenderGetTagProps) => {
      return tags.map((tag, index) => {
        if (!hasNoLanguageTag(tag)) {
          return null
        }
        return (
          <Chip
            {...getTagProps({ index })}
            variant="outlined"
            label={tag.name ?? ""}
            onDelete={onDelete(index)}
          />
        )
      })
    },
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
      <li {...props}>
        {option?.types?.map((type) => (
          <TagTypeChip
            variant="outlined"
            label={type}
            size="small"
            key={type}
          />
        ))}
        {option.name}
      </li>
    ),
    [],
  )

  const renderAutocomplete = useCallback(
    (renderProps: UseControllerReturn<FormValues, "tags">) => (
      <Autocomplete
        {...omit(renderProps, ["formState", "fieldState"])}
        multiple
        value={filterLanguageTags(renderProps.field?.value ?? [])}
        options={options}
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

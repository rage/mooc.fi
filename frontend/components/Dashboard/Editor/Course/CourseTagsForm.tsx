import { useCallback, useMemo } from "react"

import { useController, useFormContext } from "react-hook-form"
import { sortBy } from "remeda"

import {
  Autocomplete,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderGroupParams,
  AutocompleteRenderInputParams,
  Chip,
  TextField,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import { FormFieldGroup } from "../Common"
import { useCourseEditorData } from "./CourseEditorDataContext"
import { CourseFormValues, TagFormValue } from "./types"
import { useAnchor } from "/hooks/useAnchors"
import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"

const TagTypeChip = styled(Chip)`
  margin-right: 0.5rem;
`

const GroupHeader = styled("div")`
  padding: 0.5rem;
  background-color: #eee;
`
const GroupItems = styled("ul")`
  padding: 0;
`

const renderOption = (
  props: React.HTMLAttributes<HTMLLIElement>,
  option: TagFormValue,
) => <li {...props}>{option.name}</li>

const renderGroup =
  (typeLabel: (type: string) => string) =>
  (params: AutocompleteRenderGroupParams) => (
    <li key={params.key}>
      <GroupHeader>
        {params.group
          ?.split(", ")
          .map((type) => (
            <TagTypeChip
              key={type}
              variant="outlined"
              label={typeLabel(type)}
              size="small"
            />
          ))}
      </GroupHeader>
      <GroupItems>{params.children}</GroupItems>
    </li>
  )

function CourseTagsForm() {
  const { tagOptions } = useCourseEditorData()
  const t = useTranslator(CoursesTranslations)
  const { setValue, getValues } = useFormContext()
  const { field } = useController<CourseFormValues, "tags">({ name: "tags" })
  const anchor = useAnchor("tags")

  const options = useMemo(
    () => sortBy(tagOptions ?? [], (tag) => tag.name?.toLocaleLowerCase()),
    [tagOptions],
  )
  const typeLabel = useCallback(
    (type: string) =>
      (
        ({
          language: t("tagTypeLanguage"),
          difficulty: t("tagTypeDifficulty"),
          module: t("tagTypeModule"),
          none: t("tagTypeNone"),
        }) as Record<string, string>
      )[type] ?? type,
    [t],
  )
  const renderGroupWithLabels = useMemo(
    () => renderGroup(typeLabel),
    [typeLabel],
  )

  const onChange = useEventCallback((_: any, newValue: Array<TagFormValue>) => {
    setValue("tags", newValue, { shouldDirty: true })
  })

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
      return tags.map((tag, index) => (
        <Chip
          {...getTagProps({ index })}
          variant="outlined"
          label={tag.name ?? ""}
          onDelete={onDelete(index)}
        />
      ))
    },
    [setValue, getValues],
  )

  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <TextField
        {...params}
        inputRef={field.ref}
        variant="outlined"
        label={t("courseTags")}
      />
    ),
    [t, field],
  )

  return (
    <FormFieldGroup>
      <Autocomplete
        multiple
        ref={anchor.ref}
        value={field.value ?? []}
        options={options}
        onChange={onChange}
        groupBy={(option) => option.types?.join(", ") || "none"}
        renderTags={renderTags}
        renderInput={renderInput}
        renderOption={renderOption}
        renderGroup={renderGroupWithLabels}
        getOptionLabel={(option) => option.name ?? ""}
        isOptionEqualToValue={(option, value) => option._id === value._id}
      />
    </FormFieldGroup>
  )
}

export default CourseTagsForm

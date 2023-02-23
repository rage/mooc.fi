import { useCallback, useMemo } from "react"

import { omit } from "lodash"
import { Controller, useFormContext } from "react-hook-form"

import {
  Autocomplete,
  AutocompleteRenderInputParams,
  TextField,
} from "@mui/material"

import { FormFieldGroup } from "../Common"
import { DefaultFieldRenderProps } from "../Common/Fields"
import { FormValues } from "../types"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

const isString = (value: any): value is string => typeof value === "string"

const languages = [
  "se",
  /*  'sv',   */
  "fi",
  "ee",
  "de",
  "no",
  "lv",
  "lt",
  "fr",
  "fr-be",
  "nl-be",
  "mt",
  "en-ie",
  "pl",
  "hr",
  "ro",
  "da",
  "it",
  "cs",
  "bg",
  "en-lu",
  "sk",
  "nl",
  "pt",
  "de-at",
  "el",
  "es",
  "sl",
  "is",
  "ga",
  "el-cy",
  "en",
]

interface Option {
  value: string | undefined
  name: string
}

function CourseInstanceLanguageSelector() {
  const t = useTranslator(CoursesTranslations)
  const { control, setValue, getValues } = useFormContext()

  const options = useMemo(
    () =>
      languages
        .map<Option>((e) => ({ value: e, name: e }))
        .concat({ value: undefined, name: "" }),
    [],
  )

  const onChange = useCallback(
    (_: any, option: string | Option | null) => {
      const newValue = isString(option)
        ? languages.includes(option)
          ? option
          : undefined
        : option?.value ?? undefined
      setValue("language", newValue, { shouldDirty: true })
    },
    [setValue],
  )

  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <TextField
        {...params}
        variant="outlined"
        label={t("courseInstanceLanguage")}
        inputProps={{ ...params.inputProps, autoComplete: "language-input" }}
      />
    ),
    [],
  )

  const renderOption = useCallback(
    (props: React.HTMLAttributes<HTMLLIElement>, option: Option) => (
      <li {...props} key={option.name}>
        {option.name}
      </li>
    ),
    [],
  )

  const renderAutocomplete = useCallback(
    (renderProps: DefaultFieldRenderProps<FormValues, "language">) => (
      <Autocomplete
        {...omit(renderProps, ["formState", "fieldState"])}
        options={options}
        autoHighlight
        value={renderProps.field?.value ?? ""}
        getOptionLabel={(option) => option?.name ?? ""}
        renderInput={renderInput}
        renderOption={renderOption}
        onChange={onChange}
      />
    ),
    [onChange, getValues("language")],
  )

  return (
    <FormFieldGroup>
      <Controller
        name="language"
        control={control}
        render={renderAutocomplete}
      />
    </FormFieldGroup>
  )
}

export default CourseInstanceLanguageSelector

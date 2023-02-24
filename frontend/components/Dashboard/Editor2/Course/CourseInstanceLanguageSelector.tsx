import { useCallback, useMemo } from "react"

import { omit } from "lodash"
import { Controller, useFormContext } from "react-hook-form"

import HelpIcon from "@mui/icons-material/Help"
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  TextField,
  Tooltip,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { DefaultFieldRenderProps } from "../Common/Fields"
import { FormValues } from "../types"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

const QuestionTooltip = styled(Tooltip)`
  :hover {
    cursor: help;
  }
`

const InputContainer = styled("div")`
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
`

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
  const { control, setValue } = useFormContext()

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
      <InputContainer>
        <TextField
          {...params}
          variant="outlined"
          label={t("courseInstanceLanguage")}
        />
        <QuestionTooltip title={t("helpCourseInstanceLanguage")}>
          <HelpIcon />
        </QuestionTooltip>
      </InputContainer>
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
    (renderProps: DefaultFieldRenderProps<FormValues, "language">) => {
      console.log(renderProps)
      return (
        <Autocomplete
          {...omit(renderProps, ["field", "formState", "fieldState"])}
          options={options}
          autoHighlight
          getOptionLabel={(option) => option?.name ?? ""}
          renderInput={renderInput}
          renderOption={renderOption}
          onChange={onChange}
          isOptionEqualToValue={(option, value) =>
            option.value === value?.value
          }
        />
      )
    },
    [onChange],
  )

  return (
    <Controller name="language" control={control} render={renderAutocomplete} />
  )
}

export default CourseInstanceLanguageSelector

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
import CommonTranslations from "/translations/common"
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
  "hu",
  "fr-lu",
]

interface Option {
  value: string | undefined
  name: string
}

const toOption = (value: string | undefined): Option => ({
  value,
  name: value ?? "",
})

function CourseInstanceLanguageSelector() {
  const t = useTranslator(CoursesTranslations, CommonTranslations)
  const { control, setValue } = useFormContext()

  const options = useMemo(
    () => [
      { value: undefined, name: t("selectNoChoice") },
      ...languages.map(toOption),
    ],
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
        {option.name ?? t("selectNoChoice")}
      </li>
    ),
    [],
  )

  const renderAutocomplete = useCallback(
    (renderProps: DefaultFieldRenderProps<FormValues, "language">) => {
      return (
        <Autocomplete
          {...omit(renderProps, ["field", "formState", "fieldState"])}
          options={options}
          autoHighlight
          value={toOption(renderProps.field.value)}
          getOptionLabel={(option) => option?.name ?? ""}
          renderInput={renderInput}
          renderOption={renderOption}
          onChange={onChange}
          isOptionEqualToValue={(option, optionValue) =>
            option.value === optionValue?.value
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

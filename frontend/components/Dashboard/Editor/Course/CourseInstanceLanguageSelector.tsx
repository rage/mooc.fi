import { useCallback, useMemo } from "react"

import { useController, useFormContext } from "react-hook-form"

import HelpIcon from "@mui/icons-material/Help"
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  TextField,
  Tooltip,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import { useAnchor } from "../EditorContext"
import { CourseFormValues } from "./types"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
import CoursesTranslations from "/translations/courses"

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
  "en",
  "fi",
  "se",
  /*  'sv',   */
  "de",
  "fr",
  "no",
  "ee",
  "lv",
  "lt",
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
  const { setValue } = useFormContext()

  const anchor = useAnchor("language")
  const { field } = useController<CourseFormValues, "language">({
    name: "language",
  })

  const options = useMemo(
    () => [
      { value: "", name: t("selectNoChoice") },
      ...languages.map(toOption),
    ],
    [],
  )

  const onChange = useEventCallback(
    (_: any, option: string | Option | null) => {
      const newValue = isString(option)
        ? languages.includes(option)
          ? option
          : ""
        : option?.value ?? ""
      setValue("language", newValue, { shouldDirty: true })
    },
  )

  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <InputContainer>
        <TextField
          {...params}
          inputRef={field.ref}
          variant="outlined"
          label={t("courseInstanceLanguage")}
          defaultValue=""
        />
        <QuestionTooltip title={t("helpCourseInstanceLanguage")}>
          <HelpIcon />
        </QuestionTooltip>
      </InputContainer>
    ),
    [field],
  )

  const renderOption = useCallback(
    (props: React.HTMLAttributes<HTMLLIElement>, option: Option) => (
      <li {...props} key={option.name}>
        {option.name ?? t("selectNoChoice")}
      </li>
    ),
    [],
  )

  const value = useMemo(() => toOption(field.value), [field.value])

  return (
    <Autocomplete
      ref={anchor.ref}
      options={options}
      autoHighlight
      value={value}
      getOptionLabel={(option) => option?.name ?? ""}
      renderInput={renderInput}
      renderOption={renderOption}
      onChange={onChange}
      isOptionEqualToValue={(option, optionValue) =>
        option.value === optionValue?.value
      }
    />
  )
  /*return (
    <Controller name="language" control={control} render={renderAutocomplete} />
  )*/
}

export default CourseInstanceLanguageSelector

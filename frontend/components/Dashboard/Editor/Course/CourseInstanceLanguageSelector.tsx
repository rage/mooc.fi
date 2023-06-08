import React, { useCallback, useMemo } from "react"

import { useController, useFormContext } from "react-hook-form"

import {
  Autocomplete,
  AutocompleteRenderInputParams,
  InputAdornment,
  TextField,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import { useCourseEditorData } from "./CourseEditorDataContext"
import { CourseFormValues } from "./types"
import RevertButton from "/components/RevertButton"
import { InfoTooltip } from "/components/Tooltip"
import { useAnchor } from "/hooks/useAnchors"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
import CoursesTranslations from "/translations/courses"

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
  "es-uy",
]

interface Option {
  value: string | undefined
  name: string
}

const toOption = (value: string | undefined): Option => ({
  value,
  name: value ?? "",
})

function CourseInstanceLanguageSelector(
  props: Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue">,
) {
  const t = useTranslator(CoursesTranslations, CommonTranslations)
  const { defaultValues } = useCourseEditorData()

  const { setValue, resetField } = useFormContext()

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
      let newValue = ""

      if (isString(option)) {
        newValue = languages.includes(option) ? option : ""
      } else if (option?.value) {
        newValue = option?.value
      }
      setValue("language", newValue, { shouldDirty: true })
    },
  )

  const onRevert = useCallback(() => resetField("language"), [resetField])

  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <InputContainer>
        <TextField
          {...params}
          inputRef={field.ref}
          variant="outlined"
          label={t("courseInstanceLanguage")}
          InputProps={{
            ...params?.InputProps,
            endAdornment: (
              <InputAdornment
                position="end"
                className="MuiAutocomplete-endAdornment"
              >
                <RevertButton
                  disabled={
                    !defaultValues["language"] ||
                    field.value === defaultValues["language"]
                  }
                  onRevert={onRevert}
                />
                <InfoTooltip
                  label={t("courseInstanceLanguage")}
                  title={t("helpCourseInstanceLanguage")}
                />
                {params?.InputProps?.endAdornment}
              </InputAdornment>
            ),
          }}
        />
      </InputContainer>
    ),
    [t, field],
  )

  const renderOption = useCallback(
    (props: React.HTMLAttributes<HTMLLIElement>, option: Option) => (
      <li {...props} key={option.name}>
        {option.name ?? t("selectNoChoice")}
      </li>
    ),
    [t],
  )

  const value = useMemo(() => toOption(field.value), [field.value])

  return (
    <Autocomplete
      {...props}
      ref={anchor.ref}
      options={options}
      autoHighlight
      value={value}
      selectOnFocus
      clearOnBlur
      getOptionLabel={(option) => option?.name ?? ""}
      renderInput={renderInput}
      renderOption={renderOption}
      onChange={onChange}
      isOptionEqualToValue={(option, optionValue) =>
        option.value === optionValue?.value
      }
    />
  )
}

export default CourseInstanceLanguageSelector

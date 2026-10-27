import { useCallback, useMemo } from "react"

import { useConfirm } from "material-ui-confirm"
import { UseFieldArrayReturn, useFormContext } from "react-hook-form"

import { ToggleButton, ToggleButtonGroup } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import { FormSubtitle } from "../../EditorLegacy/common"
import { useCourseEditorData } from "./CourseEditorDataContext"
import { initialTranslation } from "./form-validation"
import { CourseFormValues, TagFormValue } from "./types"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
import CoursesTranslations from "/translations/courses"

export const translationLanguages = ["fi_FI", "en_US", "sv_SE"] as const

const languageTagIds: Record<string, string> = {
  fi_FI: "fi",
  en_US: "en",
  sv_SE: "se",
}

const selectableLanguages = ["fi_FI", "en_US"] as const

const languageRank = (language?: string) =>
  translationLanguages.indexOf(
    language as (typeof translationLanguages)[number],
  )

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`

type TranslationFieldArray = UseFieldArrayReturn<
  CourseFormValues,
  "course_translations"
>

export function useLanguageTagSync() {
  const { tagOptions } = useCourseEditorData()
  const { getValues, setValue } = useFormContext<CourseFormValues>()

  return useEventCallback((language: string, enabled: boolean) => {
    const tagId = languageTagIds[language]
    const tags: TagFormValue[] = getValues("tags") ?? []
    const hasTag = tags.some((tag) => tag._id === tagId)

    if (enabled && !hasTag) {
      const option = tagOptions?.find((tag) => tag._id === tagId)

      if (option) {
        setValue("tags", [...tags, option], { shouldDirty: true })
      }
    } else if (!enabled && hasTag) {
      setValue(
        "tags",
        tags.filter((tag) => tag._id !== tagId),
        { shouldDirty: true },
      )
    }
  })
}

interface LanguageSelectorProps {
  translations: TranslationFieldArray
}

function CourseLanguageSelector({ translations }: LanguageSelectorProps) {
  const { fields, insert, remove } = translations
  const { getValues } = useFormContext<CourseFormValues>()
  const confirm = useConfirm()
  const syncLanguageTag = useLanguageTagSync()
  const t = useTranslator(CoursesTranslations, CommonTranslations)

  const selected = useMemo(
    () => fields.map((field) => field.language as string),
    [fields],
  )

  const labels: Record<string, string> = useMemo(
    () => ({
      fi_FI: t("courseFinnish"),
      en_US: t("courseEnglish"),
    }),
    [t],
  )

  const onToggle = useCallback(
    async (language: string) => {
      const index = selected.indexOf(language)

      if (index === -1) {
        const position = selected.filter(
          (other) => languageRank(other) < languageRank(language),
        ).length

        insert(position, { ...initialTranslation, language } as any)
        syncLanguageTag(language, true)
        return
      }

      const { name, description } = getValues(`course_translations.${index}`)

      if (name || description) {
        try {
          await confirm({
            title: t("courseRemoveTranslation"),
            description: t("confirmationRemoveTranslation"),
            confirmationText: t("confirmationYes"),
            cancellationText: t("confirmationNo"),
          })
        } catch {
          return
        }
      }
      remove(index)
      syncLanguageTag(language, false)
    },
    [selected, insert, remove, getValues, confirm, t, syncLanguageTag],
  )

  return (
    <>
      <FormSubtitle variant="h3" component="h3" align="center">
        {t("courseLanguageSelectTitle")}
      </FormSubtitle>
      <StyledToggleButtonGroup
        color="primary"
        aria-label={t("courseLanguageSelectTitle")}
      >
        {selectableLanguages.map((language) => (
          <ToggleButton
            key={language}
            value={language}
            selected={selected.includes(language)}
            onClick={() => onToggle(language)}
          >
            {labels[language]}
          </ToggleButton>
        ))}
      </StyledToggleButtonGroup>
    </>
  )
}

export default CourseLanguageSelector

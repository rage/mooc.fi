import React, { useCallback, useMemo } from "react"

import {
  ControlledFieldArrayList,
  ControlledFieldArrayListProps,
  ControlledHiddenField,
  ControlledSelect,
  ControlledTextField,
} from "/components/Dashboard/Editor2/Common/Fields"
import {
  initialTranslation,
  languages,
} from "/components/Dashboard/Editor2/StudyModule/form-validation"
import { StudyModuleFormValues } from "/components/Dashboard/Editor2/StudyModule/types"
import { EntryContainer } from "/components/Surfaces/EntryContainer"
import { LanguageEntry } from "/components/Surfaces/LanguageEntryGrid"
import StudyModuleTranslations from "/translations/study-modules"
import { useTranslator } from "/util/useTranslator"

function StudyModuleTranslationsForm() {
  const t = useTranslator(StudyModuleTranslations)
  const _languages = languages(t)

  const renderArrayListItem: ControlledFieldArrayListProps<
    StudyModuleFormValues,
    "study_module_translations"
  >["render"] = useCallback(
    (item, index) => (
      <LanguageEntry item>
        <EntryContainer elevation={2}>
          <ControlledHiddenField name="_id" defaultValue={item._id} />
          <ControlledSelect
            name={`study_module_translations.${index}.language`}
            label={t("moduleLanguage")}
            items={_languages}
            keyField="value"
            nameField="label"
          />
          <ControlledTextField
            name={`study_module_translations.${index}.name`}
            label={t("moduleName")}
            revertable
          />
          <ControlledTextField
            name={`study_module_translations.${index}.description`}
            label={t("moduleDescription")}
            type="textarea"
            rows={5}
            revertable
          />
        </EntryContainer>
      </LanguageEntry>
    ),
    [],
  )

  const conditions: ControlledFieldArrayListProps<
    StudyModuleFormValues,
    "study_module_translations"
  >["conditions"] = useMemo(
    () => ({
      add: (values) => values.length < _languages.length,
      remove: () => true,
    }),
    [_languages],
  )

  return (
    <section>
      <ControlledFieldArrayList<
        StudyModuleFormValues,
        "study_module_translations"
      >
        name="study_module_translations"
        label={""}
        initialValues={initialTranslation}
        texts={{
          description: t("moduleConfirmationContent"),
          noFields: t("moduleAtLeastOneTranslation"),
        }}
        conditions={conditions}
        render={renderArrayListItem}
      />
    </section>
  )
}

export default StudyModuleTranslationsForm

import React, { useCallback, useMemo } from "react"

import { styled } from "@mui/material/styles"

import { FormSubtitle } from "../Common"
import {
  ControlledFieldArrayList,
  ControlledFieldArrayListProps,
  ControlledHiddenField,
  ControlledSelect,
  ControlledTextField,
} from "../Common/Fields"
import { initialTranslation, languages } from "./form-validation"
import { StudyModuleFormValues } from "./types"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
import StudyModulesTranslations from "/translations/study-modules"

const ItemContainer = styled("div")`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

function StudyModuleTranslationsForm() {
  const t = useTranslator(StudyModulesTranslations, CommonTranslations)
  const _languages = languages(t)

  const renderArrayListItem: ControlledFieldArrayListProps<
    StudyModuleFormValues,
    "study_module_translations"
  >["render"] = useCallback(
    ({ item, index }) => (
      <ItemContainer>
        <ControlledHiddenField name="_id" defaultValue={item._id} />
        <ControlledSelect<StudyModuleFormValues>
          name={`study_module_translations.${index}.language`}
          label={t("moduleLanguage")}
          items={_languages}
          keyField="value"
          nameField="label"
          required
        />
        <ControlledTextField
          name={`study_module_translations.${index}.name`}
          label={t("moduleName")}
          defaultValue={item.name}
          required
          revertable
        />
        <ControlledTextField
          name={`study_module_translations.${index}.description`}
          label={t("moduleDescription")}
          type="textarea"
          defaultValue={item.description}
          required
          rows={5}
          revertable
        />
      </ItemContainer>
    ),
    [t],
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

  const texts = useMemo(
    () => ({
      description: t("moduleConfirmationContent"),
      noFields: t("moduleAtLeastOneTranslation"),
    }),
    [t],
  )

  return (
    <>
      <FormSubtitle variant="h6" component="h3" align="center">
        {t("moduleTranslationsTitle")}
      </FormSubtitle>

      <ControlledFieldArrayList<
        StudyModuleFormValues,
        "study_module_translations"
      >
        name="study_module_translations"
        label={t("moduleTranslations")}
        initialValues={initialTranslation}
        texts={texts}
        conditions={conditions}
        render={renderArrayListItem}
      />
    </>
  )
}

export default StudyModuleTranslationsForm

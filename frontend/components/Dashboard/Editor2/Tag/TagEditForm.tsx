import { useCallback, useMemo, useRef } from "react"

import { omit } from "lodash"
import { FormProvider, useForm } from "react-hook-form"

import {
  ControlledFieldArrayList,
  ControlledFieldArrayListProps,
  ControlledTextField,
} from "../Common/Fields"

import { TagCoreFieldsFragment } from "/graphql/generated"

interface TagEditorProps {
  tags: TagCoreFieldsFragment[]
}

type TagValues = {
  _id: string
  hidden: boolean
  types: string[]
  tag_translations: TagTranslationValue[]
}

type TagTranslationValue = {
  language: string
  name: string
  description?: string
}

function toTagValues(tags: TagCoreFieldsFragment[]) {
  return tags.map((tag) => ({
    ...omit(tag, ["__typename", "id", "name"]),
    _id: tag.id,
    hidden: tag.hidden ?? false,
    types: tag.types ?? [],
    tag_translations: (tag.tag_translations ?? []).map((tt) => ({
      ...omit(tt, ["__typename"]),
      language: tt.language ?? undefined,
      description: tt.description ?? undefined,
    })),
  }))
}

const initialTagTranslation = {
  language: "",
  name: "",
  description: "",
}

function TagEditor({ tags }: TagEditorProps) {
  const initialValues = useRef(toTagValues(tags))

  const methods = useForm({
    defaultValues: initialValues.current,
  })

  const conditions: ControlledFieldArrayListProps<
    TagValues,
    "tag_translations"
  >["conditions"] = useMemo(
    () => ({
      add: (values) => values?.[values.length - 1]?.name !== "",
      remove: (item) => !item._id && item.name === "",
    }),
    [],
  )

  const renderArrayListItem: ControlledFieldArrayListProps<
    TagValues,
    "tag_translations"
  >["render"] = useCallback(
    (item, index) => (
      <>
        <ControlledTextField
          name={`tag_translations.${index}.language`}
          label="language"
          required
          defaultValue={item.language}
        />
        <ControlledTextField
          name={`tag_translations.${index}.name`}
          label="name"
          required
          defaultValue={item.name}
        />
        <ControlledTextField
          name={`tag_translations.${index}.description`}
          label="description"
          defaultValue={item.description}
        />
      </>
    ),
    [],
  )

  return (
    <FormProvider {...methods}>
      <ControlledFieldArrayList<TagValues, "tag_translations">
        name="tag_translations"
        label="tag translations"
        initialValues={initialTagTranslation}
        texts={{
          description: "description",
          noFields: "no fields",
        }}
        conditions={conditions}
        render={renderArrayListItem}
      />
    </FormProvider>
  )
}

export default TagEditor

import React, { useCallback } from "react"

import { Autocomplete, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import { KeyOfTranslationDictionary } from "/translations"
import CommonTranslations from "/translations/common"
import { isDefinedAndNotEmpty } from "/util/guards"

import { TagCoreFieldsFragment } from "/graphql/generated"

const TagsContainer = styled("div")`
  display: flex;
  flex-direction: column;
  width: 100%;

  & > .MuiAutocomplete-root {
    margin-bottom: 0.5rem;
  }
`

interface TagSelectDropdownProps {
  tags: Record<string, Array<TagCoreFieldsFragment>>
  activeTags: Array<TagCoreFieldsFragment>
  setActiveTags: (
    tags:
      | Array<TagCoreFieldsFragment>
      | ((tags: Array<TagCoreFieldsFragment>) => Array<TagCoreFieldsFragment>),
  ) => void
  selectAllTags: () => void
}

const TagSelectDropdowns = ({
  tags,
  activeTags,
  setActiveTags,
}: TagSelectDropdownProps) => {
  const t = useTranslator(CommonTranslations)
  const allTags = Object.values(tags).flatMap((t) => t)

  const onChange = useCallback(
    (category: string) =>
      (_: any, value: Array<string> | Array<TagCoreFieldsFragment>) => {
        setActiveTags((prevValue) => [
          ...prevValue.filter(
            (tag) =>
              isDefinedAndNotEmpty(tag) && !tag.types?.includes(category),
          ),
          ...value
            .map((s) => {
              if (typeof s === "string") {
                return allTags.find((tag) => tag.id === s)
              }
              return s
            })
            .filter(isDefinedAndNotEmpty),
        ])
      },
    [allTags],
  )

  return (
    <TagsContainer>
      {Object.keys(tags).map((category) => {
        const categoryActiveTags = activeTags.filter(
          (tag) => tag.types?.includes(category),
        )
        return (
          <Autocomplete
            key={category}
            multiple
            fullWidth
            getOptionLabel={(option) => option.name ?? ""}
            options={tags[category]}
            value={categoryActiveTags}
            onChange={onChange(category)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t(
                  category as KeyOfTranslationDictionary<
                    typeof CommonTranslations
                  >,
                )}
              />
            )}
          />
        )
      })}
    </TagsContainer>
  )
}

export default TagSelectDropdowns

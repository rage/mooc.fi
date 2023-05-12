import React, { useCallback } from "react"

import { Button, Chip } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

import { TagCoreFieldsFragment } from "/graphql/generated"

const TagsContainer = styled("div")`
  display: grid;
  grid-template-areas:
    "languageTags languageSelectAll"
    "difficultyTags difficultySelectAll"
    "moduleTags moduleSelectAll";
  gap: 0.5rem;
`

const TagChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "variant",
})(
  ({ theme, variant }) => `
  border-radius: 2rem;
  margin: 0.05rem 0.2rem;
  font-weight: bold;
  border-width: 0.1rem;
  border-style: solid;
  text-transform: uppercase;

  border-color: ${theme.palette.primary.main};
  color: ${
    variant === "filled"
      ? theme.palette.primary.contrastText
      : theme.palette.primary.main
  };
  background-color: ${
    variant === "filled"
      ? theme.palette.primary.main
      : theme.palette.background.default
  };

  &:hover {
    border-radius: 2rem;
    margin: 0.05rem 0.2rem;
    border-width: 0.1rem;
    border-style: solid;
    background-color: ${theme.palette.primary.light};
    color: ${theme.palette.primary.contrastText};
  }
`,
)

/*
    color: ${({ variant }) => (variant === "outlined" ? "#F5F6F7" : "#378170")};
    background-color: ${({ variant }) =>
      variant === "outlined" ? "#378170" : "#F5F6F7"};
*/

const SelectAllButton = styled(Button)(
  ({ theme, variant }) => `
  margin: 0 1rem auto auto;

  border-radius: 1rem;
  font-weight: bold;
  border-width: 0.1rem;
  border-style: solid;
  text-transform: uppercase;
  border-color: ${theme.palette.primary.main};
  color: ${
    variant === "contained"
      ? theme.palette.primary.contrastText
      : theme.palette.primary.main
  };
  background-color: ${
    variant === "contained"
      ? theme.palette.primary.main
      : theme.palette.background.default
  };

  &:hover {
    border-radius: 1rem;
    border-width: 0.1rem;
    border-style: solid;
    background-color: ${theme.palette.primary.light};
    color: ${
      variant === "contained"
        ? theme.palette.primary.main
        : theme.palette.primary.contrastText
    };
  }
`,
)

interface TagSelectButtonsProps {
  tags: Record<string, Array<TagCoreFieldsFragment>>
  activeTags: Array<TagCoreFieldsFragment>
  setActiveTags: (tags: Array<TagCoreFieldsFragment>) => void
  selectAllTags: () => void
}

const TagSelectButtons = ({
  tags,
  activeTags,
  setActiveTags,
  selectAllTags,
}: TagSelectButtonsProps) => {
  const t = useTranslator(CommonTranslations)

  const handleClick = useCallback(
    (tag: TagCoreFieldsFragment) => {
      if (activeTags.includes(tag)) {
        setActiveTags(activeTags.filter((t) => t !== tag))
      } else {
        setActiveTags([...activeTags, tag])
      }
    },
    [activeTags],
  )

  const handleSelectAllClick = useCallback(
    (category: string) => {
      if (category in tags) {
        if (tags[category].every((tag) => activeTags.includes(tag))) {
          setActiveTags(
            activeTags.filter((tag) => !tags[category].includes(tag)),
          )
        } else {
          const activeTagsWithAll = [...activeTags, ...tags[category]]
          setActiveTags([...new Set(activeTagsWithAll)])
        }
      } else {
        selectAllTags()
      }
    },
    [activeTags],
  )

  return (
    <TagsContainer>
      {Object.keys(tags).map((category) => (
        <React.Fragment key={category}>
          <div style={{ gridArea: `${category}Tags` }}>
            {tags[category].map((tag) => (
              <TagChip
                id={`tag-${category}-${tag.id}`}
                key={tag.id}
                variant={activeTags.includes(tag) ? "filled" : "outlined"}
                onClick={() => handleClick(tag)}
                size="small"
                label={tag.name}
              />
            ))}
          </div>
          <div style={{ gridArea: `${category}SelectAll` }}>
            <SelectAllButton
              id={`select-all-${category}-tags`}
              variant={
                tags[category].every((tag) => activeTags.includes(tag))
                  ? "contained"
                  : "outlined"
              }
              onClick={() => handleSelectAllClick(category)}
              size="small"
            >
              {t("selectAll")}
            </SelectAllButton>
          </div>
        </React.Fragment>
      ))}
    </TagsContainer>
  )
}

export default TagSelectButtons

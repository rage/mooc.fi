import React, { useCallback } from "react"

import { Button, Chip, Skeleton } from "@mui/material"
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

const TagListContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "category",
})<{ category?: string }>(({ category }) =>
  category ? `grid-area: ${category}Tags;` : "",
)

const SelectAllContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "category",
})<{ category?: string }>(({ category }) =>
  category ? `grid-area: ${category}SelectAll;` : "",
)

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

const TagSkeletonContainer = styled("div")`
  display: grid;
  grid-template-areas:
    "skeleton1Tags skeleton1SelectAll"
    "skeleton2Tags skeleton2SelectAll"
    "skeleton3Tags skeleton3SelectAll";
  gap: 0.5rem;
`

const TagsSkeleton = ({
  category,
  widths,
}: {
  category: string
  widths: Array<number>
}) => (
  <>
    <TagListContainer
      category={category}
      style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
    >
      {widths.map((width) => (
        <Skeleton
          width={width}
          height={24}
          key={`skeleton-${category}-${width}`}
        />
      ))}
    </TagListContainer>
    <SelectAllContainer category={category}>
      <Skeleton width={100} height={31} />
    </SelectAllContainer>
  </>
)

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
  loading?: boolean
  tags: Record<string, Array<TagCoreFieldsFragment>>
  activeTags: Array<TagCoreFieldsFragment>
  setActiveTags: (
    tags:
      | Array<TagCoreFieldsFragment>
      | ((tags: Array<TagCoreFieldsFragment>) => Array<TagCoreFieldsFragment>),
  ) => void
  selectAllTags: () => void
}

const TagSelectButtons = ({
  tags,
  activeTags,
  setActiveTags,
  selectAllTags,
  loading,
}: TagSelectButtonsProps) => {
  const t = useTranslator(CommonTranslations)

  const handleClick = useCallback(
    (tag: TagCoreFieldsFragment) => () => {
      if (activeTags.includes(tag)) {
        setActiveTags(activeTags.filter((t) => t !== tag))
      } else {
        setActiveTags([...activeTags, tag])
      }
    },
    [activeTags],
  )

  const handleSelectAllClick = useCallback(
    (category: string) => () => {
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

  if (loading) {
    return (
      <TagSkeletonContainer>
        <TagsSkeleton widths={[70, 75, 80, 120]} category="skeleton1" />
        <TagsSkeleton widths={[100, 70, 60]} category="skeleton2" />
        <TagsSkeleton widths={[160, 100, 60]} category="skeleton3" />
      </TagSkeletonContainer>
    )
  }

  return (
    <TagsContainer>
      {Object.keys(tags).map((category) => (
        <React.Fragment key={category}>
          <TagListContainer category={category}>
            {tags[category].map((tag) => (
              <TagChip
                id={`tag-${category}-${tag.id}`}
                key={tag.id}
                variant={activeTags.includes(tag) ? "filled" : "outlined"}
                onClick={handleClick(tag)}
                size="small"
                label={tag.name}
              />
            ))}
          </TagListContainer>
          <SelectAllContainer category={category}>
            <SelectAllButton
              id={`select-all-${category}-tags`}
              variant={
                tags[category].every((tag) => activeTags.includes(tag))
                  ? "contained"
                  : "outlined"
              }
              onClick={handleSelectAllClick(category)}
              size="small"
            >
              {t("selectAll")}
            </SelectAllButton>
          </SelectAllContainer>
        </React.Fragment>
      ))}
    </TagsContainer>
  )
}

export default TagSelectButtons

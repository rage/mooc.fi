import React, { useCallback } from "react"

import { Chip, Skeleton, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import Button from "../Common/Button"
import { useTranslator } from "/hooks/useTranslator"
import { fontSize } from "/src/theme/util"
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

const Title = styled(Typography)(
  ({ theme }) => `
  ${fontSize(12, 16)}
  color: ${theme.palette.common.grayscale.dark};
  font-weight: normal;
  letter-spacing: -0.2px;
  margin: 8px 4px 8px 0;
  padding: 4px 0;

  ${theme.breakpoints.up("sm")} {
    ${fontSize(14, 16)};
    letter-spacing: -0.3px;
    padding: 6px 0;
  }
`,
) as typeof Typography

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
    <Skeleton
      sx={{ gridArea: `${category}SelectAll` }}
      width={100}
      height={31}
    />
  </>
)

const SelectAllButton = styled(Button)(
  ({ theme }) => `
  max-height: 2.5rem;
  font-weight: 700 !important;
  background-color: transparent !important;
  color: ${theme.palette.common.brand.main} !important;
  border: 2px solid ${theme.palette.common.brand.main} !important;
  &:hover {
    color: ${theme.palette.common.brand.active} !important;
    border: 2px solid ${theme.palette.common.brand.active} !important};
  }
  &[aria-selected="true"] {
    background-color: ${theme.palette.common.brand.main} !important;
    color: ${theme.palette.common.grayscale.white} !important;
    border: 2px solid transparent;
    &:hover {
      background-color: ${theme.palette.common.brand.active} !important;
      color: ${theme.palette.common.grayscale.white} !important;
      border: 2px solid transparent;
    }
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
            <Title>{t(category)}</Title>
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
          <SelectAllButton
            id={`select-all-${category}-tags`}
            aria-selected={
              tags[category].every((tag) => activeTags.includes(tag))
                ? "true"
                : undefined
            }
            variant="text"
            sx={{ gridArea: `${category}SelectAll` }}
            onClick={handleSelectAllClick(category)}
          >
            {t("selectAll")}
          </SelectAllButton>
        </React.Fragment>
      ))}
    </TagsContainer>
  )
}

export default TagSelectButtons

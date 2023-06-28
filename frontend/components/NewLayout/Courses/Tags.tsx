import React from "react"

import { PropsOf } from "@emotion/react"
import CircleIcon from "@mui/icons-material/Circle"
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined"
import { Chip } from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  allowedLanguages,
  sortByDifficulty,
  sortByLanguage,
  tagColorSchemes,
} from "./common"
import { InfoTooltip } from "/components/Tooltip"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
import { notEmptyOrEmptyString } from "/util/guards"

import {
  NewCourseFieldsFragment,
  TagCoreFieldsFragment,
} from "/graphql/generated"

const Tag = styled(Chip)`
  border-radius: 2rem;
  background-color: ${tagColorSchemes["other"]} !important;
  border-color: ${tagColorSchemes["other"]} !important;
  color: #fff !important;
  font-weight: bold;
  text-transform: uppercase;
`

const TagsContainer = styled("div")`
  display: flex;
  flex-shrink: 1;
  margin-bottom: auto;
  padding: 0;
  gap: 0.2rem;
  justify-content: flex-end;
`

export const LanguageTagsContainer = styled(TagsContainer)`
  display: flex;
  margin: 0 0 auto;
  flex-shrink: 1;
`

export const DifficultyTagsContainer = styled(TagsContainer)`
  display: flex;
  margin: 0 0 auto;
  flex-shrink: 1;
  justify-content: flex-start;
`

export const ModuleTagsContainer = styled(TagsContainer)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-flow: wrap;
  margin: 0 auto;
  flex-grow: 2;
  flex-shrink: 0;
  flex-basis: 50%;
`

const LanguageTagBase = styled(Tag)`
  background-color: ${tagColorSchemes["language"]} !important;
  border-color: ${tagColorSchemes["language"]} !important;
  border-radius: 3rem;
  min-width: 40px;
  max-height: 40px;

  .MuiChip-label {
    text-transform: uppercase;
  }
`

const TagWithTooltip = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
`

export const LanguageTag = ({
  otherLanguages,
  ...props
}: PropsOf<typeof Tag> & { otherLanguages?: Array<TagCoreFieldsFragment> }) => {
  const t = useTranslator(CommonTranslations)

  if (!otherLanguages) {
    return <LanguageTagBase {...props} />
  }

  return (
    <LanguageTagBase
      {...props}
      label={
        <TagWithTooltip>
          {props.label}
          <InfoTooltip
            label={t("courseOtherLanguages")}
            labelProps={{ variant: "h6", component: "h3" }}
            title={otherLanguages
              .map((language) => language.name)
              .filter(notEmptyOrEmptyString)
              .sort((a, b) => a.localeCompare(b))
              .join(", ")}
            outlined={false}
            IconProps={{
              hoverColor: "#eee",
              iconColor: "white",
              fontSize: "small",
            }}
          />
        </TagWithTooltip>
      }
    />
  )
}

interface TagsProps {
  course: NewCourseFieldsFragment
  abbreviated?: boolean
}

const tagHasName = (
  tag: TagCoreFieldsFragment,
): tag is TagCoreFieldsFragment & { name: string } =>
  typeof tag.name === "string"

export const LanguageTags = React.memo(({ course, abbreviated }: TagsProps) => {
  const langTags = course.tags?.filter((tag) => tag.types?.includes("language"))
  const allowed = langTags
    ?.filter((tag) => allowedLanguages.includes(tag.id))
    .sort(sortByLanguage)
  const otherLanguages = langTags?.filter(
    (tag) => !allowedLanguages.includes(tag.id),
  )

  return (
    <>
      {allowed.map((tag) => (
        <LanguageTag
          key={tag.id}
          size="small"
          variant="filled"
          label={abbreviated && tag.abbreviation ? tag.abbreviation : tag.name}
          {...(tag.id === "other_language" && {
            otherLanguages,
          })}
        />
      ))}
    </>
  )
})

const DifficultyTagBase = styled(Tag)`
  background-color: ${tagColorSchemes["difficulty"]} !important;
  border-color: ${tagColorSchemes["difficulty"]} !important;
`

const DifficultyTagContainer = styled("div")`
  display: flex;
  flex-direction: column;
  text-align: center;
`

export const DifficultyTag = ({
  difficulty,
  ...props
}: PropsOf<typeof Tag> & { difficulty: string }) => (
  <DifficultyTagContainer>
    <DifficultyTagBase {...props}></DifficultyTagBase>
    <CircleContainer>
      <StyledCircleIcon />
      {difficulty !== "beginner" ? (
        <StyledCircleIcon />
      ) : (
        <StyledCircleOutlinedIcon />
      )}
      {difficulty === "advanced" ? (
        <StyledCircleIcon />
      ) : (
        <StyledCircleOutlinedIcon />
      )}
    </CircleContainer>
  </DifficultyTagContainer>
)

export const DifficultyTags = React.memo(
  ({ course, abbreviated }: TagsProps) => (
    <>
      {course.tags
        ?.filter((t) => t.types?.includes("difficulty"))
        .filter(tagHasName)
        .sort(sortByDifficulty)
        .map((tag) => (
          <DifficultyTag
            key={tag.id}
            size="small"
            variant="filled"
            label={
              abbreviated && tag.abbreviation ? tag.abbreviation : tag.name
            }
            difficulty={tag.id}
          />
        ))}
    </>
  ),
)

export const ModuleTag = styled(Tag)`
  background-color: ${tagColorSchemes["module"]} !important;
  border-color: ${tagColorSchemes["module"]} !important;
`

export const ModuleTags = React.memo(({ course, abbreviated }: TagsProps) => (
  <>
    {course.tags
      ?.filter((tag) => tag.types?.includes("module"))
      .filter(tagHasName)
      .sort((a, b) => {
        if (abbreviated) {
          return (a.abbreviation ?? a.name).localeCompare(
            b.abbreviation ?? b.name,
          )
        }
        return a.name.localeCompare(b.name)
      })
      .map((tag) => (
        <ModuleTag
          key={tag.id}
          size="small"
          variant="filled"
          label={abbreviated && tag.abbreviation ? tag.abbreviation : tag.name}
        />
      ))}
  </>
))

const CircleContainer = styled("div")(
  ({ theme }) => `
  ${theme.breakpoints.down("sm")} {
    display: none;
  }
`,
)

const StyledCircleIcon = styled(CircleIcon)`
  max-width: 15px;
`

const StyledCircleOutlinedIcon = styled(CircleOutlinedIcon)`
  max-width: 15px;
`

import React from "react"

import { PropsOf } from "@emotion/react"
// import CircleIcon from "@mui/icons-material/Circle"
// import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined"
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
import { fontSize } from "/src/theme/util"
import CommonTranslations from "/translations/common"
import { isDefinedAndNotEmpty } from "/util/guards"

import {
  NewCourseFieldsFragment,
  TagCoreFieldsFragment,
} from "/graphql/generated"

const Tag = styled(Chip)(
  ({ theme }) => `
  display: inline-block;
  color: ${theme.palette.common.grayscale.white} !important;
  ${fontSize(12, 14)}
  padding: 4px 6px;
  font-weight: 700;
  letter-spacing: -0.1px;
  background-color: ${tagColorSchemes["other"]} !important;
  border-color: ${tagColorSchemes["other"]} !important;
  text-transform: uppercase;
  border-radius: 0;
`,
)

const LanguageTagBase = styled(Tag)`
  background-color: ${tagColorSchemes["language"]} !important;
  border-color: ${tagColorSchemes["language"]} !important;
  min-width: 40px;
  max-height: 40px;

  .MuiChip-label {
    text-transform: uppercase;
    display: flex;

    svg {
      margin-left: 0.5rem;
      font-size: 1rem;
    }
  }
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
        <>
          {props.label}
          <InfoTooltip
            label={t("courseOtherLanguages")}
            labelProps={{ variant: "h6", component: "h3" }}
            title={otherLanguages
              .map((language) => language.name)
              .filter(isDefinedAndNotEmpty)
              .sort((a, b) => a.localeCompare(b))
              .join(", ")}
            outlined={false}
            IconProps={{
              hoverColor: "#eee",
              iconColor: "white",
              fontSize: "small",
            }}
          />
        </>
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
    {/*<CircleContainer>
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
      </CircleContainer>*/}
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

/*const CircleContainer = styled("div")(
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
*/

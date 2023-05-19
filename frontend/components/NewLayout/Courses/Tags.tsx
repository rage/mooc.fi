import { PropsOf } from "@emotion/react"
import CircleIcon from "@mui/icons-material/Circle"
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined"
import { Chip } from "@mui/material"
import { styled } from "@mui/material/styles"

import { colorSchemes } from "./common"
import { InfoTooltip } from "/components/Tooltip"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

import { TagCoreFieldsFragment } from "/graphql/generated"

const Tag = styled(Chip)`
  border-radius: 2rem;
  background-color: ${colorSchemes["other"]} !important;
  border-color: ${colorSchemes["other"]} !important;
  color: #fff !important;
  font-weight: bold;
  text-transform: uppercase;
`

const Tags = styled("div")`
  display: flex;
  flex-shrink: 1;
  margin-bottom: auto;
  padding: 0;
  gap: 0.2rem;
  justify-content: flex-end;
`

export const LanguageTags = styled(Tags)`
  display: flex;
  margin: 0 0 auto;
  flex-shrink: 1;
`

export const DifficultyTags = styled(Tags)`
  display: flex;
  margin: 0 0 auto;
  flex-shrink: 1;
  justify-content: flex-start;
`

export const ModuleTags = styled(Tags)`
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
  background-color: ${colorSchemes["language"]} !important;
  border-color: ${colorSchemes["language"]} !important;
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
              .sort()
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

const DifficultyTagBase = styled(Tag)`
  background-color: ${colorSchemes["difficulty"]} !important;
  border-color: ${colorSchemes["difficulty"]} !important;
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

export const ModuleTag = styled(Tag)`
  background-color: ${colorSchemes["module"]} !important;
  border-color: ${colorSchemes["module"]} !important;
`

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

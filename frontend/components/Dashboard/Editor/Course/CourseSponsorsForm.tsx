import React, { useCallback, useMemo } from "react"

import { useController, useFormContext } from "react-hook-form"
import { sortBy } from "remeda"

import { ArrowDropDown, ArrowDropUp, QuestionMark } from "@mui/icons-material"
import {
  Autocomplete,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderInputParams,
  Chip,
  IconButton,
  List,
  ListItem,
  TextField,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import { FormFieldGroup } from "../Common"
import { useCourseEditorData } from "./CourseEditorDataContext"
import { CourseFormValues, SponsorFormValue } from "./types"
import BorderedSection from "/components/BorderedSection"
import ContainedImage from "/components/Images/ContainedImage"
import { useAnchor } from "/hooks/useAnchors"
import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"

const hasName = (sponsor: SponsorFormValue) => !!sponsor.name

const SponsorOption = styled("li")`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Placeholder = styled("div")`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #ccc;
`

const SponsorSmallLogoContainer = styled("div")`
  display: flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-right: 0.5rem;
`

const StyledBorderedSection = styled(BorderedSection)`
  margin: 1rem 0;

  .header {
    .headerTitle {
      font-weight: 400;
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.7rem;
    }

    .headerBorderBefore {
      width: 0.5rem;
    }
  }
`
function CourseSponsorsForm() {
  const { sponsorOptions } = useCourseEditorData()
  const t = useTranslator(CoursesTranslations)
  const { setValue, getValues } = useFormContext()
  const { field } = useController<CourseFormValues, "sponsors">({
    name: "sponsors",
  })
  const anchor = useAnchor("sponsors")

  const options = useMemo(
    () => sortBy(sponsorOptions ?? [], (sponsor) => sponsor.name.toLowerCase()),
    [sponsorOptions],
  )

  const onChange = useEventCallback(
    (_: any, newValue: Array<SponsorFormValue>) => {
      console.log("newValue", newValue)
      setValue("sponsors", newValue, { shouldDirty: true })
    },
  )

  const onDelete = useCallback(
    (index: number) => () =>
      setValue(
        "sponsors",
        getValues("sponsors").filter(
          (_: any, _index: number) => index !== _index,
        ),
        { shouldDirty: true },
      ),
    [setValue, getValues],
  )

  const renderSponsors = useCallback(
    (
      sponsors: Array<SponsorFormValue>,
      getTagProps: AutocompleteRenderGetTagProps,
    ) => {
      return sponsors.map((sponsor, index) => {
        if (!hasName(sponsor)) {
          return null
        }
        return (
          <Chip
            {...getTagProps({ index })}
            variant="outlined"
            label={sponsor.name ?? ""}
            onDelete={onDelete(index)}
          />
        )
      })
    },
    [setValue, getValues],
  )

  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <TextField
        {...params}
        inputRef={field.ref}
        variant="outlined"
        label={t("courseSponsors")}
      />
    ),
    [t, field],
  )

  const renderOption = useCallback(
    (props: React.HTMLAttributes<HTMLLIElement>, option: SponsorFormValue) => {
      const logos = option.images?.filter((image) => image.type === "logo")

      return (
        <SponsorOption {...props}>
          <SponsorSmallLogoContainer>
            {logos.length > 0 ? (
              <ContainedImage
                src={
                  /^https?:\/\//.test(logos[0].uri)
                    ? logos[0].uri
                    : require(`/public/images/new/sponsors/${logos[0].uri}`)
                }
                alt={option.name}
                fill
              />
            ) : (
              <Placeholder>
                <QuestionMark titleAccess={t("noSponsorLogo")} />
              </Placeholder>
            )}
          </SponsorSmallLogoContainer>
          {option.name}
        </SponsorOption>
      )
    },
    [t, field],
  )

  return (
    <FormFieldGroup>
      <Autocomplete
        multiple
        ref={anchor.ref}
        value={field.value}
        options={options}
        onChange={onChange}
        renderTags={renderSponsors}
        renderInput={renderInput}
        renderOption={renderOption}
        getOptionLabel={(option) => option.name ?? ""}
        isOptionEqualToValue={(option, value) => option._id === value._id}
      />
      {field.value.length > 0 && (
        <SelectOrderList
          value={field.value}
          onChange={onChange}
          renderOption={renderOption}
        />
      )}
    </FormFieldGroup>
  )
}

interface SelectOrderListProps {
  value: SponsorFormValue[]
  onChange: (_: any, value: Array<SponsorFormValue>) => void
  renderOption: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: SponsorFormValue,
  ) => React.JSX.Element
}

const reorderItems = (items: SponsorFormValue[]) =>
  [...items].map((value, order) => ({ ...value, order }))

const SelectOrderList = ({
  value,
  onChange,
  renderOption,
}: SelectOrderListProps) => {
  const t = useTranslator(CoursesTranslations)

  const orderedValue = useMemo(
    () =>
      sortBy(
        value,
        (value) => value.order,
        (value) => value.name.toLocaleLowerCase(),
      ),
    [value],
  )
  const onMoveItemUp = useCallback(
    (index: number) => () => {
      const newValue = [...orderedValue]
      const item = newValue.splice(index, 1)[0]
      newValue.splice(index - 1, 0, item)
      onChange(null, reorderItems(newValue))
    },
    [orderedValue],
  )
  const onMoveItemDown = useCallback(
    (index: number) => () => {
      const newValue = [...orderedValue]
      const item = newValue.splice(index, 1)[0]
      newValue.splice(index + 1, 0, item)
      onChange(null, reorderItems(newValue))
    },
    [orderedValue],
  )

  return (
    <StyledBorderedSection title={t("sponsorOrder")}>
      <List component="nav">
        {orderedValue.map((item, index) => (
          <ListItem
            key={item._id}
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  title={t("moveSponsorUp")}
                  onClick={onMoveItemUp(index)}
                  disabled={index === 0}
                >
                  <ArrowDropUp />
                </IconButton>
                <IconButton
                  edge="end"
                  title={t("moveSponsorDown")}
                  onClick={onMoveItemDown(index)}
                  disabled={index === value.length - 1}
                >
                  <ArrowDropDown />
                </IconButton>
              </>
            }
          >
            {renderOption({}, item)}
          </ListItem>
        ))}
      </List>
    </StyledBorderedSection>
  )
}
export default CourseSponsorsForm

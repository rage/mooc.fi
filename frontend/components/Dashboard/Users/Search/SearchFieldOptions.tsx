import { useCallback, useContext, useRef } from "react"

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import UserSearchContext from "/contexts/UserSearchContext"
import { useTranslator } from "/hooks/useTranslator"
import UsersTranslations from "/translations/users"

import { UserSearchField } from "/graphql/generated"

const OptionFormControl = styled(FormControl)`
  max-width: 50%;
` as typeof FormControl

const OptionFormGroup = styled(FormGroup)`
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.23);
  padding: 0.5rem;
  border-radius: 4px;

  :last-child {
    margin-left: auto;
  }
` as typeof FormGroup

const OptionFormControlLabel = styled(FormControlLabel)``

export const SearchFieldOptions = () => {
  const t = useTranslator(UsersTranslations)
  const { totalMeta, fields, setFields } = useContext(UserSearchContext)
  const prevFields = useRef(fields)

  const isIndeterminate =
    (fields ?? []).length > 0 &&
    (fields ?? []).length < Object.keys(UserSearchField).length
  const allChecked =
    (fields ?? []).length === Object.keys(UserSearchField).length

  const onToggleAll = useCallback(() => {
    prevFields.current = fields
    setFields(
      allChecked || isIndeterminate
        ? []
        : (Object.keys(UserSearchField) as Array<UserSearchField>),
    )
  }, [allChecked, isIndeterminate, totalMeta])

  const isSelected = useCallback(
    (field: UserSearchField) => fields?.includes(field),
    [fields],
  )

  const onToggleField = useCallback(
    (field: UserSearchField) => () => {
      prevFields.current = fields
      setFields((prev) => {
        if (!prev) {
          return [field]
        }
        if (prev.includes(field)) {
          return prev.filter((f) => f !== field)
        }
        return [...prev, field]
      })
    },
    [fields],
  )

  return (
    <OptionFormControl component="fieldset" size="small" margin="dense">
      <OptionFormGroup row>
        {(Object.keys(UserSearchField) as Array<UserSearchField>).map(
          (field) => (
            <OptionFormControlLabel
              key={field}
              slotProps={{
                typography: {
                  variant: "caption",
                },
              }}
              control={
                <Checkbox
                  checked={isSelected(field)}
                  onChange={onToggleField(field)}
                  size="small"
                />
              }
              label={t(field as any)}
            />
          ),
        )}
        <OptionFormControlLabel
          key="all"
          slotProps={{
            typography: {
              variant: "caption",
            },
          }}
          control={
            <Checkbox
              indeterminate={isIndeterminate}
              checked={allChecked}
              onChange={onToggleAll}
              size="small"
            />
          }
          label={allChecked || isIndeterminate ? t("clearAll") : t("selectAll")}
        />
      </OptionFormGroup>
    </OptionFormControl>
  )
}

import React, { useCallback } from "react"

import { FieldPath, useController, useFormContext } from "react-hook-form"

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  List,
  ListItem,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { ControlledFieldProps } from "."
import { FormValues } from "../../types"
import { useAnchor } from "/components/Dashboard/Editor/EditorContext"

import { StudyModuleDetailedFieldsFragment } from "/graphql/generated"

const ModuleList = styled(List)`
  padding: 0px;
  max-height: 400px;
  overflow: auto;
`
const ModuleListItem = styled(ListItem)`
  padding: 0px;
`

interface ControlledModuleListProps<
  TFieldValues extends FormValues = FormValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControlledFieldProps<TFieldValues, TName> {
  modules?: StudyModuleDetailedFieldsFragment[]
}

function ControlledModuleListImpl<
  TFieldValues extends FormValues = FormValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControlledModuleListProps<TFieldValues, TName>) {
  const { modules, label, required, name } = props
  const anchor = useAnchor(name)
  const { setValue } = useFormContext<TFieldValues>()
  const { field } = useController<TFieldValues>({
    name,
    rules: { required },
  })

  const onChange = useCallback(
    (id: string) => (_: any, checked: boolean) => {
      if (!checked) {
        return setValue(
          name,
          field.value.filter((value: string) => value !== id),
        )
      }
      if (!field.value.includes(id)) {
        return setValue(name, [...field.value, id] as typeof field.value)
      }
    },
    [field, setValue, name],
  )

  return (
    <FormControl component="fieldset">
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <FormGroup>
        <ModuleList
          ref={(el) => {
            field.ref(el)
            anchor.ref(el)
          }}
        >
          {modules?.map((studyModule) => (
            <ModuleListItem key={studyModule.id}>
              <FormControlLabel
                onChange={onChange(studyModule.id)}
                value={studyModule.id}
                checked={field.value.includes(studyModule.id)}
                control={<Checkbox />}
                label={studyModule.name}
              />
            </ModuleListItem>
          ))}{" "}
        </ModuleList>
      </FormGroup>
    </FormControl>
  )
}

export const ControlledModuleList = React.memo(
  ControlledModuleListImpl,
) as typeof ControlledModuleListImpl

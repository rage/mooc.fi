import { useCallback } from "react"

import { FieldPath, useController } from "react-hook-form"

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

export function ControlledModuleList<
  TFieldValues extends FormValues = FormValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControlledModuleListProps<TFieldValues, TName>) {
  const { modules, label, required } = props
  const name = props.name
  const { field } = useController<TFieldValues>({
    name,
    rules: { required },
  })

  const onChange = useCallback(
    (id: string) => (_: any, checked: boolean) => {
      if (!checked) {
        return field.onChange(
          field.value.filter((value: string) => value !== id),
        )
      }
      if (!field.value.includes(id)) {
        return field.onChange([...field.value, id])
      }
    },
    [field],
  )

  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <FormGroup>
        <ModuleList>
          {modules?.map((studyModule, index) => (
            <ModuleListItem key={studyModule.id}>
              <FormControlLabel
                onChange={onChange(studyModule.id)}
                value={studyModule.id}
                checked={field.value.includes(studyModule.id)}
                control={
                  <Checkbox id={studyModule.id} name={field.name[index]} />
                }
                label={studyModule.name}
              />
            </ModuleListItem>
          ))}{" "}
        </ModuleList>
      </FormGroup>
    </FormControl>
  )
}

import { useCallback } from "react"

import {
  ControllerRenderProps,
  FieldPath,
  PathValue,
  useController,
  useFormContext,
} from "react-hook-form"

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

import { FormValues } from "../../types"
import {
  ControlledFieldProps,
  FieldController,
} from "."

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
  const { modules, label } = props
  const name = props.name
  const { setValue, getValues } = useFormContext<TFieldValues>()
  const { field } = useController<TFieldValues>({
    name,
  })
  const setCourseModule = useCallback(
    (event: React.SyntheticEvent<Element, Event>, checked: boolean) =>
      setValue(
        name,
        {
          ...getValues(name),
          [(event.target as HTMLInputElement).id]: checked,
        } as PathValue<TFieldValues, TName>,
        { shouldDirty: true },
      ),
    [],
  )

  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <FormGroup>
        <ModuleList>
          {modules?.map((studyModule) => (
            <ModuleListItem key={studyModule.id}>
              <FormControlLabel
                key={`module-${studyModule.id}`}
                checked={field.value[studyModule.id] ?? false}
                onChange={setCourseModule}
                onBlur={field.onBlur}
                control={<Checkbox id={studyModule.id} />}
                label={studyModule.name}
              />
            </ModuleListItem>
          ))}{" "}
        </ModuleList>
      </FormGroup>
    </FormControl>
  )
}

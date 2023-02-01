import { useCallback } from "react"

import {
  ControllerRenderProps,
  PathValue,
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
} from "/components/Dashboard/Editor2/Common/Fields"

import { StudyModuleDetailedFieldsFragment } from "/graphql/generated"

const ModuleList = styled(List)`
  padding: 0px;
  max-height: 400px;
  overflow: auto;
`
const ModuleListItem = styled(ListItem)`
  padding: 0px;
`

interface ControlledModuleListProps<T extends FormValues>
  extends ControlledFieldProps<T> {
  modules?: StudyModuleDetailedFieldsFragment[]
}

export function ControlledModuleList<T extends FormValues>(
  props: ControlledModuleListProps<T>,
) {
  const { modules, label } = props
  const name = props.name
  const { setValue, getValues } = useFormContext<T>()

  const setCourseModule = useCallback(
    (event: React.SyntheticEvent<Element, Event>, checked: boolean) =>
      setValue(
        name,
        {
          ...getValues(name),
          [(event.target as HTMLInputElement).id]: checked,
        } as PathValue<T, typeof name>,
        { shouldDirty: true },
      ),
    [],
  )

  const renderModuleList = useCallback(
    ({ value }: ControllerRenderProps<T>) => (
      <>
        {modules?.map((studyModule) => (
          <ModuleListItem key={studyModule.id}>
            <FormControlLabel
              key={`module-${studyModule.id}`}
              checked={
                (value as Record<string, boolean>)[studyModule.id] ?? false
              }
              onChange={setCourseModule}
              control={<Checkbox id={studyModule.id} />}
              label={studyModule.name}
            />
          </ModuleListItem>
        ))}
      </>
    ),
    [modules, setCourseModule],
  )

  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <FormGroup>
        <ModuleList>
          <FieldController
            name={name}
            label={label}
            renderComponent={renderModuleList}
          />
        </ModuleList>
      </FormGroup>
    </FormControl>
  )
}

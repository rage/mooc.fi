import { useCallback } from "react"
import {
  useFormContext,
  Path,
  PathValue,
  UnpackNestedValue,
} from "react-hook-form"
import { EnumeratingAnchor } from "/components/Dashboard/Editor2/Common"
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
} from "@material-ui/core"
import { CourseEditorStudyModules_study_modules } from "/static/types/generated/CourseEditorStudyModules"
import styled from "@emotion/styled"
import {
  ControlledFieldProps,
  FieldController,
} from "/components/Dashboard/Editor2/Common/Fields"

const ModuleList = styled(List)`
  padding: 0px;
  max-height: 400px;
  overflow: auto;
`
const ModuleListItem = styled(ListItem)<any>`
  padding: 0px;
`

interface ControlledModuleListProps extends ControlledFieldProps {
  modules?: CourseEditorStudyModules_study_modules[]
}

export function ControlledModuleList<T>(props: ControlledModuleListProps) {
  const { modules, label } = props
  const name = props.name as Path<T>
  const { setValue, getValues } = useFormContext<T>()

  const setCourseModule = useCallback(
    (event: React.SyntheticEvent<Element, Event>, checked: boolean) =>
      setValue(
        name,
        {
          ...getValues(name),
          [(event.target as HTMLInputElement).id]: checked,
        } as UnpackNestedValue<PathValue<T, Path<T>>>,
        { shouldDirty: true },
      ),
    [],
  )

  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <FormGroup>
        <ModuleList>
          <EnumeratingAnchor id={name} />
          <FieldController
            name={name}
            label={label}
            renderComponent={({ value }) => (
              <>
                {modules?.map((module) => (
                  <ModuleListItem key={module.id}>
                    <FormControlLabel
                      key={`module-${module.id}`}
                      checked={
                        (value as Record<string, boolean>)[module.id] ?? false
                      }
                      onChange={setCourseModule}
                      control={<Checkbox id={module.id} />}
                      label={module.name}
                    />
                  </ModuleListItem>
                ))}
              </>
            )}
          />
        </ModuleList>
      </FormGroup>
    </FormControl>
  )
}

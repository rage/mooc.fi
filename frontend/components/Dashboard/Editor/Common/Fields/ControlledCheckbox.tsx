import React from "react"

import { FieldValues, useController } from "react-hook-form"

import HelpIcon from "@mui/icons-material/Help"
import { Checkbox, FormControlLabel, Tooltip } from "@mui/material"
import { styled } from "@mui/material/styles"

import { ControlledFieldProps } from "."
import { useAnchor } from "/components/Dashboard/Editor/EditorContext"
import useWhyDidYouUpdate from "/lib/why-did-you-update"

const AlignedTooltip = styled(Tooltip)`
  vertical-align: middle;
`
interface ControlledCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
> extends ControlledFieldProps<TFieldValues> {
  onChange?: (e: React.SyntheticEvent<Element, Event>, checked: boolean) => void
}

function ControlledCheckboxImpl<TFieldValues extends FieldValues = FieldValues>(
  props: ControlledCheckboxProps<TFieldValues>,
) {
  const { name, label, tip, required, onChange } = props
  useWhyDidYouUpdate(`ControlledCheckbox ${name}`, props)
  const anchor = useAnchor(name)
  const { field } = useController({
    name,
    rules: { required },
  })
  const _onChange = onChange ?? field.onChange

  return (
    <div>
      <FormControlLabel
        key={name}
        label={label}
        value={field.value}
        checked={Boolean(field.value)}
        onChange={_onChange}
        control={<Checkbox />}
        inputRef={(el) => {
          field.ref(el)
          anchor.ref(el)
        }}
      />
      {tip ? (
        <AlignedTooltip title={tip}>
          <HelpIcon />
        </AlignedTooltip>
      ) : null}
    </div>
  )
}

export const ControlledCheckbox = React.memo(
  ControlledCheckboxImpl,
) as typeof ControlledCheckboxImpl

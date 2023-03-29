import React, { useCallback } from "react"

import { FieldValues, useController } from "react-hook-form"

import { Checkbox, FormControlLabel } from "@mui/material"
import { styled } from "@mui/material/styles"

import { ControlledFieldProps } from "."
import { InfoTooltipWithLabel } from "/components/Tooltip"
import { useAnchor } from "/hooks/useAnchors"

const AlignedSpan = styled("span")`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
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
  const anchor = useAnchor(name)
  const { field } = useController({
    name,
    rules: { required },
  })
  const _onChange = onChange ?? field.onChange

  const Label = useCallback(
    () => (
      <AlignedSpan>
        {label}
        {tip && <InfoTooltipWithLabel label={label} title={tip} />}
      </AlignedSpan>
    ),
    [label, tip],
  )

  return (
    <div>
      <FormControlLabel
        key={name}
        label={<Label />}
        value={field.value}
        checked={Boolean(field.value)}
        onChange={_onChange}
        control={<Checkbox />}
        inputRef={(el) => {
          field.ref(el)
          anchor.ref(el)
        }}
      />
    </div>
  )
}

export const ControlledCheckbox = React.memo(
  ControlledCheckboxImpl,
) as typeof ControlledCheckboxImpl

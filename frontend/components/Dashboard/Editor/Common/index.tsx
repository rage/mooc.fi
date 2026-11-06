import React, { PropsWithChildren, useCallback, useEffect, useRef } from "react"

import {
  FieldValues,
  Message,
  MultipleFieldErrors,
  Resolver,
  UseFormReturn,
} from "react-hook-form"
import * as Yup from "yup"

import { yupResolver } from "@hookform/resolvers/yup"
import { FormGroup, FormHelperText, Typography } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { useEditorContext } from "../EditorContext"
import { FormValues } from "../types"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"

export const pulseAnimation = css`
  [data-error-pulsate="true"] {
    animation-name: pulse-color;
    animation-duration: 1s;
    animation-iteration-count: infinite;

    @keyframes pulse-color {
      0% {
        background-color: rgba(255, 255, 255, 0);
      }
      50% {
        background-color: rgba(255, 0, 0, 0.05);
      }
      100% {
        background-color: rgba(255, 255, 255, 0);
      }
    }
  }
`

export const FormSubtitle = styled(Typography)`
  padding: 20px 0px 20px 0px;
  margin-bottom: 1rem;
  font-size: 2em;
` as typeof Typography

export const FormFieldGroup = styled(FormGroup)`
  padding: 0.5rem;
  width: 90%;
  margin: 1rem auto 3rem auto;
  border-bottom: 4px dotted #98b0a9;
`

export const FormSubtitleWithMargin = styled(FormSubtitle)`
  margin-top: 3rem;
` as typeof FormSubtitle

export const AdjustingAnchorLink = styled("div")<{ id: string }>`
  display: block;
  position: relative;
  top: -120px;
  visibility: hidden;
`

export const ButtonWithWhiteText = styled(StyledButton)`
  color: white;
`

interface TabSectionProps {
  name?: string
  currentTab?: number
  tab: number
}

const TabSectionComponent = styled("section", {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive?: boolean }>`
  display: ${(props) => (props.isActive ? "block" : "none")};
`

const TabSectionImpl = (
  props: PropsWithChildren<TabSectionProps> &
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
) => {
  const { currentTab, tab, name, children, ...sectionProps } = props
  const { tab: contextTab } = useEditorContext()

  const _currentTab = contextTab ?? currentTab

  return (
    <TabSectionComponent
      role="tabpanel"
      isActive={_currentTab === tab}
      {...(name ? { id: `${name}-${tab}` } : {})}
      {...sectionProps}
    >
      {children}
    </TabSectionComponent>
  )
}

export const TabSection = React.memo(TabSectionImpl) as typeof TabSectionImpl

/** Deep-copies plain objects and arrays; other values (Luxon dates, files) are immutable or opaque. */
const copyFormValues = <V,>(value: V): V => {
  if (Array.isArray(value)) {
    return value.map(copyFormValues) as V
  }
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, copyFormValues(entry)]),
    ) as V
  }
  return value
}

/**
 * Returns a function that resets the form once the running submission ends: to the given values,
 * or to the values as they were when the submission started.
 *
 * react-hook-form leaves `isDirty` set when `reset` is called inside the submit handler. Prefer
 * the no-argument form over the handler's `values`: the resolver's cast drops keys whose value is
 * `undefined`, so the still-mounted fields would make the form dirty again.
 */
export function useResetAfterSubmit<T extends FieldValues>({
  reset,
  getValues,
  formState: { isSubmitting },
}: UseFormReturn<T>) {
  const submittedValues = useRef<T>(undefined)
  const pendingReset = useRef<{ values?: T }>(undefined)

  useEffect(() => {
    if (isSubmitting) {
      submittedValues.current = copyFormValues(getValues())
      return
    }
    if (pendingReset.current) {
      reset(pendingReset.current.values ?? submittedValues.current)
      pendingReset.current = undefined
    }
  }, [isSubmitting, reset, getValues])

  return useCallback((values?: T) => {
    pendingReset.current = { values }
  }, [])
}

export function useCustomValidationResolver<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TSchema extends Yup.ObjectSchema<TFieldValues> =
    Yup.ObjectSchema<TFieldValues>,
>(schema: TSchema): Resolver<TFieldValues, TContext> {
  return useCallback(
    (values, context, options) =>
      yupResolver(schema as Yup.ObjectSchema<any>)(
        values,
        { ...context, values },
        options,
      ),
    [schema],
  )
}

function isArray<T>(value: T[keyof T] | T[keyof T][]): value is T[keyof T][] {
  return Array.isArray(value)
}

export const testUnique = <Root extends FormValues, Child extends FormValues>(
  valueField: keyof Root,
  getter: (values: Child) => any,
  // field: keyof T
) =>
  function (this: Yup.TestContext, value?: any): boolean {
    const { context, path }: { context?: any; path?: string } = this.options

    if (!context) {
      return true
    }

    const fieldValues = context.values[valueField]

    if (!value || !isArray(fieldValues)) {
      return true // previous should have caught the empty
    }

    const currentIndexMatch = (path ?? "").match(/^.*\[(\d+)\].*$/) ?? []
    const currentIndex =
      currentIndexMatch.length > 1 ? Number(currentIndexMatch[1]) : -1
    const otherValues = fieldValues
      .filter(
        (c: Child, index: number) => getter(c) !== "" && index !== currentIndex,
      )
      .map((c: Child) => getter(c))

    return otherValues.indexOf(value) === -1
  }

interface ErrorMessageComponentProps {
  message: Message
  messages?: MultipleFieldErrors
}

const ErrorMessageText = styled(FormHelperText)`
  color: #f44336;
  margin-top: -1rem;
  margin-bottom: 0.5rem;
`

export const ErrorMessageComponent = ({
  message,
}: ErrorMessageComponentProps) => <ErrorMessageText>{message}</ErrorMessageText>

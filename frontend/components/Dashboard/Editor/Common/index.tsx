import React, { PropsWithChildren, useCallback } from "react"

import {
  FieldValues,
  Message,
  MultipleFieldErrors,
  Resolver,
} from "react-hook-form"
import { equals } from "remeda"
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

// would otherwise render all tabsections again a bit too often
export const TabSection = React.memo(TabSectionImpl, (prevProps, nextProps) => {
  return equals(prevProps, nextProps)
}) as typeof TabSectionImpl

export function useCustomValidationResolver<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TSchema extends Yup.ObjectSchema<TFieldValues> = Yup.ObjectSchema<TFieldValues>,
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

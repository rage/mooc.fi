import { yupResolver } from "@hookform/resolvers/yup"
import { Typography } from "@material-ui/core"
import { omit } from "lodash"
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react"
import styled from "@emotion/styled"
import { useAnchorContext } from "/contexes/AnchorContext"
import * as Yup from "yup"
import { FormValues } from "/components/Dashboard/Editor2/types"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"

export const FormSubtitle = styled(Typography)<any>`
  padding: 20px 0px 20px 0px;
  margin-bottom: 1rem;
  font-size: 2em;
`

export const FormFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  width: 90%;
  margin: 1rem auto 3rem auto;
  border-bottom: 4px dotted #98b0a9;
`

export const AdjustingAnchorLink = styled.a<{ id: string }>`
  display: block;
  position: relative;
  top: -120px;
  visibliity: hidden;
`

export const ButtonWithWhiteText = styled(StyledButton)`
  color: white;
`

interface EnumeratingAnchorProps {
  id: string
}

export const EnumeratingAnchor: React.FC<any> = ({
  id,
}: EnumeratingAnchorProps) => {
  const { addAnchor } = useAnchorContext()
  const { tab } = useTabContext()

  addAnchor(id, tab)

  return <AdjustingAnchorLink id={id} />
}

export const TabContext = createContext<{ tab: number }>({ tab: -1 })

interface TabSectionProps {
  currentTab: number
  tab: number
}

export const TabSection = ({
  currentTab,
  tab,
  children,
  ...props
}: PropsWithChildren<TabSectionProps> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => {
  return (
    <section
      style={{
        ...(currentTab === tab ? {} : { display: "none" }),
        ...(props as any)?.style,
      }}
      {...omit(props, "style")}
    >
      <TabContext.Provider
        value={{
          tab,
        }}
      >
        {children}
      </TabContext.Provider>
    </section>
  )
}

export const useTabContext = () => {
  return useContext(TabContext)
}

export function customValidationResolver<T>(schema: Yup.AnyObjectSchema) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useCallback(
    async (values, context, validateAllFieldCriteria = false) =>
      await yupResolver<T>(schema)(
        values,
        { ...context, values },
        validateAllFieldCriteria,
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

    if (!value || value === "" || !isArray(fieldValues)) {
      return true // previous should have caught the empty
    }

    const currentIndexMatch = (path || "").match(/^.*\[(\d+)\].*$/) || []
    const currentIndex =
      currentIndexMatch.length > 1 ? Number(currentIndexMatch[1]) : -1
    const otherValues = fieldValues
      .filter(
        (c: Child, index: number) => getter(c) !== "" && index !== currentIndex,
      )
      .map((c: Child) => getter(c))

    return otherValues.indexOf(value) === -1
  }

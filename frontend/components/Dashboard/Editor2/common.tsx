import { Typography } from "@material-ui/core"
import { omit } from "lodash"
import { createContext, PropsWithChildren, useContext } from "react"
import styled from "styled-components"
import { useAnchorContext } from "/contexes/AnchorContext"

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

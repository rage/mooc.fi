import dynamic from "next/dynamic"

import { CircularProgress } from "@mui/material"
import { styled } from "@mui/material/styles"

import ErrorMessage from "/components/ErrorMessage"

interface RawViewProps {
  value: string
}

const FullHeightContainer = styled("div")`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Loader = () => (
  <FullHeightContainer>
    <CircularProgress />
  </FullHeightContainer>
)

const DynamicEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: ({ error }) => {
    if (error) {
      return <ErrorMessage />
    }
    return <Loader />
  },
})

export default function RawView({ value }: RawViewProps) {
  return (
    <DynamicEditor
      options={{ wordWrap: "on" }}
      height="80vh"
      defaultLanguage="json"
      defaultValue={value}
    />
  )
}

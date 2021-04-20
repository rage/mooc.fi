import Editor from "@monaco-editor/react"

interface RawViewProps {
  value: string
}

export default function RawView({ value }: RawViewProps) {
  return (
    <Editor
      options={{ wordWrap: "on" }}
      height="80vh"
      defaultLanguage="json"
      defaultValue={value}
    />
  )
}

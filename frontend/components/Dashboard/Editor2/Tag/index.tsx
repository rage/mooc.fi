import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { toTagForm } from "./serialization"
import { TagCoreFieldsFragment } from "/graphql/generated"

interface TagEditorProps {
  tags: TagCoreFieldsFragment[]
}

function TagEditor({ tags }: TagEditorProps) {
  const defaultValues = useRef(
    toTagForm(tags)
  )  

  const methods = useForm({
    defaultValues: defaultValues.current,
  })
}


export default TagEditor
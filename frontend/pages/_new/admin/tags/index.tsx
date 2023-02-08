import { useQuery } from "@apollo/client"
import TagEditor from "/components/Dashboard/Editor2/Tag"
import { TagEditorTagsDocument } from "/graphql/generated"

function Tags() {
  const { data, loading, error } = useQuery(TagEditorTagsDocument)

  if (error) {
    return <div>error</div>
  }

  if (loading) {
    return <div>loading</div>
  }
  
  return (
    <TagEditor
      tags={data?.tags ?? []}
    />
  )
}

export default Tags
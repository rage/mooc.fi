import { List } from "@mui/material"

import CompletionCard from "./CompletionCard"
import CompletionPaginator from "./CompletionPaginator"
import { CompletionsQueryNodeFieldsFragment } from "/static/types/generated"

interface CompletionsListWithDataProps {
  completions: CompletionsQueryNodeFieldsFragment[]
  onLoadMore: () => void
  onGoBack: () => void
  hasPrevious: boolean
  hasNext: boolean
}

const CompletionsListWithData = (props: CompletionsListWithDataProps) => {
  const { completions, onLoadMore, onGoBack, hasPrevious, hasNext } = props
  return (
    <>
      <List>
        {completions.map((completer) => (
          <CompletionCard completer={completer} key={completer.id} />
        ))}
      </List>
      <CompletionPaginator
        getNext={onLoadMore}
        getPrevious={onGoBack}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
      />
    </>
  )
}

export default CompletionsListWithData

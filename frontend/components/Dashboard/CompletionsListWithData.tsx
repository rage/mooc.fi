import React from "react"
import { List } from "@material-ui/core"
import CompletionCard from "./CompletionCard"
import CompletionPaginator from "./CompletionPaginator"
import { AllCompletions_completionsPaginated_edges_node } from "../../static/types/generated/AllCompletions"

interface CompletionsListWithDataProps {
  completions: AllCompletions_completionsPaginated_edges_node[]
  onLoadMore: () => void
  onGoBack: () => void
  pageNumber: number
}

const CompletionsListWithData = (props: CompletionsListWithDataProps) => {
  const { completions, onLoadMore, onGoBack, pageNumber } = props
  return (
    <>
      <List>
        {completions.map(completer => (
          <CompletionCard completer={completer} key={completer.id} />
        ))}
      </List>
      <CompletionPaginator
        getNext={onLoadMore}
        getPrevious={onGoBack}
        pageNumber={pageNumber}
      />
    </>
  )
}

export default CompletionsListWithData

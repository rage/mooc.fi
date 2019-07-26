import React from "react"
import { Grid } from "@material-ui/core"
import CompletionCard from "./CompletionCard"
import HeaderCard from "./HeaderCard"
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
    <Grid container spacing={3} justify="center">
      <HeaderCard course={completions[0].course} />
      {completions.map(completer => (
        <CompletionCard completer={completer} key={completer.id} />
      ))}
      <CompletionPaginator
        getNext={onLoadMore}
        getPrevious={onGoBack}
        pageNumber={pageNumber}
      />
    </Grid>
  )
}

export default CompletionsListWithData

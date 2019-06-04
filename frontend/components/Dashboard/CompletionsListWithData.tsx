import React from "react"
import { Grid } from "@material-ui/core"
import CompletionCard from "./CompletionCard"
import HeaderCard from "./HeaderCard"
import CompletionPaginator from "./CompletionPaginator"

const CompletionsListWithData = props => {
  console.log(props)
  const { completions, onLoadMore, pageNumber } = props
  return (
    <Grid container spacing={3} justify="center">
      <HeaderCard course={"elements-of-ai"} />
      {completions.completionsPaginated.edges.map(completer => (
        <CompletionCard completer={completer.node} key={completer.node.id} />
      ))}
      <CompletionPaginator
        getNext={onLoadMore}
        isNext={completions.completionsPaginated.pageInfo.hasNextPage}
        pageNumber={pageNumber}
      />
    </Grid>
  )
}

export default CompletionsListWithData

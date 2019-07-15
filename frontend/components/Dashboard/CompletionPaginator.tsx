import React from "react"
import { Grid, IconButton } from "@material-ui/core"
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight"
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft"

interface PaginatorProps {
  getNext: () => void
  getPrevious: () => void
  pageNumber: number
}

function Paginator(props: PaginatorProps) {
  const { getNext, getPrevious, pageNumber } = props
  return (
    <Grid item xs={12} sm={12} lg={8}>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          {pageNumber !== 1 ? (
            <IconButton onClick={getPrevious}>
              <KeyboardArrowLeftIcon />
            </IconButton>
          ) : (
            ""
          )}
        </Grid>
        <Grid item>
          <IconButton onClick={getNext}>
            <KeyboardArrowRightIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Paginator

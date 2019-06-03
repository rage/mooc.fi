import React from "react"
import { Grid, IconButton } from "@material-ui/core"
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight"
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft"

function Paginator({ getNext, isNext, hasPrevious, pageNumber }) {
  console.log(hasPrevious)
  console.log("next", isNext)
  return (
    <Grid item xs={12} sm={12} lg={8}>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          {hasPrevious ? (
            <IconButton>
              <KeyboardArrowLeftIcon />
            </IconButton>
          ) : (
            ""
          )}
        </Grid>
        <Grid item>
          <div>{pageNumber}</div>
        </Grid>
        <Grid item>
          {isNext ? (
            <IconButton onClick={getNext}>
              <KeyboardArrowRightIcon />
            </IconButton>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Paginator

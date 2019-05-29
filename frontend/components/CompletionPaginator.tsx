import React from "react"
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
} from "@material-ui/core"
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight"
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft"

function Paginator({ onLoadMore }) {
  return (
    <Grid item xs={12} sm={12} lg={8}>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <IconButton>
            <KeyboardArrowLeftIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <div>1</div>
        </Grid>
        <Grid item>
          <IconButton onClick={onLoadMore}>
            <KeyboardArrowRightIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Paginator

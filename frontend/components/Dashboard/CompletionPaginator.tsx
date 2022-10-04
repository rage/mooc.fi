import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import { Grid, IconButton } from "@mui/material"

interface PaginatorProps {
  getNext: () => void
  getPrevious: () => void
  hasPrevious: boolean
  hasNext: boolean
}

function Paginator(props: PaginatorProps) {
  const { getNext, getPrevious, hasPrevious, hasNext } = props
  return (
    <Grid item xs={12} sm={12} lg={8}>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          {hasPrevious ? (
            <IconButton onClick={getPrevious} size="large">
              <KeyboardArrowLeftIcon />
            </IconButton>
          ) : (
            ""
          )}
        </Grid>
        <Grid item>
          {hasNext ? (
            <IconButton onClick={getNext} size="large">
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

import { Grid, IconButton } from "@material-ui/core"
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight"
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft"

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
            <IconButton onClick={getPrevious}>
              <KeyboardArrowLeftIcon />
            </IconButton>
          ) : (
            ""
          )}
        </Grid>
        <Grid item>
          {hasNext ? (
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

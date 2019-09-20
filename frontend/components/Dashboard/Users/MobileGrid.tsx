import React from "react"
import { Grid, Card, Button } from "@material-ui/core"
import Skeleton from "@material-ui/lab/Skeleton"
import LangLink from "/components/LangLink"
import {
  UserDetailsContains_userDetailsContains_edges,
  UserDetailsContains,
} from "/static/types/generated/UserDetailsContains"

interface HandleChangeRowsPerPageProps {
  eventValue: string
}

interface GridProps {
  data: UserDetailsContains
  loadData: Function
  loading: boolean
  handleChangeRowsPerPage: (props: HandleChangeRowsPerPageProps) => void
  TablePaginationActions: Function /* (
    props: TablePaginationActionsProps,
  ) =>  */
  page: number
  rowsPerPage: number
  searchText: string
  setPage: React.Dispatch<React.SetStateAction<number>>
}

const MobileGrid = ({
  data,
  // loadData,
  loading,
}: // handleChangeRowsPerPage,
// TablePaginationActions,
// page,
// rowsPerPage,
// searchText,
// setPage,
GridProps) => {
  if (loading) {
    return <DataCard />
  }

  return (
    <>
      {(data && data.userDetailsContains
        ? data.userDetailsContains.edges
        : []
      ).map(row => (
        <DataCard row={row} />
      ))}
    </>
  )
}

const DataCard = ({
  row,
}: {
  row?: UserDetailsContains_userDetailsContains_edges
}) => {
  if (!row || (row && !row.node)) {
    return (
      <Card>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Card>
    )
  }
  const { email, upstream_id, first_name, last_name, student_number } = row.node

  return (
    <Card>
      <Grid container>
        <Grid item xs={6}>
          Email
        </Grid>
        <Grid item xs={6}>
          {email}
        </Grid>
        <Grid item xs={6}>
          First name
        </Grid>
        <Grid item xs={6}>
          {first_name}
        </Grid>
        <Grid item xs={6}>
          Last name
        </Grid>
        <Grid item xs={6}>
          {last_name}
        </Grid>
        <Grid item xs={6}>
          Student number
        </Grid>
        <Grid item xs={6}>
          {student_number}
        </Grid>
        <Grid item xs={12}>
          <LangLink
            as={`/users/${upstream_id}/completions`}
            href="/users/[id]/completions"
            passHref
          >
            <Button variant="contained">Completions</Button>
          </LangLink>
        </Grid>
      </Grid>
    </Card>
  )
}

export default MobileGrid

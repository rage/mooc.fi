import React, { useCallback } from "react"
import {
  Grid,
  Card,
  Button,
  CardContent,
  Typography,
  CardActions,
  Paper,
  CardActionArea,
  Table,
  TableBody,
  TableRow,
} from "@material-ui/core"
import Skeleton from "@material-ui/lab/Skeleton"
import LangLink from "/components/LangLink"
import {
  UserDetailsContains_userDetailsContains_edges,
  UserDetailsContains,
  UserDetailsContains_userDetailsContains_edges_node,
} from "/static/types/generated/UserDetailsContains"
import Pagination from "/components/Dashboard/Users/Pagination"
import styled from "styled-components"
import range from "lodash/range"

const UserCard = styled(Card)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

interface HandleChangeRowsPerPageProps {
  eventValue: string
}

interface GridProps {
  data: UserDetailsContains
  loadData: Function
  loading: boolean
  handleChangeRowsPerPage: (props: HandleChangeRowsPerPageProps) => void
  TablePaginationActions: Function
  page: number
  rowsPerPage: number
  searchText: string
  setPage: React.Dispatch<React.SetStateAction<number>>
}

const MobileGrid: React.FC<GridProps> = ({
  data,
  loadData,
  handleChangeRowsPerPage,
  TablePaginationActions,
  page,
  rowsPerPage,
  searchText,
  setPage,
  loading,
}: GridProps) => {
  const PaginationComponent = useCallback(
    () => (
      <Paper style={{ width: "100%", marginTop: "5px" }}>
        <Table>
          <TableBody>
            <TableRow>
              <Pagination
                data={data}
                rowsPerPage={rowsPerPage}
                page={page}
                setPage={setPage}
                searchText={searchText}
                loadData={loadData}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                TablePaginationActions={TablePaginationActions}
              />
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    ),
    [data, rowsPerPage, page],
  )

  return (
    <>
      {loading ||
      (data &&
        data.userDetailsContains &&
        data.userDetailsContains.edges.length) ? (
        <PaginationComponent />
      ) : (
        <Typography>No results</Typography>
      )}
      <RenderCards data={data} loading={loading} />
      <PaginationComponent />
    </>
  )
}

const RenderCards: React.FC<{
  data: UserDetailsContains
  loading: boolean
}> = ({ data, loading }) => {
  if (loading) {
    return (
      <>
        {range(5).map(n => (
          <DataCard key={`skeleton-card-${n}`} />
        ))}
      </>
    )
  }

  return (
    <>
      {data && data.userDetailsContains
        ? (data.userDetailsContains.edges || []).map(row => (
            <DataCard
              key={row.node.upstream_id || Math.random() * 9999999}
              row={row}
            />
          ))
        : null}
    </>
  )
}

const DataCard = ({
  row,
}: {
  row?: UserDetailsContains_userDetailsContains_edges
}) => {
  const { email, upstream_id, first_name, last_name, student_number } = row
    ? row.node
    : ({} as UserDetailsContains_userDetailsContains_edges_node)

  const fields = [
    {
      text: "Email",
      value: email,
      title: true,
    },
    {
      text: "First name",
      value: first_name,
    },
    {
      text: "Last name",
      value: last_name,
    },
    {
      text: "Student number",
      value: student_number,
    },
  ]

  return (
    <UserCard>
      <CardActionArea>
        <CardContent>
          {fields.map(field => {
            if (field.title) {
              return (
                <Grid container key={`${field.text}-${upstream_id}`}>
                  <Grid item xs={12}>
                    {row ? (
                      <Typography variant="h5">{field.value}</Typography>
                    ) : (
                      <Skeleton />
                    )}
                  </Grid>
                </Grid>
              )
            }

            return (
              <Grid container key={`${field.text}-${upstream_id}`}>
                {row ? (
                  <>
                    <Grid item xs={3}>
                      <Typography variant="body2">{field.text}</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">{field.value}</Typography>
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={12}>
                    <Skeleton height={10} />
                  </Grid>
                )}
              </Grid>
            )
          })}
        </CardContent>
      </CardActionArea>
      <CardActions>
        {row ? (
          <LangLink
            as={`/users/${upstream_id}/completions`}
            href="/users/[id]/completions"
            passHref
          >
            <Button variant="contained">Completions</Button>
          </LangLink>
        ) : (
          <Skeleton />
        )}
      </CardActions>
    </UserCard>
  )
}

export default MobileGrid

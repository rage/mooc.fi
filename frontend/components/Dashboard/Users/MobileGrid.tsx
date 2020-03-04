import React, { useCallback, useContext } from "react"
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
  TableCell,
} from "@material-ui/core"
import Skeleton from "@material-ui/lab/Skeleton"
import LangLink from "/components/LangLink"
import {
  UserDetailsContains_userDetailsContains_edges,
  UserDetailsContains_userDetailsContains_edges_node,
} from "/static/types/generated/UserDetailsContains"
import Pagination from "/components/Dashboard/Users/Pagination"
import styled from "styled-components"
import range from "lodash/range"
import getUsersTranslator from "/translations/users"
import LanguageContext from "/contexes/LanguageContext"
import UserSearchContext from "/contexes/UserSearchContext"

const UserCard = styled(Card)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

const MobileGrid: React.FC<any> = () => {
  const { language } = useContext(LanguageContext)
  const { data, page, rowsPerPage, loading } = useContext(UserSearchContext)
  const t = getUsersTranslator(language)

  const PaginationComponent = useCallback(
    () => (
      <Paper style={{ width: "100%", marginTop: "5px" }}>
        <Table>
          <TableBody>
            <TableRow>
              {loading ? (
                <TableCell>
                  <Skeleton />
                </TableCell>
              ) : (
                <Pagination />
              )}
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    ),
    [data, rowsPerPage, page, loading],
  )

  return (
    <>
      {loading || data?.userDetailsContains?.edges?.length ? (
        <PaginationComponent />
      ) : (
        <Typography>{t("noResults")}</Typography>
      )}
      <RenderCards />
      <PaginationComponent />
    </>
  )
}

const RenderCards: React.FC<any> = () => {
  const { data, loading } = useContext(UserSearchContext)

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
      {data?.userDetailsContains?.edges?.map(row => (
        <DataCard
          key={row.node.upstream_id || Math.random() * 9999999}
          row={row}
        />
      ))}
    </>
  )
}

const DataCard = ({
  row,
}: {
  row?: UserDetailsContains_userDetailsContains_edges
}) => {
  const { language } = useContext(LanguageContext)
  const t = getUsersTranslator(language)

  const { email, upstream_id, first_name, last_name, student_number } = row
    ? row.node
    : ({} as UserDetailsContains_userDetailsContains_edges_node)

  const fields = [
    {
      text: t("userEmail"),
      value: email,
      title: true,
    },
    {
      text: t("userFirstName"),
      value: first_name,
    },
    {
      text: t("userLastName"),
      value: last_name,
    },
    {
      text: t("userStudentNumber"),
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
            <Button variant="contained">{t("completions")}</Button>
          </LangLink>
        ) : (
          <Skeleton />
        )}
      </CardActions>
    </UserCard>
  )
}

export default MobileGrid

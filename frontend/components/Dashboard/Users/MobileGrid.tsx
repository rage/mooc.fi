import { useCallback, FC, useContext } from "react"
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
  Skeleton,
} from "@material-ui/core"
import LangLink from "/components/LangLink"
import {
  UserDetailsContains_userDetailsContains_edges,
  UserDetailsContains_userDetailsContains_edges_node,
} from "/static/types/generated/UserDetailsContains"
import Pagination from "/components/Dashboard/Users/Pagination"
import styled from "@emotion/styled"
import range from "lodash/range"
import UsersTranslations from "/translations/users"
import UserSearchContext from "/contexes/UserSearchContext"
import { useTranslator } from "/util/useTranslator"

const UserCard = styled(Card)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

const MobileGrid: FC<any> = () => {
  const { data, page, rowsPerPage, loading } = useContext(UserSearchContext)
  const t = useTranslator(UsersTranslations)

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

const RenderCards: FC<any> = () => {
  const { data, loading } = useContext(UserSearchContext)

  if (loading) {
    return (
      <>
        {range(5).map((n) => (
          <DataCard key={`skeleton-card-${n}`} />
        ))}
      </>
    )
  }

  return (
    <>
      {data?.userDetailsContains?.edges?.map((row) => (
        <DataCard
          key={row?.node?.upstream_id || Math.random() * 9999999}
          row={row ?? undefined}
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
  const t = useTranslator(UsersTranslations)

  const { email, upstream_id, first_name, last_name, student_number } =
    row?.node ?? ({} as UserDetailsContains_userDetailsContains_edges_node)

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
          {fields.map((field) => {
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
      <CardActions style={{ justifyContent: "flex-end" }}>
        {row ? (
          <>
            <LangLink
              as={`/users/${upstream_id}/summary`}
              href="/users/[id]/summary"
              passHref
            >
              <Button variant="contained">{t("summary")}</Button>
            </LangLink>
            <LangLink
              as={`/users/${upstream_id}/completions`}
              href="/users/[id]/completions"
              passHref
            >
              <Button variant="contained">{t("completions")}</Button>
            </LangLink>
          </>
        ) : (
          <Skeleton />
        )}
      </CardActions>
    </UserCard>
  )
}

export default MobileGrid

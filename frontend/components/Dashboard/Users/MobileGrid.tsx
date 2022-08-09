import { FC, useCallback, useContext } from "react"

import range from "lodash/range"
import Link from "next/link"

import styled from "@emotion/styled"
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Grid,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material"

import Pagination from "/components/Dashboard/Users/Pagination"
import UserSearchContext from "/contexts/UserSearchContext"
import UsersTranslations from "/translations/users"
import { useTranslator } from "/util/useTranslator"

import { UserCoreFieldsFragment } from "/static/types/generated"

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
          row={row?.node ?? undefined}
        />
      ))}
    </>
  )
}

interface DataCardProps {
  row?: UserCoreFieldsFragment
}

const DataCard = ({ row }: DataCardProps) => {
  const t = useTranslator(UsersTranslations)

  const { email, upstream_id, first_name, last_name, student_number } =
    row || {}

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
            <Link href={`/users/${upstream_id}/summary`} passHref>
              <Button variant="contained">{t("summary")}</Button>
            </Link>
            <Link href={`/users/${upstream_id}/completions`} passHref>
              <Button variant="contained">{t("completions")}</Button>
            </Link>
          </>
        ) : (
          <Skeleton />
        )}
      </CardActions>
    </UserCard>
  )
}

export default MobileGrid

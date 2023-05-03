import React, { useContext, useMemo } from "react"

import { range } from "lodash"

import {
  Card,
  CardActions,
  CardContent,
  EnhancedButton,
  Button as MUIButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import InfoRow from "../InfoRow"
import Pagination from "./Pagination"
import UserSearchContext from "/contexts/UserSearchContext"
import { useTranslator } from "/hooks/useTranslator"
import UsersTranslations from "/translations/users"

import { UserCoreFieldsFragment } from "/graphql/generated"

const Button = MUIButton as EnhancedButton

const UserCard = styled(Card)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`

const UserCardContent = styled(CardContent)`
  min-width: fit-content;
  flex: 1;
`

const UserCardActions = styled(CardActions)`
  margin-left: auto;
  justify-content: flex-end;
`

const PaginationContainer = styled(Paper)`
  width: 100%;
  margin-top: 5px;
`

const PaginationComponent = ({ loading }: { loading?: boolean }) => (
  <PaginationContainer>
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
  </PaginationContainer>
)

const MobileGrid: React.FC = () => {
  const { meta, loading } = useContext(UserSearchContext)
  const t = useTranslator(UsersTranslations)

  return (
    <>
      {loading || meta.count ? <PaginationComponent loading={loading} /> : null}
      {!loading && meta.finished && meta.count === 0 ? (
        <Typography>{t("noResults")}</Typography>
      ) : null}
      <RenderCards />
      <PaginationComponent loading={loading} />
    </>
  )
}

const RenderCards: React.FC = () => {
  const { data, loading } = useContext(UserSearchContext)

  if (loading && data.length < 1) {
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
      {data.map((row, index) => (
        <DataCard key={row?.upstream_id ?? index} row={row} />
      ))}
    </>
  )
}

interface DataCardProps {
  row?: UserCoreFieldsFragment
}

const DataCard = ({ row }: DataCardProps) => {
  const t = useTranslator(UsersTranslations)

  const { upstream_id } = row ?? {}

  const fields = useMemo(() => {
    const { email, full_name, student_number } = row ?? {}

    return [
      {
        text: t("userFullName"),
        value: full_name,
        title: true,
      },
      {
        text: t("userEmail"),
        value: email,
      },
      {
        text: t("userStudentNumber"),
        value: student_number,
      },
      {
        text: t("userTMCid"),
        value: upstream_id,
      },
    ]
  }, [t, row])

  return (
    <UserCard>
      <UserCardContent>
        {fields.map((field) => {
          if (field.title) {
            return field.value ? (
              <InfoRow
                key={field.text}
                title={field.value}
                variant="h3"
                copyable
                fullWidth
              />
            ) : (
              <Skeleton />
            )
          }

          return row ? (
            Boolean(field.value) && (
              <InfoRow
                key={field.text}
                title={field.text}
                data={field.value ?? ""}
                copyable
                fullWidth
              />
            )
          ) : (
            <Skeleton />
          )
        })}
      </UserCardContent>
      <UserCardActions>
        {row ? (
          <>
            <Button
              href={`/users/${upstream_id}/summary`}
              prefetch={false}
              variant="contained"
            >
              {t("summary")}
            </Button>
            <Button
              href={`/users/${upstream_id}/completions`}
              variant="contained"
              prefetch={false}
            >
              {t("completions")}
            </Button>
          </>
        ) : (
          <Skeleton />
        )}
      </UserCardActions>
    </UserCard>
  )
}

export default MobileGrid

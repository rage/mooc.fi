import { useContext } from "react"

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { Row } from "./Common"
import UserSearchContext, {
  type UserSearchContext as UserSearchContextType,
} from "/contexts/UserSearchContext"
import { useTranslator } from "/hooks/useTranslator"
import UsersTranslations from "/translations/users"
import notEmpty from "/util/notEmpty"

import { UserSearchField } from "/graphql/generated"

const StyledTableContainer = styled(TableContainer)``

const MetaTable = styled(Table)`
  table-layout: auto;
`
const MetaRow = styled(Row)`
  justify-content: space-between;
  gap: 0.5rem;
`

const PaddedMetaRow = styled(MetaRow)`
  padding-left: 1rem;
`

const getFieldMetaAndCumulativeCountFn =
  (totalMeta: UserSearchContextType["totalMeta"]) =>
  (field: UserSearchField, index: number) => {
    const fieldMeta = totalMeta.find((m) => m.field === field)

    if (!fieldMeta) {
      for (let i = index - 1; i >= 0; i--) {
        if (totalMeta[i]) {
          return { fieldMeta, count: totalMeta[i].count }
        }
      }
      return { fieldMeta, count: 0 }
    }
    return { fieldMeta, count: fieldMeta.count }
  }

export const MetaResult = () => {
  const t = useTranslator(UsersTranslations)
  const { meta, totalMeta } = useContext(UserSearchContext)
  const getFieldMetaAndCumulativeCount =
    getFieldMetaAndCumulativeCountFn(totalMeta)

  return (
    <StyledTableContainer>
      <MetaTable size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t("searchField")}</TableCell>
            <TableCell>{t("searchFieldValue")}</TableCell>
            <TableCell>{t("searchFieldResultCount")}</TableCell>
            <TableCell>{t("searchFieldUniqueResultCount")}</TableCell>
            <TableCell>{t("searchCount")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key="total">
            <TableCell>{t("total")}</TableCell>
            <TableCell>{meta.fieldValue}</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>{meta.count}</TableCell>
          </TableRow>
          {(Object.keys(UserSearchField) as Array<UserSearchField>).map(
            (field, index) => {
              const { fieldMeta, count } = getFieldMetaAndCumulativeCount(
                field,
                index,
              )

              return (
                <TableRow key={field}>
                  <TableCell>{t(field as any)}</TableCell>
                  <TableCell>{fieldMeta?.fieldValue ?? meta.search}</TableCell>
                  <TableCell>{fieldMeta?.fieldResultCount ?? 0}</TableCell>
                  <TableCell>
                    {fieldMeta?.fieldUniqueResultCount ?? 0}
                  </TableCell>
                  <TableCell>{count}</TableCell>
                </TableRow>
              )
            },
          )}
        </TableBody>
      </MetaTable>
    </StyledTableContainer>
  )
}

export const NarrowMetaResult = () => {
  const t = useTranslator(UsersTranslations)
  const { meta, totalMeta } = useContext(UserSearchContext)
  const getFieldMetaAndCumulativeCount =
    getFieldMetaAndCumulativeCountFn(totalMeta)

  return (
    <Box>
      <MetaRow key="total">
        <Typography variant="h4">
          <strong>{t("total")}</strong>
        </Typography>
        <Typography variant="h4">{meta.count}</Typography>
      </MetaRow>
      {(Object.keys(UserSearchField) as Array<UserSearchField>).map(
        (field, index) => {
          const { fieldMeta, count } = getFieldMetaAndCumulativeCount(
            field,
            index,
          )

          return (
            <>
              <MetaRow key={field}>
                <Typography variant="h4">
                  <strong>{t(field as any)}</strong>
                </Typography>
                <Typography variant="h4">{count}</Typography>
              </MetaRow>
              {notEmpty(fieldMeta?.fieldValue) &&
                fieldMeta?.fieldValue !== meta.search && (
                  <PaddedMetaRow>
                    <Typography variant="h4">
                      {t("searchFieldValue")}
                    </Typography>
                    <Typography variant="h4">
                      {fieldMeta?.fieldValue ?? meta.search}
                    </Typography>
                  </PaddedMetaRow>
                )}
              <PaddedMetaRow>
                <Typography variant="h4">
                  {t("searchFieldResultCount")}
                </Typography>
                <Typography variant="h4">
                  {fieldMeta?.fieldResultCount ?? 0}
                </Typography>
              </PaddedMetaRow>
              <PaddedMetaRow>
                <Typography variant="h4">
                  {t("searchFieldUniqueResultCount")}
                </Typography>
                <Typography variant="h4">
                  {fieldMeta?.fieldUniqueResultCount ?? 0}
                </Typography>
              </PaddedMetaRow>
            </>
          )
        },
      )}
    </Box>
  )
}

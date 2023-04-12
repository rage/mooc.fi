import { SyntheticEvent, useCallback, useContext, useState } from "react"

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import {
  Collapse,
  FormHelperText,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  useMediaQuery,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import { ButtonWithPaddingAndMargin } from "/components/Buttons/ButtonWithPaddingAndMargin"
import MobileGrid from "/components/Dashboard/Users/MobileGrid"
import WideGrid from "/components/Dashboard/Users/WideGrid"
import { H1NoBackground } from "/components/Text/headers"
import UserSearchContext from "/contexts/UserSearchContext"
import { useTranslator } from "/hooks/useTranslator"
import UsersTranslations from "/translations/users"
import notEmpty from "/util/notEmpty"

import { UserSearchMetaFieldsFragment } from "/graphql/generated"

const StyledForm = styled("form")`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
`

const Row = styled("div")`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const StyledButton = styled(ButtonWithPaddingAndMargin)`
  color: white;
`

const StyledTableContainer = styled(TableContainer)`
  width: max-content;
`
const StyledFormHelperText = styled(FormHelperText)`
  margin: 8px 0 9px 0;
`

const ResultMeta = ({
  meta,
}: {
  meta: Array<UserSearchMetaFieldsFragment>
}) => {
  const t = useTranslator(UsersTranslations)

  return (
    <StyledTableContainer>
      <Table size="small" style={{ tableLayout: "auto" }}>
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
          {meta.map((m) => (
            <TableRow key={m.field}>
              <TableCell>{m.field}</TableCell>
              <TableCell>{m.fieldValue}</TableCell>
              <TableCell>{m.fieldResultCount}</TableCell>
              <TableCell>{m.fieldUniqueResultCount}</TableCell>
              <TableCell>{m.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  )
}

const SearchForm = () => {
  const {
    loading,
    page,
    meta,
    totalMeta,
    search,
    setSearch,
    rowsPerPage,
    searchVariables,
    setPage,
    setSearchVariables,
    resetResults,
  } = useContext(UserSearchContext)
  const t = useTranslator(UsersTranslations)
  const isMobile = useMediaQuery("(max-width:900px)")
  const GridComponent = isMobile ? MobileGrid : WideGrid
  const [metaVisible, setMetaVisible] = useState(false)

  const handleSubmit = useCallback(() => {
    if (search !== "") {
      setSearchVariables({
        search,
        first: rowsPerPage,
        skip: 0,
      })
      setPage(0)
      resetResults()
    }
  }, [search, page, rowsPerPage])

  const onSubmit = useCallback(
    <T extends Element>(event: SyntheticEvent<T>) => {
      event.preventDefault()
      handleSubmit()
    },
    [handleSubmit],
  )

  const onTextBoxChange = useEventCallback((event: any) => {
    setSearch(event.target.value as string)
  })

  const HelperText = useCallback(() => {
    if (!searchVariables.search) {
      return <StyledFormHelperText />
    }

    if (meta.finished) {
      return (
        <StyledFormHelperText
          style={{ margin: meta.count > 0 ? "3px 0" : undefined }}
        >
          {t("searchFinished")}

          {meta.count > 0 && (
            <Tooltip title={t("searchResultMeta")}>
              <IconButton
                size="small"
                onClick={() => setMetaVisible((prev) => !prev)}
              >
                {metaVisible ? (
                  <KeyboardArrowUpIcon fontSize="small" />
                ) : (
                  <KeyboardArrowDownIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          )}
        </StyledFormHelperText>
      )
    }

    return (
      <StyledFormHelperText>
        {t("searchInProgress")}
        {notEmpty(meta.fieldIndex)
          ? `: ${t("searchCondition")} ${meta.fieldIndex}/${meta.fieldCount}`
          : null}
      </StyledFormHelperText>
    )
  }, [searchVariables.search, metaVisible, loading, meta])

  return (
    <>
      <H1NoBackground component="h1" variant="h1" align="center">
        {t("userSearch")}
      </H1NoBackground>
      <StyledForm onSubmit={onSubmit}>
        <Row>
          <TextField
            id="standard-search"
            label={t("searchByString")}
            type="search"
            margin="normal"
            autoComplete="off"
            value={search}
            onChange={onTextBoxChange}
          />
          <StyledButton
            variant="contained"
            disabled={search === ""}
            onClick={onSubmit}
          >
            {t("search")}
          </StyledButton>
        </Row>
        <HelperText />
        {!loading && meta.finished && (
          <Collapse in={metaVisible} unmountOnExit>
            <ResultMeta meta={totalMeta} />
          </Collapse>
        )}
      </StyledForm>
      <GridComponent />
    </>
  )
}

export default SearchForm

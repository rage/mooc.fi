import {
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
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

import { UserSearchField } from "/graphql/generated"

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

const MetaRow = styled(Row)`
  justify-content: space-between;
  gap: 0.5rem;
`

const PaddedMetaRow = styled(MetaRow)`
  padding-left: 1rem;
`

const Column = styled("div")`
  display: flex;
  flex-direction: column;
`

const OptionCollapse = styled(Collapse)`
  .MuiCollapse-wrapperInner {
    justify-content: flex-end;
    display: flex;
  }
`
const OptionFormControl = styled(FormControl)`
  max-width: 50%;
` as typeof FormControl

const OptionFormGroup = styled(FormGroup)`
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.23);
  padding: 0.5rem;
  border-radius: 4px;

  :last-child {
    margin-left: auto;
  }
` as typeof FormGroup

const OptionFormControlLabel = styled(FormControlLabel)``
const StyledButton = styled(ButtonWithPaddingAndMargin)`
  color: white;
  margin-top: 16px;
  max-height: 3.5rem;
`

const StyledTableContainer = styled(TableContainer)``

const MetaResult = () => {
  const t = useTranslator(UsersTranslations)
  const { meta, totalMeta } = useContext(UserSearchContext)

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
          <TableRow key="total">
            <TableCell>{t("total")}</TableCell>
            <TableCell>{meta.fieldValue}</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>{meta.count}</TableCell>
          </TableRow>
          {(Object.keys(UserSearchField) as Array<UserSearchField>).map(
            (field, index) => {
              const m = totalMeta.find((mm) => mm.field === field)
              let count = 0

              if (!m) {
                for (let i = index - 1; i >= 0; i--) {
                  if (totalMeta[i]) {
                    count = totalMeta[i].count
                    break
                  }
                }
              } else {
                count = m.count
              }
              return (
                <TableRow key={field}>
                  <TableCell>{t(field as any)}</TableCell>
                  <TableCell>{m?.fieldValue ?? meta.search}</TableCell>
                  <TableCell>{m?.fieldResultCount ?? 0}</TableCell>
                  <TableCell>{m?.fieldUniqueResultCount ?? 0}</TableCell>
                  <TableCell>{count}</TableCell>
                </TableRow>
              )
            },
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  )
}

const NarrowMetaResult = () => {
  const t = useTranslator(UsersTranslations)
  const { meta, totalMeta } = useContext(UserSearchContext)

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
          const m = totalMeta.find((mm) => mm.field === field)
          let count = 0

          if (!m) {
            for (let i = index - 1; i >= 0; i--) {
              if (totalMeta[i]) {
                count = totalMeta[i].count
                break
              }
            }
          } else {
            count = m.count
          }
          return (
            <>
              <MetaRow key={field}>
                <Typography variant="h4">
                  <strong>{t(field as any)}</strong>
                </Typography>
                <Typography variant="h4">{count}</Typography>
              </MetaRow>
              {notEmpty(m?.fieldValue) && m?.fieldValue !== meta.search && (
                <PaddedMetaRow>
                  <Typography variant="h4">{t("searchFieldValue")}</Typography>
                  <Typography variant="h4">
                    {m?.fieldValue ?? meta.search}
                  </Typography>
                </PaddedMetaRow>
              )}
              <PaddedMetaRow>
                <Typography variant="h4">
                  {t("searchFieldResultCount")}
                </Typography>
                <Typography variant="h4">{m?.fieldResultCount ?? 0}</Typography>
              </PaddedMetaRow>
              <PaddedMetaRow>
                <Typography variant="h4">
                  {t("searchFieldUniqueResultCount")}
                </Typography>
                <Typography variant="h4">
                  {m?.fieldUniqueResultCount ?? 0}
                </Typography>
              </PaddedMetaRow>
            </>
          )
        },
      )}
    </Box>
  )
}

const FieldOptions = () => {
  const t = useTranslator(UsersTranslations)
  const { totalMeta, fields, setFields } = useContext(UserSearchContext)
  const prevFields = useRef(fields)

  const isIndeterminate =
    (fields ?? []).length > 0 &&
    (fields ?? []).length < Object.keys(UserSearchField).length
  const allChecked =
    (fields ?? []).length === Object.keys(UserSearchField).length
  const onToggleAll = useCallback(() => {
    prevFields.current = fields
    setFields(
      allChecked || isIndeterminate
        ? []
        : (Object.keys(UserSearchField) as Array<UserSearchField>),
    )
  }, [allChecked, isIndeterminate, totalMeta])
  const isSelected = useCallback(
    (field: UserSearchField) => fields?.includes(field),
    [fields],
  )
  const onToggleField = useCallback(
    (field: UserSearchField) => () => {
      prevFields.current = fields
      setFields((prev) => {
        if (!prev) {
          return [field]
        }
        if (prev.includes(field)) {
          return prev.filter((f) => f !== field)
        }
        return [...prev, field]
      })
    },
    [fields],
  )

  return (
    <OptionFormControl component="fieldset" size="small" margin="dense">
      <OptionFormGroup row>
        {(Object.keys(UserSearchField) as Array<UserSearchField>).map(
          (field) => (
            <OptionFormControlLabel
              key={field}
              slotProps={{
                typography: {
                  variant: "caption",
                },
              }}
              control={
                <Checkbox
                  checked={isSelected(field)}
                  onChange={onToggleField(field)}
                  size="small"
                />
              }
              label={t(field as any)}
            />
          ),
        )}
        <OptionFormControlLabel
          key="all"
          slotProps={{
            typography: {
              variant: "caption",
            },
          }}
          control={
            <Checkbox
              indeterminate={isIndeterminate}
              checked={allChecked}
              onChange={onToggleAll}
              size="small"
            />
          }
          label={allChecked || isIndeterminate ? t("clearAll") : t("selectAll")}
        />
      </OptionFormGroup>
    </OptionFormControl>
  )
}
const SearchForm = () => {
  const {
    loading,
    page,
    meta,
    fields,
    search,
    setSearch,
    rowsPerPage,
    searchVariables,
    setPage,
    setSearchVariables,
    resetResults,
    setResults,
  } = useContext(UserSearchContext)
  const t = useTranslator(UsersTranslations)
  const isNarrow = useMediaQuery("(max-width:900px)")
  const isMobile = useMediaQuery("(max-width:700px)")
  const GridComponent = isNarrow ? MobileGrid : WideGrid
  const MetaComponent = isMobile ? NarrowMetaResult : MetaResult
  const prevSearch = useRef(search)
  const prevFields = useRef(fields)
  const [metaVisible, setMetaVisible] = useState(false)
  const [optionsVisible, setOptionsVisible] = useState(false)

  const handleSubmit = useCallback(() => {
    if ((search ?? "").length >= 3) {
      setSearchVariables({
        search,
        fields,
      })
      setPage(0)
      if (search !== prevSearch.current || fields !== prevFields.current) {
        resetResults()
      }
      prevSearch.current = search
      prevFields.current = fields
    }
  }, [
    prevSearch.current,
    prevFields.current,
    search,
    fields,
    page,
    rowsPerPage,
  ])

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

  const MetaText = useCallback(() => {
    if (meta.finished) {
      return (
        <>
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
        </>
      )
    }

    if (loading) {
      return (
        <>
          {t("searchInProgress")}
          {notEmpty(meta.fieldIndex) &&
            `: ${t("searchCondition")} ${meta.fieldIndex}/${meta.fieldCount}`}
        </>
      )
    }
    return <> </>
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
            helperText={search && search.length < 3 ? t("searchTooShort") : " "}
          />
          <StyledButton
            variant="contained"
            disabled={(search ?? "").length < 3}
            onClick={onSubmit}
          >
            {t("search")}
          </StyledButton>
        </Row>
        <Row style={{ justifyContent: "space-between" }}>
          <Column>
            <FormHelperText>
              <MetaText />
            </FormHelperText>
          </Column>
          <Column style={{ alignItems: "flex-end" }}>
            <FormHelperText>
              {t("searchOptions")}
              <Tooltip
                title={
                  optionsVisible
                    ? t("hideSearchOptions")
                    : t("showSearchOptions")
                }
              >
                <IconButton
                  size="small"
                  onClick={() => setOptionsVisible((prev) => !prev)}
                >
                  {optionsVisible ? (
                    <KeyboardArrowUpIcon fontSize="small" />
                  ) : (
                    <KeyboardArrowDownIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </FormHelperText>
          </Column>
        </Row>
        <Row>
          <Column>
            {!loading && meta.finished && (
              <Collapse in={metaVisible} unmountOnExit>
                <MetaComponent />
              </Collapse>
            )}
          </Column>
          <Column style={{ width: "fit-content" }}>
            <OptionCollapse in={optionsVisible} unmountOnExit>
              <FieldOptions />
            </OptionCollapse>
          </Column>
        </Row>
      </StyledForm>
      <GridComponent />
    </>
  )
}

export default SearchForm

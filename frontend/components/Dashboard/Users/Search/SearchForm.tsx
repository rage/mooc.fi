import {
  SyntheticEvent,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react"

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import {
  Collapse,
  FormHelperText,
  IconButton,
  TextField,
  Tooltip,
  useMediaQuery,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import { Column, Row } from "./Common"
import MobileGrid from "./MobileGrid"
import { SearchFieldOptions } from "./SearchFieldOptions"
import { MetaResult, NarrowMetaResult } from "./SearchMetaResult"
import WideGrid from "./WideGrid"
import { ButtonWithPaddingAndMargin } from "/components/Buttons/ButtonWithPaddingAndMargin"
import { H1NoBackground } from "/components/Text/headers"
import UserSearchContext from "/contexts/UserSearchContext"
import { useTranslator } from "/hooks/useTranslator"
import UsersTranslations from "/translations/users"
import notEmpty from "/util/notEmpty"

const StyledForm = styled("form")`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
`

const OptionCollapse = styled(Collapse)`
  .MuiCollapse-wrapperInner {
    justify-content: flex-end;
    display: flex;
  }
`
const StyledButton = styled(ButtonWithPaddingAndMargin)`
  color: white;
  margin-top: 16px;
  max-height: 3.5rem;
`

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
              <SearchFieldOptions />
            </OptionCollapse>
          </Column>
        </Row>
      </StyledForm>
      <GridComponent />
    </>
  )
}

export default SearchForm

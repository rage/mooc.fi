import { useCallback, useContext, useState } from "react"

import styled from "@emotion/styled"
import { TextField, useMediaQuery } from "@mui/material"

import { ButtonWithPaddingAndMargin } from "/components/Buttons/ButtonWithPaddingAndMargin"
import MobileGrid from "/components/Dashboard/Users/MobileGrid"
import WideGrid from "/components/Dashboard/Users/WideGrid"
import { H1NoBackground } from "/components/Text/headers"
import UserSearchContext from "/contexts/UserSearchContext"
import UsersTranslations from "/translations/users"
import { useTranslator } from "/util/useTranslator"

const StyledForm = styled.form`
  display: flex;
  width: 100%;
`

const StyledButton = styled(ButtonWithPaddingAndMargin)`
  color: white;
`

const SearchForm = () => {
  const { page, rowsPerPage, searchVariables, setPage, setSearchVariables } =
    useContext(UserSearchContext)
  const t = useTranslator(UsersTranslations)

  const [searchFormText, setSearchFormText] = useState(searchVariables.search)

  const handleSubmit = useCallback(() => {
    if (searchFormText !== "") {
      setSearchVariables({
        search: searchFormText,
        first: rowsPerPage,
        skip: 0,
      })
      setPage(0)
    }
  }, [searchFormText, page, rowsPerPage])

  const onTextBoxChange = (event: any) => {
    setSearchFormText(event.target.value as string)
  }

  const isMobile = useMediaQuery("(max-width:900px)", { noSsr: true })
  const GridComponent = isMobile ? MobileGrid : WideGrid

  return (
    <>
      <H1NoBackground component="h1" variant="h1" align="center">
        {t("userSearch")}
      </H1NoBackground>
      <div>
        <StyledForm
          onSubmit={async (event: any) => {
            event.preventDefault()
            handleSubmit()
          }}
        >
          <TextField
            id="standard-search"
            label={t("searchByString")}
            type="search"
            margin="normal"
            autoComplete="off"
            value={searchFormText}
            onChange={onTextBoxChange}
          />

          <StyledButton
            variant="contained"
            disabled={searchFormText === ""}
            onClick={async (event: any) => {
              event.preventDefault()
              handleSubmit()
            }}
          >
            {t("search")}
          </StyledButton>
        </StyledForm>
        <GridComponent />
      </div>
    </>
  )
}

export default SearchForm

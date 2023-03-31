import { useCallback, useContext } from "react"

import { TextField, useMediaQuery } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import { ButtonWithPaddingAndMargin } from "/components/Buttons/ButtonWithPaddingAndMargin"
import MobileGrid from "/components/Dashboard/Users/MobileGrid"
import WideGrid from "/components/Dashboard/Users/WideGrid"
import { H1NoBackground } from "/components/Text/headers"
import UserSearchContext from "/contexts/UserSearchContext"
import { useTranslator } from "/hooks/useTranslator"
import UsersTranslations from "/translations/users"

const StyledForm = styled("form")`
  display: flex;
  width: 100%;
`

const StyledButton = styled(ButtonWithPaddingAndMargin)`
  color: white;
`

const SearchForm = () => {
  const { page, search, setSearch, rowsPerPage, setPage, setSearchVariables } =
    useContext(UserSearchContext)
  const t = useTranslator(UsersTranslations)

  const handleSubmit = useCallback(() => {
    if (search !== "") {
      setSearchVariables({
        search,
        first: rowsPerPage,
        skip: 0,
      })
      setPage(0)
    }
  }, [search, page, rowsPerPage])

  const onTextBoxChange = useEventCallback((event: any) => {
    setSearch(event.target.value as string)
  })

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
            value={search}
            onChange={onTextBoxChange}
          />

          <StyledButton
            variant="contained"
            disabled={search === ""}
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

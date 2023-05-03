import React, { useCallback, useMemo, useState } from "react"

import { NextSeo } from "next-seo"
import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import BuildIcon from "@mui/icons-material/Build"
import { Button, Dialog, Paper, TextField, useMediaQuery } from "@mui/material"
import { styled, Theme } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import Container from "/components/Container"
import { UserPointsSummaryContextProvider } from "/components/Dashboard/Users/Summary/contexts"
import CourseFilterMenu from "/components/Dashboard/Users/Summary/CourseFilterMenu"
import CourseSelectDropdown from "/components/Dashboard/Users/Summary/CourseSelectDropdown"
import RawView from "/components/Dashboard/Users/Summary/RawView"
import UserPointsSummary from "/components/Dashboard/Users/Summary/UserPointsSummary"
import UserInfo from "/components/Dashboard/Users/UserInfo"
import ErrorMessage from "/components/ErrorMessage"
import { Breadcrumb } from "/contexts/BreadcrumbContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useQueryParameter } from "/hooks/useQueryParameter"
import useSubtitle from "/hooks/useSubtitle"
import { useTranslator } from "/hooks/useTranslator"
import withAdmin from "/lib/with-admin"
import CommonTranslations from "/translations/common"
import ProfileTranslations from "/translations/profile"
import UsersTranslations from "/translations/users"

import { UserSummaryDocument } from "/graphql/generated"

const StyledForm = styled("form")`
  display: flex;
  padding: 1rem;
`

const SearchContainer = styled(Paper)`
  margin-bottom: 0.5rem;
`

const ToolbarContainer = styled("div")`
  padding: 0.5rem 1rem 0.5rem 1rem;
  display: flex;
  gap: 0.5rem;
  flex: 1;
  justify-content: space-between;
`

const HideOverflow = styled("div")`
  overflow-y: hidden;
`

const RightToolbarContainer = styled("div")`
  display: flex;
  gap: 1rem;
`

function UserSummaryView() {
  const isNarrow = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"))

  const t = useTranslator(
    UsersTranslations,
    ProfileTranslations,
    CommonTranslations,
  )
  const router = useRouter()
  const id = useQueryParameter("id")
  const slug = useQueryParameter("slug", false)
  const initialSort = useQueryParameter("sort", false)
  const initialOrder = useQueryParameter("order", false)

  const { loading, error, data } = useQuery(UserSummaryDocument, {
    variables: {
      upstream_id: Number(id),
      includeNoPointsAwardedExercises: false,
      includeDeletedExercises: false,
    },
    ssr: false,
  })

  const dataProps = { data, loading }
  const options = useMemo(
    () => ({
      initialSort,
      initialOrder,
      slug,
    }),
    [],
  )

  const breadcrumbs = useMemo(() => {
    const crumbs: Array<Breadcrumb> = [
      {
        translation: "users",
      },
      {
        label: id,
      },
      {
        translation: "userSummary",
        href: `/users/${id}/summary`,
      },
    ]

    if (slug) {
      const entry = data?.user?.user_course_summary?.find(
        ({ course }) => course?.slug === slug,
      )
      const isInvalid = !loading && data && !entry
      if (!isInvalid) {
        crumbs.push({
          label: entry?.course?.name,
          href: `/users/${id}/summary/${slug}`,
        })
      }
    }
    return crumbs
  }, [loading, data, slug])

  useBreadcrumbs(breadcrumbs)

  const title = useSubtitle(data?.user?.full_name ?? undefined)

  const [rawViewOpen, setRawViewOpen] = useState(false)
  const [userSearch, setUserSearch] = useState("")

  const onSubmit = useCallback(
    function onsub(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault()
      if (userSearch && userSearch.length >= 3) {
        router.push(`/users/search/${encodeURIComponent(userSearch)}`)
      }
    },
    [userSearch],
  )

  const onUserSearchChange = useEventCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserSearch(event.target.value)
    },
  )

  const onRawViewToggle = useEventCallback(() => {
    setRawViewOpen((prev) => !prev)
  })

  const onRawViewClose = useEventCallback(() => {
    setRawViewOpen(false)
  })

  if (error) {
    return (
      <Container>
        <ErrorMessage />
      </Container>
    )
  }

  return (
    <>
      <NextSeo title={title} />
      <Container>
        <StyledForm onSubmit={onSubmit}>
          <TextField
            id="standard-search"
            label={t("searchUser")}
            type="search"
            margin="normal"
            autoComplete="off"
            size="small"
            value={userSearch}
            onChange={onUserSearchChange}
            helperText={
              userSearch && userSearch.length < 3 ? t("searchTooShort") : " "
            }
          />
        </StyledForm>
        {/*<CollapseContext.Provider value={collapseContextValue}>*/}
        {/*<UserPointsSummaryContext.Provider
            value={userPointsSummaryContextValue}
          >*/}
        {/*<UserPointsSummaryContext.Provider value={contextData}>
            <UserPointsSummaryFunctionsContext.Provider
              value={functions}
        >*/}
        <UserPointsSummaryContextProvider
          dataProps={dataProps}
          options={options}
        >
          <UserInfo data={data?.user} />
          <SearchContainer>
            <CourseFilterMenu />
            <ToolbarContainer>
              <Button
                variant="outlined"
                startIcon={<BuildIcon />}
                onClick={onRawViewToggle}
              >
                Raw view
              </Button>
              {isNarrow && <CourseSelectDropdown />}
              <RightToolbarContainer>
                {/*<CollapseButton
                      onClick={onCollapseClick}
                      open={!allCoursesClosed}
                      tooltip={t("allCoursesCollapseTooltip")}
                  />*/}
              </RightToolbarContainer>
            </ToolbarContainer>
          </SearchContainer>
          <UserPointsSummary />
        </UserPointsSummaryContextProvider>
        {/*</UserPointsSummaryFunctionsContext.Provider>
          </UserPointsSummaryContext.Provider>*/}
        {/*</UserPointsSummaryContext.Provider>*/}
        {/*</CollapseContext.Provider>*/}
        <Dialog
          fullWidth
          maxWidth="md"
          open={rawViewOpen}
          onClose={onRawViewClose}
        >
          <HideOverflow>
            <RawView value={JSON.stringify(data, undefined, 2)} />
          </HideOverflow>
        </Dialog>
      </Container>
    </>
  )
}

export default withAdmin(UserSummaryView)

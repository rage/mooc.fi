import { useCallback, useMemo, useState } from "react"

import { range } from "remeda"

import { useMutation, useQuery } from "@apollo/client"
import {
  Button,
  Card,
  CardContent,
  Container,
  ContainerProps,
  Grid,
  GridProps,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { WideContainer } from "/components/Container"
import ErrorMessage from "/components/ErrorMessage"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useDebounce from "/hooks/useDebounce"
import useIsOld from "/hooks/useIsOld"
import { useTranslator } from "/hooks/useTranslator"
import withSignedIn from "/lib/with-signed-in"
import RegistrationTranslations from "/translations/register"
import { isDefinedAndNotEmpty } from "/util/guards"

import {
  AddUserOrganizationDocument,
  CurrentUserUserOrganizationsDocument,
  DeleteUserOrganizationDocument,
  OrganizationsDocument,
  SortOrder,
} from "/graphql/generated"

const Header = styled(Typography)`
  margin-top: 1em;
` as typeof Typography

const FormContainer = (props: ContainerProps & GridProps) => (
  <Container spacing={4} {...props} />
)

interface OrganizationCardProps {
  name: string
  isMember: boolean
  onToggle: () => Promise<void>
}

const OrganizationCard = ({
  name,
  isMember,
  onToggle,
}: OrganizationCardProps) => {
  const t = useTranslator(RegistrationTranslations)
  const [disabled, setDisabled] = useState(false)
  const isOld = useIsOld()
  const baseUrl = isOld ? "/_old" : ""

  useBreadcrumbs([
    {
      translation: "register",
      href: `${baseUrl}/register`,
    },
  ])

  return (
    <Card style={{ marginBottom: "0.5rem" }}>
      <CardContent>
        <Grid container direction="row">
          <Grid item xs={9}>
            <Typography variant="h3">{name}</Typography>
          </Grid>
          <Grid item xs={3} style={{ textAlign: "right" }}>
            <Button
              color={isMember ? "secondary" : "primary"}
              onClick={async () => {
                setDisabled(true)
                await onToggle()
                setDisabled(false)
              }}
              disabled={disabled}
            >
              {isMember ? t("leave") : t("join")}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

const SkeletonCard = () => (
  <Card style={{ marginBottom: "0.5rem" }}>
    <CardContent>
      <Skeleton />
    </CardContent>
  </Card>
)

function useSearchBox() {
  const [searchBox, setSearchBox] = useState("")
  const [searchFilter, cancelFilterDebounce] = useDebounce(searchBox, 1000)

  return {
    searchBox,
    setSearchBox,
    searchFilter,
    cancelFilterDebounce,
  }
}

function useRegisterOrganization(searchFilter: string) {
  const {
    data: organizationsData,
    error: organizationsError,
    loading: organizationsLoading,
  } = useQuery(OrganizationsDocument, {
    variables: {
      orderBy: [{ name: SortOrder.asc }],
    },
  })
  const {
    data: userOrganizationsData,
    error: userOrganizationsError,
    // loading: userOrganizationsLoading,
  } = useQuery(CurrentUserUserOrganizationsDocument)
  const [addUserOrganization] = useMutation(AddUserOrganizationDocument, {
    refetchQueries: [
      {
        query: CurrentUserUserOrganizationsDocument,
      },
    ],
  })

  const [deleteUserOrganization] = useMutation(DeleteUserOrganizationDocument, {
    refetchQueries: [
      {
        query: CurrentUserUserOrganizationsDocument,
      },
    ],
  })

  const memberships = useMemo(() => {
    if (!userOrganizationsData) {
      return []
    }
    const mIds =
      userOrganizationsData.currentUser?.user_organizations
        ?.map((uo) => uo?.organization?.id)
        .filter(isDefinedAndNotEmpty) ?? []
    return mIds
  }, [userOrganizationsData])

  const filteredOrganizations = useMemo(() => {
    if (!organizationsData) {
      return []
    }
    if (!searchFilter) {
      return organizationsData?.organizations ?? []
    }

    return organizationsData?.organizations?.filter((org) =>
      org.name.toLowerCase().includes(searchFilter.toLowerCase()),
    )
  }, [organizationsData, searchFilter])

  const toggleMembership = useCallback(
    (id: string) => async () => {
      // TODO: error handling if mutations don't succeed
      if (memberships.includes(id)) {
        const existing = userOrganizationsData?.currentUser?.user_organizations
          ?.filter(isDefinedAndNotEmpty)
          .find((uo) => uo?.organization?.id === id)

        if (existing) {
          await deleteUserOrganization({
            variables: {
              id: existing.id,
            },
          })
        }
      } else {
        await addUserOrganization({
          variables: {
            organization_id: id,
          },
        })
      }
    },
    [memberships, userOrganizationsData],
  )

  return {
    error: organizationsError ?? userOrganizationsError,
    loading: organizationsLoading,
    organizations: filteredOrganizations,
    memberships,
    toggleMembership,
  }
}

const OrganizationItems = () => {
  const t = useTranslator(RegistrationTranslations)

  const { searchFilter } = useSearchBox()
  const { error, loading, organizations, memberships, toggleMembership } =
    useRegisterOrganization(searchFilter)

  if (error) {
    return <ErrorMessage />
  }

  if (loading) {
    return (
      <>
        {range(0, 5).map((i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}
      </>
    )
  }

  if (!organizations || organizations.length === 0) {
    return <div>{t("noResults", { search: searchFilter })}</div>
  }

  return (
    <>
      {organizations.map((organization) => (
        <OrganizationCard
          key={organization.id}
          name={organization.name}
          isMember={memberships.includes(organization.id)}
          onToggle={toggleMembership(organization.id)}
        />
      ))}
    </>
  )
}

const Register = () => {
  const t = useTranslator(RegistrationTranslations)
  const { cancelFilterDebounce, searchBox, setSearchBox } = useSearchBox()

  return (
    <WideContainer>
      <Header component="h1" variant="h2" gutterBottom align="center">
        {t("title")}
      </Header>
      <FormContainer maxWidth="md">
        <TextField
          style={{ marginBottom: "0.5rem" }}
          name="search"
          type="search"
          variant="outlined"
          value={searchBox}
          autoComplete="off"
          onChange={(e) => setSearchBox(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && cancelFilterDebounce()}
          placeholder={t("search")}
        />
        <OrganizationItems />
      </FormContainer>
    </WideContainer>
  )
}

export default withSignedIn(Register)

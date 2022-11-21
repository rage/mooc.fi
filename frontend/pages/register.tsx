import { useEffect, useState } from "react"

import { range } from "lodash"

import { useMutation, useQuery } from "@apollo/client"
import CancelIcon from "@mui/icons-material/Cancel"
import {
  Button,
  Card,
  CardContent,
  Container,
  ContainerProps,
  Grid,
  GridProps,
  IconButton,
  InputAdornment,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { WideContainer } from "/components/Container"
import ErrorMessage from "/components/ErrorMessage"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withSignedIn from "/lib/with-signed-in"
import RegistrationTranslations from "/translations/register"
import notEmpty from "/util/notEmpty"
import useDebounce from "/util/useDebounce"
import { useTranslator } from "/util/useTranslator"

import {
  AddUserOrganizationDocument,
  DeleteUserOrganizationDocument,
  OrganizationCoreFieldsFragment,
  OrganizationsDocument,
  UserOrganizationsDocument,
} from "/graphql/generated"

const Header = styled(Typography)`
  margin-top: 1em;
` as typeof Typography

const FormContainer = styled((props: ContainerProps & GridProps) => (
  <Container spacing={4} {...props} />
))``

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

  useBreadcrumbs([
    {
      translation: "register",
      href: "/register",
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
  const { currentUser } = useLoginStateContext()

  const [memberships, setMemberships] = useState<Array<string>>([])
  const [organizations, setOrganizations] = useState<
    Record<string, OrganizationCoreFieldsFragment>
  >({})
  const [filteredOrganizations, setFilteredOrganizations] = useState<
    Record<string, OrganizationCoreFieldsFragment>
  >({})

  const {
    data: organizationsData,
    error: organizationsError,
    loading: organizationsLoading,
  } = useQuery(OrganizationsDocument)
  const {
    data: userOrganizationsData,
    error: userOrganizationsError,
    // loading: userOrganizationsLoading,
  } = useQuery(UserOrganizationsDocument, {
    variables: { user_id: currentUser?.id },
  })
  const [addUserOrganization] = useMutation(AddUserOrganizationDocument, {
    refetchQueries: [
      {
        query: UserOrganizationsDocument,
        variables: { user_id: currentUser?.id },
      },
    ],
  })

  // const [updateUserOrganization] = useMutation(UpdateUserOrganizationMutation)
  const [deleteUserOrganization] = useMutation(DeleteUserOrganizationDocument, {
    refetchQueries: [
      {
        query: UserOrganizationsDocument,
        variables: { user_id: currentUser?.id },
      },
    ],
  })

  // TODO: do something else
  useEffect(() => {
    if (
      !userOrganizationsData ||
      (userOrganizationsData && Object.keys(organizations).length)
    ) {
      return
    }

    const mIds = (userOrganizationsData.userOrganizations ?? [])
      .map((uo) => uo?.organization?.id)
      .filter(notEmpty)

    setMemberships(mIds)
  }, [userOrganizationsData])

  useEffect(() => {
    if (!organizationsData) {
      return
    }

    const sortedOrganizations = (organizationsData?.organizations ?? [])
      .filter((o) => o?.organization_translations?.length)
      .sort((a, b) =>
        a.organization_translations[0].name.localeCompare(
          b.organization_translations[0].name,
          "fi-FI",
        ),
      )
    const orgs = {} as Record<string, OrganizationCoreFieldsFragment>

    for (const org of sortedOrganizations) {
      orgs[org.id] = org
    }

    setOrganizations(orgs)
    setFilteredOrganizations(orgs)
  }, [organizationsData])

  useEffect(() => {
    if (!organizations || !Object.keys(organizations).length) {
      return
    }

    if (!searchFilter) {
      setFilteredOrganizations(organizations)

      return
    }

    const newFilteredOrganizations = {} as Record<
      string,
      OrganizationCoreFieldsFragment
    >

    for (const [id, org] of Object.entries(organizations)) {
      if (
        !org.organization_translations[0].name
          .toLowerCase()
          .includes(searchFilter.toLowerCase())
      ) {
        continue
      }
      newFilteredOrganizations[id] = org
    }
    setFilteredOrganizations(newFilteredOrganizations)
  }, [searchFilter, organizations])

  const toggleMembership = (id: string) => async () => {
    if (memberships.includes(id)) {
      const existing = (userOrganizationsData?.userOrganizations ?? []).find(
        (uo) => uo?.organization?.id === id,
      )

      if (existing) {
        await deleteUserOrganization({
          variables: {
            id: existing.id,
          },
        })
        setMemberships(memberships.filter((i) => i !== id))
      }
    } else {
      await addUserOrganization({
        variables: {
          user_id: currentUser?.id ?? "",
          organization_id: id,
        },
      })
      setMemberships(memberships.concat(id))
    }
  }

  return {
    error: organizationsError || userOrganizationsError,
    loading: organizationsLoading,
    organizations,
    filteredOrganizations,
    memberships,
    toggleMembership,
  }
}

const Register = () => {
  const t = useTranslator(RegistrationTranslations)
  const { searchFilter, cancelFilterDebounce, searchBox, setSearchBox } =
    useSearchBox()
  const {
    error,
    loading,
    toggleMembership,
    organizations,
    filteredOrganizations,
    memberships,
  } = useRegisterOrganization(searchFilter)

  if (error /*organizationsError || userOrganizationsError*/) {
    return <ErrorMessage />
  }

  return (
    <WideContainer>
      <Header component="h1" variant="h2" gutterBottom={true} align="center">
        {t("title")}
      </Header>
      <FormContainer maxWidth="md">
        <TextField
          style={{ marginBottom: "0.5rem" }}
          name="search"
          type="text"
          variant="outlined"
          value={searchBox}
          autoComplete="off"
          onChange={(e) => setSearchBox(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && cancelFilterDebounce()}
          placeholder={t("search")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    cancelFilterDebounce("")
                    setSearchBox("")
                  }}
                  size="large"
                >
                  <CancelIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <>
          {loading || !Object.keys(organizations).length ? (
            range(5).map((i) => <SkeletonCard key={`skeleton-${i}`} />)
          ) : Object.keys(filteredOrganizations).length ? (
            Object.entries(filteredOrganizations).map(([id, organization]) => (
              <OrganizationCard
                key={`card-${id}`}
                name={organization.organization_translations[0].name}
                isMember={memberships.includes(id)}
                onToggle={toggleMembership(id)}
              />
            ))
          ) : (
            <div>{t("noResults", { search: searchFilter })}</div>
          )}
        </>
      </FormContainer>
    </WideContainer>
  )
}

export default withSignedIn(Register)

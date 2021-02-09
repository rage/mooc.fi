import { useState, useEffect, useContext } from "react"
import { gql } from "@apollo/client"
import { useQuery, useMutation } from "@apollo/client"
import {
  Button,
  Card,
  Container,
  IconButton,
  InputAdornment,
  Grid,
  Typography,
  TextField,
  CardContent,
  Skeleton,
} from "@material-ui/core"
import CancelIcon from "@material-ui/icons/Cancel"
import ErrorMessage from "/components/ErrorMessage"
import {
  Organizations,
  Organizations_organizations,
} from "/static/types/generated/Organizations"
import {
  UserOrganizations,
  UserOrganizations_userOrganizations,
} from "/static/types/generated/UserOrganizations"
import useDebounce from "/util/useDebounce"
import styled from "@emotion/styled"
import RegistrationTranslations from "/translations/register"
import { WideContainer } from "/components/Container"
import { range } from "lodash"
import withSignedIn from "/lib/with-signed-in"
import LoginStateContext from "/contexes/LoginStateContext"
import notEmpty from "/util/notEmpty"
import { useTranslator } from "/util/useTranslator"

export const OrganizationsQuery = gql`
  query Organizations {
    organizations {
      id
      slug
      hidden
      organization_translations {
        language
        name
        information
      }
    }
  }
`

export const UserOrganizationsQuery = gql`
  query UserOrganizations($user_id: ID) {
    userOrganizations(user_id: $user_id) {
      id
      organization {
        id
      }
    }
  }
`

export const AddUserOrganizationMutation = gql`
  mutation addUserOrganization($user_id: ID!, $organization_id: ID!) {
    addUserOrganization(user_id: $user_id, organization_id: $organization_id) {
      id
    }
  }
`

export const UpdateUserOrganizationMutation = gql`
  mutation updateUserOrganization($id: ID!, $role: OrganizationRole) {
    updateUserOrganization(id: $id, role: $role) {
      id
    }
  }
`

export const DeleteUserOrganizationMutation = gql`
  mutation deleteUserOrganization($id: ID!) {
    deleteUserOrganization(id: $id) {
      id
    }
  }
`

const Header = styled(Typography)<any>`
  margin-top: 1em;
`

const FormContainer = styled(Container)`
  spacing: 4;
`

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

const Register = () => {
  const t = useTranslator(RegistrationTranslations)
  const { currentUser } = useContext(LoginStateContext)

  const [memberships, setMemberships] = useState<Array<string>>([])
  const [organizations, setOrganizations] = useState<
    Record<string, Organizations_organizations>
  >({})
  const [searchBox, setSearchBox] = useState("")
  const [searchFilter, cancelFilterDebounce] = useDebounce(searchBox, 1000)
  const [filteredOrganizations, setFilteredOrganizations] = useState<
    Record<string, Organizations_organizations>
  >({})

  const {
    data: organizationsData,
    error: organizationsError,
    loading: organizationsLoading,
  } = useQuery<Organizations>(OrganizationsQuery)
  const {
    data: userOrganizationsData,
    error: userOrganizationsError,
    // loading: userOrganizationsLoading,
  } = useQuery<UserOrganizations>(UserOrganizationsQuery, {
    variables: { user_id: currentUser!.id },
  })
  const [addUserOrganization] = useMutation(AddUserOrganizationMutation, {
    refetchQueries: [
      {
        query: UserOrganizationsQuery,
        variables: { user_id: currentUser!.id },
      },
    ],
  })

  // const [updateUserOrganization] = useMutation(UpdateUserOrganizationMutation)
  const [deleteUserOrganization] = useMutation(DeleteUserOrganizationMutation, {
    refetchQueries: [
      {
        query: UserOrganizationsQuery,
        variables: { user_id: currentUser!.id },
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

    const mIds =
      userOrganizationsData.userOrganizations
        ?.map((uo) => uo?.organization?.id)
        .filter(notEmpty) ?? []

    setMemberships(mIds)
  }, [userOrganizationsData])

  useEffect(() => {
    if (!organizationsData) {
      return
    }

    const sortedOrganizations =
      organizationsData?.organizations
        ?.filter((o) => o?.organization_translations?.length)
        .sort((a, b) =>
          a!.organization_translations![0].name.localeCompare(
            b!.organization_translations![0].name,
            "fi-FI",
          ),
        ) ?? []

    const orgs = sortedOrganizations.filter(notEmpty).reduce(
      (acc, curr) => ({
        ...acc,
        [curr.id]: curr,
      }),
      {},
    )

    setOrganizations(orgs)
    setFilteredOrganizations(orgs)
  }, [organizationsData])

  useEffect(() => {
    if (!organizations || !Object.keys(organizations).length) {
      return
    }

    if (!searchFilter || searchFilter === "") {
      setFilteredOrganizations(organizations)

      return
    }

    setFilteredOrganizations(
      Object.entries(organizations).reduce((acc, [key, value]) => {
        if (
          !value!
            .organization_translations![0].name.toLowerCase()
            .includes(searchFilter.toLowerCase())
        ) {
          return acc
        }

        return {
          ...acc,
          [key]: value,
        }
      }, {}),
    )
  }, [searchFilter, organizations])

  const toggleMembership = (id: string) => async () => {
    if (memberships.includes(id)) {
      const existing = userOrganizationsData?.userOrganizations
        ?.filter(notEmpty)
        .find(
          (uo: UserOrganizations_userOrganizations) =>
            uo?.organization?.id === id,
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
          user_id: currentUser!.id,
          organization_id: id,
        },
      })
      setMemberships(memberships.concat(id))
    }
  }

  if (organizationsError || userOrganizationsError) {
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
                >
                  <CancelIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <>
          {organizationsLoading || !Object.keys(organizations).length ? (
            range(5).map((i) => <SkeletonCard key={`skeleton-${i}`} />)
          ) : Object.keys(filteredOrganizations).length ? (
            (Object.entries(filteredOrganizations) as Array<
              [string, Organizations_organizations]
            >).map(([id, organization]) => (
              <OrganizationCard
                key={`card-${id}`}
                name={organization!.organization_translations![0].name}
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

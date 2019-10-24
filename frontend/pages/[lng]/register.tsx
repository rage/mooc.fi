import React, { useState, useEffect, useCallback, useContext } from "react"
import { NextPageContext as NextContext } from "next"
import { isSignedIn, isAdmin } from "/lib/authentication"
import redirect from "/lib/redirect"
import { gql } from "apollo-boost"
import { useQuery, useMutation } from "@apollo/react-hooks"
import {
  Button,
  Container,
  IconButton,
  FormControl,
  InputAdornment,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  List,
  ListItem,
  Typography,
  TextField,
} from "@material-ui/core"
import CancelIcon from "@material-ui/icons/Cancel"
import ErrorMessage from "/components/ErrorMessage"
import { Organizations } from "/static/types/generated/Organizations"
import {
  UserOrganizations,
  UserOrganizations_userOrganizations,
} from "/static/types/generated/UserOrganizations"
import useDebounce from "/util/useDebounce"
import styled from "styled-components"
import LanguageContext from "/contexes/LanguageContext"
import UserDetailContext from "/contexes/UserDetailContext"
import getRegistrationTranslator from "/translations/register"
import { WideContainer } from "/components/Container"
import Skeleton from "@material-ui/lab/Skeleton"
import { range } from "lodash"

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

const OutlinedInputLabel = styled(InputLabel)`
  background-color: #ffffff;
  padding: 0 4px 0 4px;
`

const OutlinedFormControl = styled(FormControl)`
  margin-bottom: 1rem;
`

const OutlinedFormGroup = styled(FormGroup)<{ error?: boolean }>`
  border-radius: 4px;
  border: 1px solid
    ${props => (props.error ? "#F44336" : "rgba(0, 0, 0, 0.23)")};
  padding: 18.5px 14px;
  transition: padding-left 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    border-color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    border-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;

  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.87);
  }

  &:focus {
    bordercolor: "#3f51b5";
  }

  @media (hover: none) {
    border: 1px solid rgba(0, 0, 0, 0.23);
  }
`

const OrganizationList = styled(List)`
  padding: 0px;
  max-height: 600px;
  overflow: auto;
`

const OrganizationListItem = styled(ListItem)<any>`
  padding: 0px;
`

const Header = styled(Typography)`
  margin-top: 1em;
`

const FormContainer = styled(Container)`
  spacing: 4;
`

/* const UserOrganizationList = styled(List)``

const UserOrganizationListItem = styled(ListItem)<any>`
  padding: 0px;
` */

const Register = () => {
  const { language } = useContext(LanguageContext)
  const t = getRegistrationTranslator(language)
  const { currentUser } = useContext(UserDetailContext)

  const [memberships, setMemberships] = useState<Array<string>>([])
  const [originalMemberships, setOriginalMemberships] = useState<Array<string>>(
    [],
  )
  const [organizations, setOrganizations] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState("")
  const [searchFilter, cancelFilterDebounce] = useDebounce(filter, 1000)

  const {
    data: organizationsData,
    error: organizationsError,
    loading: organizationsLoading,
  } = useQuery<Organizations>(OrganizationsQuery)
  const {
    data: userOrganizationsData,
    error: userOrganizationsError,
    loading: userOrganizationsLoading,
  } = useQuery<UserOrganizations>(UserOrganizationsQuery, {
    variables: { user_id: currentUser!.id },
  })
  const [addUserOrganization] = useMutation(AddUserOrganizationMutation)
  // @ts-ignore
  const [updateUserOrganization] = useMutation(UpdateUserOrganizationMutation)
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

    const mIds = userOrganizationsData.userOrganizations.map(
      uo => uo.organization.id,
    )

    setMemberships(mIds)
    setOriginalMemberships([...mIds])
  }, [userOrganizationsData])

  useEffect(() => {
    if (!organizationsData) {
      return
    }

    const sortedOrganizations = organizationsData
      ? organizationsData.organizations
          .filter(
            o =>
              !!o &&
              o.organization_translations &&
              o.organization_translations.length,
          )
          .sort((a, b) =>
            a!.organization_translations![0].name.localeCompare(
              b!.organization_translations![0].name,
              "fi-FI",
            ),
          )
      : []

    setOrganizations(
      sortedOrganizations.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.id]: curr!.organization_translations![0]!.name,
        }),
        {},
      ),
    )
  }, [organizationsData])

  const submit = async () => {
    const newMembershipIds = memberships.filter(
      id => !originalMemberships.includes(id),
    )
    const removedMembershipIds = originalMemberships.filter(
      id => !memberships.includes(id),
    )

    await Promise.all(
      newMembershipIds.map(id =>
        addUserOrganization({
          variables: {
            user_id: currentUser!.id,
            organization_id: id,
          },
        }),
      ),
    )
    await Promise.all(
      removedMembershipIds.map(id => {
        deleteUserOrganization({
          variables: {
            id: userOrganizationsData!.userOrganizations!.find(
              (uo: UserOrganizations_userOrganizations) =>
                uo.organization.id === id,
            )!.id,
          },
        })
      }),
    )
  }

  const toggleMembership = (id: string) => (
    // @ts-ignore
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (memberships.includes(id)) {
      setMemberships(memberships.filter(i => i !== id))
    } else {
      setMemberships(memberships.concat(id))
    }
  }

  const filteredOrganizations = useCallback(() => {
    if (searchFilter === "") {
      return organizations
    }

    return Object.entries(organizations).reduce((acc, [key, value]) => {
      if (!value.toLowerCase().includes(searchFilter.toLowerCase())) {
        return acc
      }

      return {
        ...acc,
        [key]: value,
      }
    }, {})
  }, [searchFilter, organizations])

  if (organizationsError || userOrganizationsError) {
    return <ErrorMessage />
  }

  return (
    <WideContainer>
      <Header component="h1" variant="h2" gutterBottom={true} align="center">
        placeholder title
      </Header>
      <FormContainer maxWidth="md">
        <Grid container direction="row">
          <>
            <Grid item xs={12} md={6} style={{ marginBottom: "2em" }}>
              <Typography variant="h3">{t("yourMemberships")}</Typography>
              {userOrganizationsLoading ||
              !Object.keys(organizations).length ? (
                <Typography
                  variant="body1"
                  key={`uo-skeleton`}
                  component="span"
                >
                  <Skeleton />
                </Typography>
              ) : memberships.length ? (
                memberships.map(id => (
                  <Typography variant="body1" key={`membership-${id}`}>
                    {!originalMemberships.includes(id) ? "* " : null}
                    {organizations[id]}
                  </Typography>
                ))
              ) : (
                <Typography variant="body1">{t("noMemberships")}</Typography>
              )}
              <Button style={{ marginTop: "0.5em" }} onClick={() => submit()}>
                Submit
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <OutlinedFormControl>
                <OutlinedInputLabel shrink>
                  {t("organizations")}
                </OutlinedInputLabel>
                <OutlinedFormGroup>
                  <TextField
                    name="search"
                    type="text"
                    variant="outlined"
                    value={filter}
                    autoComplete="off"
                    onChange={e => setFilter(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && cancelFilterDebounce()}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              cancelFilterDebounce("")
                              setFilter("")
                            }}
                          >
                            <CancelIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {organizationsLoading ||
                  !Object.keys(organizations).length ? (
                    range(8).map(id => <Skeleton key={`skeleton-${id}`} />)
                  ) : (
                    <OrganizationList>
                      {(Object.entries(filteredOrganizations()) as Array<
                        [string, string]
                      >).map(([id, name]) => (
                        <OrganizationListItem key={id}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={memberships.includes(id)}
                                onChange={toggleMembership(id)}
                                value={id}
                              />
                            }
                            label={name}
                            key={id}
                          />
                        </OrganizationListItem>
                      ))}
                    </OrganizationList>
                  )}
                </OutlinedFormGroup>
              </OutlinedFormControl>
            </Grid>
          </>
        </Grid>
      </FormContainer>
    </WideContainer>
  )
}

Register.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
  }
}

export default Register

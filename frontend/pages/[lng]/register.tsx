import React, { useState, useEffect } from "react"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import {
  Container,
  FormControl,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  List,
  ListItem,
  Typography,
} from "@material-ui/core"
import ErrorMessage from "/components/ErrorMessage"
import { Organizations } from "/static/types/generated/Organizations"
import { UserOrganizations } from "/static/types/generated/UserOrganizations"
import styled from "styled-components"

export const OrganizationsQuery = gql`
  query Organizations {
    organizations {
      id
      slug
      organization_translations {
        language
        name
        information
      }
    }
  }
`

export const UserOrganizationsQuery = gql`
  query UserOrganizations($userId: ID) {
    userOrganizations(user_id: $userId) {
      id
      organization {
        id
      }
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
  max-height: 800px;
  overflow: auto;
`

const OrganizationListItem = styled(ListItem)<any>`
  padding: 0px;
`

const Register = () => {
  const [memberships, setMemberships] = useState<Array<string>>([])
  const [organizations, setOrganizations] = useState<Record<string, string>>({})

  const {
    data: organizationsData,
    error: organizationsError,
    loading: organizationsLoading,
  } = useQuery<Organizations>(OrganizationsQuery)
  const {
    data: userOrganizationsData,
    error: userOrganizationsError,
    loading: userOrganizationsLoading,
  } = useQuery<UserOrganizations>(UserOrganizationsQuery)

  if (organizationsError || userOrganizationsError) {
    return <ErrorMessage />
  }

  if (organizationsLoading || userOrganizationsLoading) {
    return <div>loading</div>
  }

  // TODO: do something else
  useEffect(() => {
    if (
      !userOrganizationsData ||
      (userOrganizationsData && Object.keys(organizations).length)
    ) {
      return
    }

    setMemberships(
      userOrganizationsData.userOrganizations.map(uo => uo.organization.id),
    )
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
          [curr.id]: curr!.organization_translations![0].name,
        }),
        {},
      ),
    )
  }, [organizations, userOrganizationsData])

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

  return (
    <Container maxWidth="md">
      <div style={{ marginTop: "2em" }}>&nbsp;</div>
      <Grid container direction="row">
        {!Object.keys(organizations).length ? (
          <div>loading</div>
        ) : (
          <>
            <Grid item xs={12} md={6}>
              <Typography variant="h3">Your memberships</Typography>
              {memberships.length ? (
                memberships.map(id => (
                  <Typography variant="body1">{organizations[id]}</Typography>
                ))
              ) : (
                <Typography variant="body1">No memberships</Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <OutlinedFormControl>
                <OutlinedInputLabel shrink>Organizations</OutlinedInputLabel>
                <OutlinedFormGroup>
                  <OrganizationList>
                    {Object.keys(organizations).map(id => (
                      <OrganizationListItem key={id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={memberships.includes(id)}
                              onChange={toggleMembership(id)}
                              value={id}
                            />
                          }
                          label={organizations[id]}
                          key={id}
                        />
                      </OrganizationListItem>
                    ))}
                  </OrganizationList>
                </OutlinedFormGroup>
              </OutlinedFormControl>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  )
}

export default Register

import React, { useState, useEffect } from "react"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import {
  Container,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@material-ui/core"
import ErrorMessage from "/components/ErrorMessage"
import { Organizations } from "/static/types/generated/Organizations"
import { UserOrganizations } from "/static/types/generated/UserOrganizations"

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

const Register = () => {
  const [memberships, setMemberships] = useState<Array<string>>([])

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
    if (userOrganizationsData) {
      setMemberships(
        userOrganizationsData.userOrganizations.map(uo => uo.organization.id),
      )
    }
  }, [])

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
            "fi",
          ),
        )
    : []

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
      <Grid container direction="row">
        <FormControl component="fieldset">
          <FormLabel component="legend">Organizations</FormLabel>
          <FormGroup>
            {sortedOrganizations.map(o => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={memberships.includes(o.id)}
                    onChange={toggleMembership(o.id)}
                    value={o.id}
                  />
                }
                label={o!.organization_translations![0].name}
                key={o.id}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Grid>
    </Container>
  )
}

export default Register

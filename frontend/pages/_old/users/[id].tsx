import { useState } from "react"

import { useApolloClient, useQuery } from "@apollo/client"
import { Button, CircularProgress, Grid } from "@mui/material"

import Container from "/components/Container"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useIsOld from "/hooks/useIsOld"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withAdmin from "/lib/with-admin"
import CommonTranslations from "/translations/common"
import { isDefinedAndNotEmpty } from "/util/guards"

import {
  UserProfileUserCourseSettingsDocument,
  UserProfileUserCourseSettingsQueryNodeFieldsFragment,
} from "/graphql/generated"

function hasNode<T>(data: { node?: T | null } | null): data is { node: T } {
  return isDefinedAndNotEmpty(data?.node)
}

const filterEdges = (
  edges?: Array<{
    node: UserProfileUserCourseSettingsQueryNodeFieldsFragment | null
  } | null> | null,
) => {
  return (edges ?? []).filter(hasNode).filter(isDefinedAndNotEmpty) ?? []
}

const UserPage = () => {
  const isOld = useIsOld()
  const baseUrl = isOld ? "/_old" : "/admin"
  const id = useQueryParameter("id")
  const client = useApolloClient()
  const t = useTranslator(CommonTranslations)

  // TODO: typing, this "more" isn't actually used anywhere?
  // @ts-ignore: not used
  const [more, setMore] = useState<
    Array<{ node: UserProfileUserCourseSettingsQueryNodeFieldsFragment }>
  >([])

  const { loading, error, data } = useQuery(
    UserProfileUserCourseSettingsDocument,
    { variables: { upstream_id: Number(id) } },
  )

  useBreadcrumbs([
    {
      translation: "users",
    },
    {
      label: id,
      href: `${baseUrl}/users/${id}`,
    },
  ])

  // TODO: edit query to get username for title?
  if (error) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(error, undefined, 2)}
      />
    )
  }

  if (loading || !data) {
    return (
      <Container style={{ display: "flex", height: "600px" }}>
        <Grid item container justifyContent="center" alignItems="center">
          <CircularProgress color="primary" size={60} />
        </Grid>
      </Container>
    )
  }

  return (
    <>
      <Container>
        <pre>
          {JSON.stringify(data?.userCourseSettings?.edges, undefined, 2)}
        </pre>
        <Button
          variant="contained"
          onClick={async () => {
            const { data } = await client.query({
              query: UserProfileUserCourseSettingsDocument,
              variables: { upstream_id: Number(id) },
            })
            setMore((existing) => [
              ...existing,
              ...filterEdges(data?.userCourseSettings?.edges),
            ])
          }}
          disabled={false}
        >
          {t("loadMore")}
        </Button>
      </Container>
    </>
  )
}

export default withAdmin(UserPage)

import { useState } from "react"

import { gql, useApolloClient, useQuery } from "@apollo/client"
import { CircularProgress, Grid } from "@mui/material"
import Button from "@mui/material/Button"

import Container from "/components/Container"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { UserProfileUserCourseSettingsQuery } from "/graphql/queries/userCourseSetting"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withAdmin from "/lib/with-admin"
import { UserCourseSettingsForUserPage } from "/static/types/generated/UserCourseSettingsForUserPage"
import CommonTranslations from "/translations/common"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"

const UserPage = () => {
  const id = useQueryParameter("id")
  const client = useApolloClient()
  const t = useTranslator(CommonTranslations)

  const [more, setMore]: any[] = useState([])

  const { loading, error, data } = useQuery<UserCourseSettingsForUserPage>(
    UserProfileUserCourseSettingsQuery,
    { variables: { upstream_id: Number(id) } },
  )

  useBreadcrumbs([
    {
      translation: "users",
    },
    {
      label: id,
      href: `/users/${id}`,
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

  // TODO: this doesn't work
  // data?.userCourseSettings?.edges?.push(...more)

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
              query: UserProfileUserCourseSettingsQuery,
              variables: { upstream_id: Number(id) },
            })
            let newData = more
            newData.push(...data.userCourseSettings.edges)
            setMore(newData)
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

import * as React from "react"
import Container from "/components/Container"
import gql from "graphql-tag"
import { useQuery, useApolloClient } from "@apollo/react-hooks"
import { UserCourseSettingsesForUserPage } from "/static/types/generated/UserCourseSettingsesForUserPage"
import { Grid } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import { CircularProgress } from "@material-ui/core"
import { useQueryParameter } from "/util/useQueryParameter"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import withAdmin from "/lib/with-admin"
import getCommonTranslator from "/translations/common"
import { useContext } from "react"
import LanguageContext from "/contexes/LanguageContext"

const UserPage = () => {
  const id = useQueryParameter("id")
  const client = useApolloClient()
  const { language } = useContext(LanguageContext)
  const t = getCommonTranslator(language)

  const [more, setMore]: any[] = React.useState([])

  const { loading, error, data } = useQuery<UserCourseSettingsesForUserPage>(
    GET_DATA,
    { variables: { upstream_id: Number(id) } },
  )

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
        <Grid item container justify="center" alignItems="center">
          <CircularProgress color="primary" size={60} />
        </Grid>
      </Container>
    )
  }

  data?.UserCourseSettingses?.edges?.push(...more)

  return (
    <>
      <Container>
        <pre>
          {JSON.stringify(data?.UserCourseSettingses?.edges, undefined, 2)}
        </pre>
        <Button
          variant="contained"
          onClick={async () => {
            const { data } = await client.query({
              query: GET_DATA,
              variables: { upstream_id: Number(id) },
            })
            let newData = more
            newData.push(...data.UserCourseSettingses.edges)
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

const GET_DATA = gql`
  query UserCourseSettingsesForUserPage($upstream_id: Int) {
    UserCourseSettingses(user_upstream_id: $upstream_id, first: 50) {
      edges {
        node {
          id
          course {
            name
          }
          language
          country
          research
          marketing
          course_variant
          other
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`

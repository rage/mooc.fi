import Container from "/components/Container"
import { Completions } from "/components/Home/Completions"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import Spinner from "/components/Spinner"
import { UserOverViewQuery } from "/graphql/queries/currentUser"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withSignedIn from "/lib/with-signed-in"
import { CurrentUserUserOverView as UserOverViewData } from "/static/types/generated/CurrentUserUserOverView"
import { useQuery } from "@apollo/client"

function CompletionsPage() {
  const { loading, error, data } = useQuery<UserOverViewData>(UserOverViewQuery)

  useBreadcrumbs([
    {
      translation: "profile",
      href: "/profile",
    },
    {
      translation: "profileCompletions",
      href: `/profile/completions`,
    },
  ])

  if (error) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(error, undefined, 2)}
      />
    )
  }

  if (loading || !data) {
    return <Spinner />
  }

  const completions = data?.currentUser?.completions ?? []

  return (
    <>
      <Container>
        <div>
          <Completions completions={completions} />
        </div>
      </Container>
    </>
  )
}

export default withSignedIn(CompletionsPage)

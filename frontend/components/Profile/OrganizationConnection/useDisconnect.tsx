import { gql, useMutation } from "@apollo/client"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useLanguageContext } from "/contexts/LanguageContext"
import { UserOverViewQuery } from "/graphql/queries/currentUser"
import { DeleteVerifiedUser } from "/static/types/generated/DeleteVerifiedUser"
import { ProfileUserOverView_currentUser_verified_users } from "/static/types/generated/ProfileUserOverView"

export const DeleteVerifiedUserMutation = gql`
  mutation DeleteVerifiedUser($personal_unique_code: String!) {
    deleteVerifiedUser(personal_unique_code: $personal_unique_code) {
      id
      personal_unique_code
    }
  }
`

export default function () {
  const { language } = useLanguageContext()
  const router = useRouter()

  const [
    deleteVerifiedUser,
    { data: deleteData, error: deleteError },
  ] = useMutation<DeleteVerifiedUser>(DeleteVerifiedUserMutation, {
    refetchQueries: [
      {
        query: UserOverViewQuery,
      },
    ],
  })
  const onDisconnect = async (
    user: ProfileUserOverView_currentUser_verified_users,
  ) =>
    deleteVerifiedUser({
      variables: { personal_unique_code: user.personal_unique_code },
    })

  useEffect(() => {
    if (deleteError) {
      router.replace(`/${language}/profile/disconnect/failure`, undefined, {
        shallow: true,
      })
    }
    if (deleteData) {
      router.replace(`/${language}/profile/disconnect/success`, undefined, {
        shallow: true,
      })
    }
  }, [deleteError, deleteData])

  return {
    onDisconnect,
  }
}

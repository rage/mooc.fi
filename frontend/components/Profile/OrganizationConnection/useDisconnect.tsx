import { FetchResult, gql, useMutation } from "@apollo/client"
import { useRouter } from "next/router"
import { useEffect } from "react"
// import { LOGOUT_URL, FRONTEND_URL } from "/config"
import { useLanguageContext } from "/contexts/LanguageContext"
import { UserOverViewQuery } from "../../../graphql/queries/user"
import { DeleteVerifiedUser } from "/static/types/generated/DeleteVerifiedUser"
import { CurrentUserUserOverView_currentUser_verified_users } from "/static/types/generated/CurrentUserUserOverView"

export const DeleteVerifiedUserMutation = gql`
  mutation DeleteVerifiedUser($personal_unique_code: String!) {
    deleteVerifiedUser(personal_unique_code: $personal_unique_code) {
      id
      personal_unique_code
    }
  }
`

export default function useDisconnect() {
  const { language } = useLanguageContext()
  const router = useRouter()

  const [deleteVerifiedUser, { data: deleteData, error: deleteError }] =
    useMutation<DeleteVerifiedUser>(DeleteVerifiedUserMutation, {
      refetchQueries: [
        {
          query: UserOverViewQuery,
        },
      ],
    })
  const onDisconnect = async (
    user: CurrentUserUserOverView_currentUser_verified_users,
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
      // window.location.href = `${LOGOUT_URL}${FRONTEND_URL}/${language}/profile/disconnect/success`

      router.replace(`/${language}/profile/disconnect/success`, undefined, {
        shallow: true,
      })
    }
  }, [deleteError, deleteData])

  return {
    onDisconnect,
  }
}

export type DisconnectFunction = (
  user: CurrentUserUserOverView_currentUser_verified_users,
) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>

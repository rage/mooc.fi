import { useEffect } from "react"

// import { LOGOUT_URL, FRONTEND_URL } from "/config"
import { useLanguageContext } from "/contexts/LanguageContext"
import { CurrentUserUserOverView_currentUser_verified_users } from "/static/types/generated/CurrentUserUserOverView"
import { DeleteVerifiedUser } from "/static/types/generated/DeleteVerifiedUser"
import { useRouter } from "next/router"

import { FetchResult, gql, useMutation } from "@apollo/client"

import { UserOverViewQuery } from "../../../graphql/queries/user"

export const DeleteVerifiedUserMutation = gql`
  mutation DeleteVerifiedUser($edu_person_principal_name: String!) {
    deleteVerifiedUser(edu_person_principal_name: $edu_person_principal_name) {
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
      variables: { edu_person_principal_name: user.edu_person_principal_name },
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

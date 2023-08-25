import { useMemo, useReducer, useRef, useState } from "react"

import { useMutation } from "@apollo/client"

import { useLoginStateContext } from "/contexts/LoginStateContext"
import { updateAccount } from "/lib/account"
import { createCertificate } from "/lib/certificates"

import {
  CompletionDetailedFieldsFragment,
  CourseCoreFieldsFragment,
  CurrentUserDetailedDocument,
  CurrentUserDocument,
  CurrentUserOverviewDocument,
  UpdateUserNameDocument,
  User,
} from "/graphql/generated"

type Status =
  | "IDLE"
  | "CHECKING"
  | "AVAILABLE"
  | "NOT_AVAILABLE"
  | "GENERATING"
  | "UPDATING_NAME"
  | "ERROR"
type ActionType =
  | "RESET"
  | "RECEIVE_CERTIFICATE_ID"
  | "GENERATE_CERTIFICATE"
  | "RECEIVE_GENERATED_CERTIFICATE"
  | "UPDATE_NAME"
  | "UPDATED_NAME"
  | "ERROR"

type Action = {
  type: ActionType
  payload?: any
}

interface CertificateState {
  status: Status
  certificateId?: string
  error?: string
}

const reducer = (state: CertificateState, action: Action): CertificateState => {
  switch (action.type) {
    case "RESET":
      return action?.payload
    case "GENERATE_CERTIFICATE":
      return {
        ...state,
        status: "GENERATING",
        certificateId: undefined,
        error: undefined,
      }
    case "RECEIVE_GENERATED_CERTIFICATE":
      return {
        ...state,
        status: "IDLE",
        certificateId: action?.payload?.id,
        error: undefined,
      }
    case "UPDATE_NAME":
      return {
        ...state,
        status: "UPDATING_NAME",
        error: undefined,
      }
    case "UPDATED_NAME":
      return {
        ...state,
        status: "IDLE",
        error: undefined,
      }
    case "ERROR":
      return {
        ...state,
        status: "ERROR",
        error: action.payload,
      }
    default:
      return state
  }
}

interface UseCertificateOptions {
  course: CourseCoreFieldsFragment
  completion: CompletionDetailedFieldsFragment
  user?: User
  onUpdateNameSuccess?: (...args: any[]) => any
  onUpdateNameError?: (...args: any[]) => any
  onReceiveGeneratedCertificateSuccess?: (...args: any[]) => any
  onReceiveGeneratedCertificateError?: (...args: any[]) => any
}

export const useCertificate = ({
  course,
  completion,
  onUpdateNameSuccess,
  onUpdateNameError,
  onReceiveGeneratedCertificateSuccess,
  onReceiveGeneratedCertificateError,
}: UseCertificateOptions) => {
  const initialState = useRef<CertificateState>({
    status: "IDLE",
    certificateId:
      completion?.certificate_availability?.existing_certificate ?? undefined,
  })
  const { currentUser, updateUser, admin } = useLoginStateContext()

  const [state, dispatch] = useReducer(reducer, initialState.current)
  const [firstName, setFirstName] = useState(currentUser?.first_name ?? "")
  const [lastName, setLastName] = useState(currentUser?.last_name ?? "")

  const [updateUserName] = useMutation(UpdateUserNameDocument, {
    refetchQueries: [
      { query: CurrentUserDocument },
      { query: CurrentUserDetailedDocument },
      { query: CurrentUserOverviewDocument },
    ],
  })

  const isNameChanged = useMemo(
    () =>
      (currentUser?.first_name ?? "") !== firstName ||
      (currentUser?.last_name ?? "") !== lastName,
    [currentUser?.first_name, currentUser?.last_name, firstName, lastName],
  )
  const isNameEmpty = useMemo(
    () => firstName === "" && lastName === "",
    [firstName, lastName],
  )

  // TODO: update updateaccount, updateusername etc. to be able to update info on other than own, ie. admin can create certficate and update information
  const onSubmit = async () => {
    if (isNameEmpty) {
      return
    }

    if (isNameChanged) {
      try {
        if (!currentUser) {
          throw new Error("No current user")
        }

        dispatch({ type: "UPDATE_NAME" })
        const res = await updateAccount(firstName, lastName)
        await updateUserName({
          variables: {
            first_name: firstName,
            last_name: lastName,
          },
        })

        updateUser({
          user: {
            ...currentUser,
            first_name: firstName,
            last_name: lastName,
          },
          admin,
        })
        onUpdateNameSuccess?.()
        dispatch({ type: "UPDATED_NAME", payload: res })
      } catch (e) {
        dispatch({ type: "ERROR", payload: e })
        onUpdateNameError?.()
        dispatch({ type: "RESET", payload: initialState })
        return
      }
    }

    try {
      dispatch({ type: "GENERATE_CERTIFICATE" })
      const res = await createCertificate(course.slug)
      if (!res) {
        throw new Error("No generated certificate received")
      }
      dispatch({ type: "RECEIVE_GENERATED_CERTIFICATE", payload: res })
      onReceiveGeneratedCertificateSuccess?.()
      initialState.current = {
        ...initialState.current,
        certificateId: res?.id ?? undefined,
      }
    } catch (e) {
      dispatch({ type: "ERROR", payload: e })
      onReceiveGeneratedCertificateError?.()
      dispatch({ type: "RESET", payload: initialState })
    }
  }

  return {
    state,
    dispatch,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    onSubmit,
    isNameChanged,
    isNameEmpty,
  }
}

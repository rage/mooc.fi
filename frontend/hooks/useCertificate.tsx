import { useContext, useEffect, useMemo, useReducer, useState } from "react"

import { useMutation } from "@apollo/client"

import LoginStateContext from "/contexts/LoginStateContext"
import { updateAccount } from "/lib/account"
import { checkCertificate, createCertificate } from "/lib/certificates"

import {
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
  | "CHECK_CERTIFICATE"
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

const initialState: CertificateState = {
  status: "IDLE",
}

const reducer = (state: CertificateState, action: Action): CertificateState => {
  switch (action.type) {
    case "RESET":
      return initialState
    case "CHECK_CERTIFICATE":
      return {
        ...state,
        status: "CHECKING",
      }
    case "RECEIVE_CERTIFICATE_ID":
      return {
        ...state,
        status: "IDLE",
        certificateId: action?.payload,
        error: undefined,
      }
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
  user?: User
  onCertificateCheckSuccess?: (...args: any[]) => any
  onCertificateCheckError?: (...args: any[]) => any
  onUpdateNameSuccess?: (...args: any[]) => any
  onUpdateNameError?: (...args: any[]) => any
  onReceiveGeneratedCertificateSuccess?: (...args: any[]) => any
  onReceiveGeneratedCertificateError?: (...args: any[]) => any
}

export const useCertificate = ({
  course,
  onCertificateCheckSuccess = () => {},
  onCertificateCheckError = () => {},
  onUpdateNameSuccess = () => {},
  onUpdateNameError = () => {},
  onReceiveGeneratedCertificateSuccess = () => {},
  onReceiveGeneratedCertificateError = () => {},
}: UseCertificateOptions) => {
  const { currentUser, updateUser, admin } = useContext(LoginStateContext)

  const [state, dispatch] = useReducer(reducer, initialState)
  const [firstName, setFirstName] = useState(currentUser?.first_name ?? "")
  const [lastName, setLastName] = useState(currentUser?.last_name ?? "")

  const [updateUserName] = useMutation(UpdateUserNameDocument, {
    refetchQueries: [
      { query: CurrentUserDocument },
      { query: CurrentUserDetailedDocument },
      { query: CurrentUserOverviewDocument },
    ],
  })

  useEffect(() => {
    dispatch({ type: "CHECK_CERTIFICATE" })
    checkCertificate(course.slug)
      .then((res: any) => {
        dispatch({
          type: "RECEIVE_CERTIFICATE_ID",
          payload: res?.existing_certificate,
        })
        onCertificateCheckSuccess()
      })
      .catch((e: any) => {
        dispatch({ type: "ERROR", payload: e })
        console.error("error?", e)
        onCertificateCheckError()
        dispatch({ type: "RESET" })
      })
  }, [])

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
        dispatch({ type: "UPDATE_NAME" })
        const res = await updateAccount(firstName, lastName)
        await updateUserName({
          variables: {
            first_name: firstName,
            last_name: lastName,
          },
        })
        updateUser({
          user: { ...currentUser!, first_name: firstName, last_name: lastName },
          admin,
        })
        onUpdateNameSuccess()
        dispatch({ type: "UPDATED_NAME", payload: res })
      } catch (e) {
        dispatch({ type: "ERROR", payload: e })
        onUpdateNameError()
        dispatch({ type: "RESET" })
        return
      }
    }

    try {
      dispatch({ type: "GENERATE_CERTIFICATE" })
      const res = await createCertificate(course.slug)
      dispatch({ type: "RECEIVE_GENERATED_CERTIFICATE", payload: res })
      onReceiveGeneratedCertificateSuccess()
    } catch (e) {
      dispatch({ type: "ERROR", payload: e })
      onReceiveGeneratedCertificateError()
      dispatch({ type: "RESET" })
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

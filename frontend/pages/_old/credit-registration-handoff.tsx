import { useEffect, useRef, useState } from "react"

import fetch from "isomorphic-unfetch"
import { useRouter } from "next/router"

import { useApolloClient } from "@apollo/client"

import RegisterCompletion from "/components/Home/RegisterCompletion"
import {
  CallToActionButton,
  Card,
  Header,
  InstructionsSection,
  PageTitle,
  Prose,
} from "/components/RegisterCompletion/styles"
import Spinner from "/components/Spinner"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useTranslator } from "/hooks/useTranslator"
import { clearSession, getAccessToken, startSession } from "/lib/authentication"
import redirect from "/lib/redirect"
import RegisterCompletionTranslations from "/translations/register-completion"

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.mooc.fi"
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL ?? "http://localhost:4000"

type HandoffState =
  | { status: "redeeming" }
  | { status: "differentAccount"; continuation: string }
  | { status: "continuing"; continuation: string }
  | { status: "expired" }
  | { status: "failed" }

// Paths come from our own backend; still, only follow one that stays on this site.
const isSitePath = (path: unknown): path is string =>
  typeof path === "string" && /^\/(?![/\\])/.test(path)

/**
 * Where courses.mooc.fi sends a student it hands back to mooc.fi. Signs them in as the account the
 * handoff names and continues to the destination the backend resolved.
 */
function CreditRegistrationHandoffPage() {
  const t = useTranslator(RegisterCompletionTranslations)
  const router = useRouter()
  const apollo = useApolloClient()
  const { currentUser } = useLoginStateContext()
  const [state, setState] = useState<HandoffState>({ status: "redeeming" })
  const hasStarted = useRef(false)

  const localePrefix =
    router.locale && router.locale !== router.defaultLocale
      ? `/${router.locale}`
      : ""

  const handleAnswer = async (res: Response) => {
    const body = await res.json().catch(() => ({}))

    if (res.ok && isSitePath(body.destination_path)) {
      const destination = `${localePrefix}${body.destination_path}`
      if (body.result === "continue") {
        window.location.replace(destination)
        return
      }
      if (
        body.result === "signed_in" &&
        typeof body.access_token === "string"
      ) {
        await startSession(body.access_token, apollo, body.expires_in)
        window.location.replace(destination)
        return
      }
      if (
        body.result === "different_account" &&
        typeof body.continuation === "string"
      ) {
        setState({
          status: "differentAccount",
          continuation: body.continuation,
        })
        return
      }
    }

    // TMC will not sign this account in for them, so they sign in with their password.
    if (
      res.status === 403 &&
      body.type === "sign_in_required" &&
      isSitePath(body.destination_path)
    ) {
      clearSession()
      redirect({
        context: {
          pathname: body.destination_path,
          asPath: body.destination_path,
        },
        target: "/sign-in",
      })
      return
    }

    if (res.status === 400 || res.status === 410) {
      setState({ status: "expired" })
      return
    }
    setState({ status: "failed" })
  }

  useEffect(() => {
    if (hasStarted.current) {
      return
    }
    hasStarted.current = true

    const token = new URLSearchParams(window.location.hash.slice(1)).get(
      "token",
    )
    // The token signs the student in, so keep it out of history, bookmarks and shared links.
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname + window.location.search,
    )
    if (!token) {
      setState({ status: "expired" })
      return
    }

    const accessToken = getAccessToken()
    fetch(`${BASE_URL}/api/courses-handoff/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ token }),
    })
      .then(handleAnswer)
      .catch(() => setState({ status: "failed" }))
  }, [])

  // The other account stays signed in until the new session replaces it.
  const logOutAndContinue = (continuation: string) => {
    setState({ status: "continuing", continuation })
    fetch(`${BASE_URL}/api/courses-handoff/continue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ continuation }),
    })
      .then(handleAnswer)
      .catch(() => setState({ status: "failed" }))
  }

  if (state.status === "redeeming") {
    return <Spinner />
  }

  if (state.status === "differentAccount" || state.status === "continuing") {
    return (
      <RegisterCompletion pageTitle={t("handoffDifferentAccountTitle")}>
        <Card>
          <Header>
            <PageTitle>{t("handoffDifferentAccountTitle")}</PageTitle>
          </Header>
          <InstructionsSection>
            <Prose>
              {currentUser?.email
                ? t("handoffDifferentAccountBody", { email: currentUser.email })
                : t("handoffDifferentAccountBodyNoEmail")}
            </Prose>
            <Prose>{t("handoffDifferentAccountAction")}</Prose>
            <CallToActionButton
              variant="contained"
              color="primary"
              size="medium"
              disabled={state.status === "continuing"}
              onClick={() => logOutAndContinue(state.continuation)}
            >
              {state.status === "continuing"
                ? t("handoffContinuing")
                : t("handoffLogOutAndContinue")}
            </CallToActionButton>
          </InstructionsSection>
        </Card>
      </RegisterCompletion>
    )
  }

  const title =
    state.status === "expired"
      ? t("handoffExpiredTitle")
      : t("handoffFailedTitle")

  return (
    <RegisterCompletion pageTitle={title}>
      <Card>
        <Header>
          <PageTitle>{title}</PageTitle>
        </Header>
        <InstructionsSection>
          <Prose>
            {state.status === "expired"
              ? t("handoffExpiredBody")
              : t("handoffFailedBody")}
          </Prose>
          <CallToActionButton
            variant="contained"
            color="primary"
            size="medium"
            href={`${localePrefix}/profile/`}
          >
            {t("handoffGoToProfile")}
          </CallToActionButton>
        </InstructionsSection>
      </Card>
    </RegisterCompletion>
  )
}

export default CreditRegistrationHandoffPage

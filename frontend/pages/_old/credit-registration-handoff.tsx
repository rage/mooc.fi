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
import { endSession, getAccessToken, startSession } from "/lib/authentication"
import redirect from "/lib/redirect"
import { toSitePath } from "/lib/sitePath"
import RegisterCompletionTranslations from "/translations/register-completion"

type HandoffState =
  | { status: "redeeming" }
  | {
      status: "confirm"
      /** Whether another account is signed in, rather than none. */
      isDifferentAccount: boolean
      continuation: string
      /** Of the account the handoff signs in. */
      email: string | null
      continuing: "idle" | "pending" | "failed"
    }
  | { status: "expired" }
  | { status: "ip_mismatch" }
  | { status: "failed" }

// Same origin, not BACKEND_URL: the redeem must carry the cookie middleware.ts set on this page.
const REDEEM_URL = "/api/courses-handoff/redeem"
const CONTINUE_URL = "/api/courses-handoff/continue"

/**
 * Where courses.mooc.fi sends a student it hands back to mooc.fi. Signs them in as the account the
 * handoff names, after they confirm it unless they came straight from courses.mooc.fi, and
 * continues to the destination the backend resolved.
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
    // Paths come from our own backend; still, only follow one that stays on this site.
    const destinationPath = toSitePath(body.destination_path)

    if (res.ok && destinationPath) {
      const destination = `${localePrefix}${destinationPath}`
      if (body.result === "continue") {
        window.location.replace(destination)
        return
      }
      if (
        body.result === "signed_in" &&
        typeof body.access_token === "string"
      ) {
        // Not a retryable failure: the redeem or continuation is already spent.
        await startSession(body.access_token, apollo).then(
          () => window.location.replace(destination),
          () => setState({ status: "failed" }),
        )
        return
      }
      if (
        (body.result === "confirm" || body.result === "different_account") &&
        typeof body.continuation === "string"
      ) {
        setState({
          status: "confirm",
          isDifferentAccount: body.result === "different_account",
          continuation: body.continuation,
          email: typeof body.email === "string" ? body.email : null,
          continuing: "idle",
        })
        return
      }
    }

    // TMC will not sign this account in for them, so they sign in with their password.
    if (
      res.status === 403 &&
      body.type === "sign_in_required" &&
      destinationPath
    ) {
      endSession()
      redirect({
        context: {
          pathname: destinationPath,
          asPath: destinationPath,
        },
        target: "/sign-in",
      })
      return
    }

    if (res.status === 410 && body.type === "ip_mismatch") {
      setState({ status: "ip_mismatch" })
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
    fetch(REDEEM_URL, {
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

  // Any other account stays signed in until the new session replaces it.
  const continueWithHandoffAccount = (
    confirmState: Extract<HandoffState, { status: "confirm" }>,
  ) => {
    const { continuation } = confirmState
    setState({ ...confirmState, continuing: "pending" })
    fetch(CONTINUE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ continuation }),
    })
      .then((res) =>
        // The backend leaves the continuation unused on these, so the student can retry.
        res.status === 429 || res.status === 502
          ? Promise.reject()
          : handleAnswer(res),
      )
      .catch(() => setState({ ...confirmState, continuing: "failed" }))
  }

  if (state.status === "redeeming") {
    return <Spinner />
  }

  if (state.status === "confirm") {
    const { isDifferentAccount, email, continuing } = state
    const confirmTitle = isDifferentAccount
      ? t("handoffDifferentAccountTitle")
      : t("handoffConfirmTitle")
    const signsInAs = email
      ? t("handoffSignsInAs", { email })
      : t("handoffSignsIn")
    const explanation = isDifferentAccount
      ? [
          currentUser?.email
            ? t("handoffDifferentAccountBody", { email: currentUser.email })
            : t("handoffDifferentAccountBodyNoEmail"),
          signsInAs,
        ]
      : [signsInAs]
    const actionLabel = isDifferentAccount
      ? t("handoffLogOutAndContinue")
      : email
      ? t("handoffContinueAs", { email })
      : t("handoffContinue")

    return (
      <RegisterCompletion pageTitle={confirmTitle}>
        <Card>
          <Header>
            <PageTitle>{confirmTitle}</PageTitle>
          </Header>
          <InstructionsSection>
            {explanation.map((paragraph) => (
              <Prose key={paragraph}>{paragraph}</Prose>
            ))}
            {continuing === "failed" && (
              <Prose role="alert">{t("handoffContinueFailed")}</Prose>
            )}
            <CallToActionButton
              variant="contained"
              color="primary"
              size="medium"
              disabled={continuing === "pending"}
              onClick={() => continueWithHandoffAccount(state)}
            >
              {continuing === "pending" ? t("handoffContinuing") : actionLabel}
            </CallToActionButton>
          </InstructionsSection>
        </Card>
      </RegisterCompletion>
    )
  }

  const { title, body } = {
    expired: { title: t("handoffExpiredTitle"), body: t("handoffExpiredBody") },
    ip_mismatch: {
      title: t("handoffIpMismatchTitle"),
      body: t("handoffIpMismatchBody"),
    },
    failed: { title: t("handoffFailedTitle"), body: t("handoffFailedBody") },
  }[state.status]

  return (
    <RegisterCompletion pageTitle={title}>
      <Card>
        <Header>
          <PageTitle>{title}</PageTitle>
        </Header>
        <InstructionsSection>
          <Prose>{body}</Prose>
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

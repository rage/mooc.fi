import { useEffect, useState } from "react"

import fetch from "isomorphic-unfetch"
import { useRouter } from "next/router"

import { useMutation, useQuery } from "@apollo/client"
import { Paper, SvgIcon, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import RegisterCompletion from "/components/Home/RegisterCompletion"
import ImportantNotice from "/components/ImportantNotice"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import OutboundLink from "/components/OutboundLink"
import RegisterCompletionText from "/components/RegisterCompletionText"
import Spinner from "/components/Spinner"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withSignedIn from "/lib/with-signed-in"
import RegisterCompletionTranslations from "/translations/register-completion"
import { getCookie } from "/util/cookie"

import {
  CourseFromSlugDocument,
  CreateRegistrationAttemptDateDocument,
  CurrentUserOverviewDocument,
} from "/graphql/generated"

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.mooc.fi"
    : "http://localhost:4000"

const StyledPaper = styled(Paper)`
  padding: 1em;
  margin: 1em;
`

const StyledPaperRow = styled(Paper)`
  padding: 1em;
  margin: 1em;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Row = styled("span")`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const StyledPaperColumn = styled(Paper)`
  padding: 1em;
  margin: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledIcon = styled(SvgIcon)`
  width: 30px;
  height: 30px;
  margin: 0.5em;
`

const StyledText = styled(Typography)`
  margin-top: 0px;
  margin-left: 1em;
` as typeof Typography

const CompletionLinkText = styled(Typography)`
  display: flex;
  flex-flow: wrap;
  justify-content: center;
`

function CompletionLinkColumn() {
  const t = useTranslator(RegisterCompletionTranslations)

  return (
    <StyledPaperColumn>
      <CompletionLinkText variant="body1">
        {t("see_completion_link")}{" "}
        <OutboundLink
          href="https://opintopolku.fi/oma-opintopolku/"
          label={t("see_completion_link")}
          rel="noopener noreferrer"
        >
          opintopolku.fi/oma-opintopolku/
        </OutboundLink>
      </CompletionLinkText>
      <Row>
        <StyledIcon color="primary">
          <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
        </StyledIcon>

        <Typography
          variant="body2"
          dangerouslySetInnerHTML={{ __html: t("see_completion_NB") }}
        />
      </Row>
    </StyledPaperColumn>
  )
}

function RegisterCompletionPage() {
  const accessToken = getCookie("access_token")
  const { currentUser } = useLoginStateContext()
  const [instructions, setInstructions] = useState("")
  const [tiers, setTiers] = useState([])

  const courseSlug = encodeURIComponent(
    useQueryParameter("slug") ?? "",
  ).replace(/\./g, "")

  const t = useTranslator(RegisterCompletionTranslations)
  const {
    loading: courseLoading,
    error: courseError,
    data: courseData,
  } = useQuery(CourseFromSlugDocument, {
    variables: {
      slug: courseSlug,
    },
  })
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(CurrentUserOverviewDocument)
  const [createRegistrationAttemptDate] = useMutation(
    CreateRegistrationAttemptDateDocument,
  )
  const { locale } = useRouter()

  const course_exists = Boolean(courseData?.course?.id)

  const completion =
    userData?.currentUser?.completions?.find(
      (c) => c.course?.slug == courseSlug,
    ) ?? undefined

  const onRegistrationClick = () => {
    if (!completion?.id) {
      return
    }

    createRegistrationAttemptDate({
      variables: {
        id: completion.id,
        completion_registration_attempt_date: new Date(),
      },
    })
  }

  useEffect(() => {
    if (!locale) {
      return
    }
    const controller = new AbortController()
    fetch(`${BASE_URL}/api/completionInstructions/${courseSlug}/${locale}`, {
      signal: controller?.signal,
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(res)
      })
      .then((json) => {
        setInstructions(json)
      })
      .catch((res) => {
        if (controller?.signal.aborted) {
          return
        }
        res.json().then((json: any) => setInstructions(json))
      })

    return () => controller.abort()
  }, [courseSlug, locale])

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${BASE_URL}/api/completionTiers/${courseSlug}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(res)
      })
      .then((json) => {
        setTiers(json.tierData)
      })
      .catch(() => {
        /* Do nothing */
      })

    return () => {
      controller?.abort()
    }
  }, [courseSlug])

  useBreadcrumbs([
    {
      translation: "registerCompletion",
    },
    {
      label:
        courseData?.course?.name ??
        (!courseLoading && !course_exists ? courseSlug : undefined),
      href: `/register-completion/${courseSlug}`,
    },
  ])
  const title = courseData?.course?.name ?? "..."

  if (courseLoading || userLoading) {
    return <Spinner />
  }

  if (userError || courseError) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(userError ?? courseError, undefined, 2)}
      />
    )
  }

  if (!currentUser) {
    return (
      <RegisterCompletion
        pageTitle={title}
        title={t("error")}
        message={t("notLoggedIn")}
      />
    )
  }

  if (!course_exists) {
    return (
      <RegisterCompletion
        pageTitle={title}
        title={t("course_not_found_title")}
        message={t("course_not_found", { course: courseSlug })}
      />
    )
  }

  if (!completion?.eligible_for_ects) {
    return (
      <RegisterCompletion
        pageTitle={title}
        title={t("course_completion_not_found_title")}
        message={t("course_completion_not_found")}
      />
    )
  }

  const registeredCompletion =
    completion?.completions_registered?.find(
      (c) => c?.completion_id === completion?.id,
    ) ?? undefined

  if (registeredCompletion) {
    return (
      <RegisterCompletion
        pageTitle={title}
        title={t("course_completion_already_registered_title")}
        message={t("course_completion_already_registered")}
      >
        <CompletionLinkColumn />
      </RegisterCompletion>
    )
  }

  //map completions language to a link
  //if completion has a language field defined
  const courseLinkWithLanguage = completion?.completion_link

  if (!courseLinkWithLanguage) {
    return (
      <RegisterCompletion pageTitle={title} title={t("title")}>
        <StyledPaper>
          <Typography paragraph>
            {t("open_university_registration_not_open")}{" "}
            <strong>{completion.course?.name}</strong> (
            {t(completion.completion_language as any)}).
          </Typography>
        </StyledPaper>
      </RegisterCompletion>
    )
  }

  return (
    <RegisterCompletion pageTitle={title} title={t("title")}>
      <StyledText variant="h3">
        {t("course", { course: completion.course?.name })}
      </StyledText>
      {completion.course?.ects && (
        <StyledText variant="h6" paragraph gutterBottom>
          {t("credits", { ects: completion.course?.ects })}
        </StyledText>
      )}
      {instructions && (
        <StyledPaper>
          <Typography paragraph>{instructions}</Typography>
        </StyledPaper>
      )}
      <ImportantNotice email={completion.email} />
      <RegisterCompletionText
        email={completion.email}
        link={courseLinkWithLanguage}
        tiers={tiers}
        onRegistrationClick={onRegistrationClick}
      />
      <CompletionLinkColumn />
      <StyledPaperRow>
        <StyledIcon color="primary">
          <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
        </StyledIcon>
        <Typography dangerouslySetInnerHTML={{ __html: t("NB") }} />
      </StyledPaperRow>
    </RegisterCompletion>
  )
}

export default withSignedIn(RegisterCompletionPage)

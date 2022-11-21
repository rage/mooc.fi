import { useEffect, useState } from "react"

import axios from "axios"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"

import { useMutation, useQuery } from "@apollo/client"
import { Paper, SvgIcon, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import RegisterCompletion from "/components/Home/RegisterCompletion"
import ImportantNotice from "/components/ImportantNotice"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import RegisterCompletionText from "/components/RegisterCompletionText"
import Spinner from "/components/Spinner"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useSubtitle from "/hooks/useSubtitle"
import { getAccessToken } from "/lib/authentication"
import withSignedIn from "/lib/with-signed-in"
import RegisterCompletionTranslations from "/translations/register-completion"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"

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

function RegisterCompletionPage() {
  const accessToken = getAccessToken(undefined)
  const { currentUser } = useLoginStateContext()
  const [instructions, setInstructions] = useState("")
  const [tiers, setTiers] = useState([])

  const courseSlug = (useQueryParameter("slug") ?? "").replace(/\./g, "")

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
    if (locale) {
      axios
        .get(`${BASE_URL}/api/completionInstructions/${courseSlug}/${locale}`)
        .then((res) => res.data)
        .then((json) => {
          setInstructions(json)
        })
        .catch((error) => {
          setInstructions(error.response.data)
        })

      axios({
        method: "GET",
        url: `${BASE_URL}/api/completionTiers/${courseSlug}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.data)
        .then((json: any) => {
          setTiers(json.tierData)
        })
    }
  }, [locale])

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
  const title = useSubtitle(courseData?.course?.name)

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
      <>
        <NextSeo title={title} />
        <RegisterCompletion title={t("error")}>
          <Typography>{t("notLoggedIn")}</Typography>
        </RegisterCompletion>
      </>
    )
  }

  if (!course_exists) {
    return (
      <>
        <NextSeo title={title} />
        <RegisterCompletion title={t("course_not_found_title")}>
          <Typography>
            {t("course_not_found", { course: courseSlug })}
          </Typography>
        </RegisterCompletion>
      </>
    )
  }

  if (!completion?.eligible_for_ects) {
    return (
      <>
        <NextSeo title={title} />
        <RegisterCompletion title={t("course_completion_not_found_title")}>
          <Typography>{t("course_completion_not_found")}</Typography>
        </RegisterCompletion>
      </>
    )
  }

  const registeredCompletion =
    completion?.completions_registered?.find(
      (c) => c?.completion_id === completion?.id,
    ) ?? undefined

  if (registeredCompletion) {
    return (
      <>
        <NextSeo title={title} />
        <RegisterCompletion
          title={t("course_completion_already_registered_title")}
        >
          <Typography>{t("course_completion_already_registered")}</Typography>
          <StyledPaperColumn>
            <Typography variant="body1">
              {t("see_completion_link")}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://opintopolku.fi/oma-opintopolku/"
              >
                {" "}
                opintopolku.fi/oma-opintopolku/
              </a>
            </Typography>
            <Typography variant="body1">{t("see_completion_NB")}</Typography>
          </StyledPaperColumn>
        </RegisterCompletion>
      </>
    )
  }

  //map completions language to a link
  //if completion has a language field defined
  const courseLinkWithLanguage = completion?.completion_link

  if (!courseLinkWithLanguage) {
    return (
      <>
        <NextSeo title={title} />
        <RegisterCompletion title={t("title")}>
          <StyledPaper>
            <Typography variant="body1" paragraph>
              {t("open_university_registration_not_open")}{" "}
              <strong>{completion.course?.name}</strong> (
              {completion.completion_language}).
            </Typography>
          </StyledPaper>
        </RegisterCompletion>
      </>
    )
  }

  return (
    <>
      <NextSeo title={title} />
      <RegisterCompletion title={t("title")}>
        <StyledText>
          {t("course", { course: completion.course?.name })}
        </StyledText>
        {completion.course?.ects && (
          <StyledText variant="h6" component="p" gutterBottom={true}>
            {t("credits", { ects: completion.course?.ects })}
          </StyledText>
        )}
        {instructions && (
          <StyledPaper>
            <Typography variant="body1" paragraph>
              {instructions}
            </Typography>
          </StyledPaper>
        )}
        <ImportantNotice email={completion.email} />
        <RegisterCompletionText
          email={completion.email}
          link={courseLinkWithLanguage}
          tiers={tiers}
          onRegistrationClick={onRegistrationClick}
        />
        <StyledPaperColumn>
          <Typography variant="body1">
            {t("see_completion_link")}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://opintopolku.fi/oma-opintopolku/"
            >
              {" "}
              opintopolku.fi/oma-opintopolku/
            </a>
          </Typography>
          <Typography variant="body1">{t("see_completion_NB")}</Typography>
        </StyledPaperColumn>
        <StyledPaperRow>
          <StyledIcon color="primary">
            <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
          </StyledIcon>
          <Typography variant="body1">{t("NB")}</Typography>
        </StyledPaperRow>
      </RegisterCompletion>
    </>
  )
}

export default withSignedIn(RegisterCompletionPage)

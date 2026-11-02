import { useCallback, useState } from "react"

import { NetworkStatus, useQuery } from "@apollo/client"
import { Alert, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"

import RegisterCompletion from "/components/Home/RegisterCompletion"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import DelegatedRegistrationButton from "/components/RegisterCompletion/DelegatedRegistrationButton"
import {
  CallToActionButton,
  Card,
  CourseName,
  Header,
  InstructionsSection,
  PageTitle,
  Prose,
  QuestionText,
} from "/components/RegisterCompletion/styles"
import Spinner from "/components/Spinner"
import VisuallyHidden from "/components/VisuallyHidden"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useCertificate } from "/hooks/useCertificate"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import { BACKEND_URL } from "/lib/backendUrl"
import withSignedIn from "/lib/with-signed-in"
import CommonTranslations from "/translations/common"
import RegisterCompletionTranslations from "/translations/register-completion"
import { isCompletedAfterCutoff } from "/util/creditRegistrationDelegation"

import {
  CourseFromSlugDocument,
  CurrentUserCertificateCompletionsDocument,
} from "/graphql/generated"

const CERTIFICATES_URL = "https://certificates.mooc.fi"

const NameFields = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  & > * {
    flex: 1 1 14rem;
  }
`

interface CertificateFormProps {
  certificateSlug: string
  onCreated: (certificateId: string) => void
}

/** Asks for the name on the certificate and creates it. */
function CertificateForm({ certificateSlug, onCreated }: CertificateFormProps) {
  const t = useTranslator(RegisterCompletionTranslations)
  const { currentUser } = useLoginStateContext()
  const [hasFailed, setHasFailed] = useState(false)

  const onReceiveGeneratedCertificateSuccess = useCallback(
    (certificate?: { id?: string }) => {
      if (certificate?.id) {
        onCreated(certificate.id)
      }
    },
    [onCreated],
  )
  const onFailure = useCallback(() => setHasFailed(true), [])

  const {
    state,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    onSubmit,
    isNameEmpty,
  } = useCertificate({
    course: { slug: certificateSlug },
    completion: { certificate_availability: null },
    onReceiveGeneratedCertificateSuccess,
    onReceiveGeneratedCertificateError: onFailure,
    onUpdateNameError: onFailure,
  })

  const isWorking =
    state.status === "UPDATING_NAME" || state.status === "GENERATING"
  const hasSavedName = Boolean(
    currentUser?.first_name || currentUser?.last_name,
  )

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setHasFailed(false)
    onSubmit()
  }

  return (
    <InstructionsSection as="form" onSubmit={submit}>
      <QuestionText as="h2">
        {hasSavedName
          ? t("certificateNameCheckHeading")
          : t("certificateNameAddHeading")}
      </QuestionText>
      <Prose>{t("certificateNameBody")}</Prose>
      <NameFields>
        <TextField
          id="certificate-first-name"
          label={t("certificateFirstName")}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoComplete="given-name"
          disabled={isWorking}
        />
        <TextField
          id="certificate-last-name"
          label={t("certificateLastName")}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          autoComplete="family-name"
          disabled={isWorking}
        />
      </NameFields>
      <CallToActionButton
        type="submit"
        variant="contained"
        color="primary"
        size="medium"
        disabled={isWorking || isNameEmpty}
      >
        {isWorking ? t("certificateCreating") : t("certificateCreate")}
      </CallToActionButton>
      <div aria-live="polite">
        {hasFailed && !isWorking && (
          <Alert severity="error">{t("certificateCreateFailed")}</Alert>
        )}
      </div>
    </InstructionsSection>
  )
}

function CertificatePage() {
  const courseSlug = encodeURIComponent(
    useQueryParameter("slug") ?? "",
  ).replace(/\./g, "")

  const t = useTranslator(RegisterCompletionTranslations, CommonTranslations)
  const { currentUser } = useLoginStateContext()
  const [createdCertificateId, setCreatedCertificateId] = useState<string>()
  const {
    loading: courseLoading,
    error: courseError,
    data: courseData,
  } = useQuery(CourseFromSlugDocument, {
    variables: { slug: courseSlug },
  })
  const course_exists = Boolean(courseData?.course?.id)
  const {
    error: completionsError,
    data: completionsData,
    networkStatus,
    refetch,
  } = useQuery(CurrentUserCertificateCompletionsDocument, {
    variables: { course_slug: courseSlug, fresh: false },
    skip: !course_exists,
    notifyOnNetworkStatusChange: true,
    errorPolicy: "all",
  })
  const isRefetching = networkStatus === NetworkStatus.refetch

  // The server caches availability for minutes, so "unavailable" or "no certificate yet" would stick.
  const refetchFresh = useCallback(() => {
    refetch({ fresh: true })
  }, [refetch])

  const onCreated = useCallback(
    (certificateId: string) => {
      setCreatedCertificateId(certificateId)
      refetchFresh()
    },
    [refetchFresh],
  )

  const completions = (completionsData?.currentUser?.completions ?? []).filter(
    (c) => c.eligible_for_ects,
  )
  const completion =
    completions.find((c) => c.certificate_availability?.existing_certificate) ??
    completions[completions.length - 1]
  const delegatedCompletion = completions.find(isCompletedAfterCutoff)

  useBreadcrumbs([
    { translation: "registerCompletion" },
    {
      label:
        courseData?.course?.name ??
        (!courseLoading && !course_exists ? courseSlug : undefined),
      href: `/register-completion/${courseSlug}`,
    },
  ])
  const title = courseData?.course?.name ?? "..."

  if (
    courseLoading ||
    (course_exists && !completionsData && !completionsError)
  ) {
    return <Spinner />
  }

  if (courseError || (completionsError && !completionsData?.currentUser)) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(
          courseError ?? completionsError,
          undefined,
          2,
        )}
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

  if (!completion?.course) {
    return (
      <RegisterCompletion
        pageTitle={title}
        title={t("course_completion_not_found_title")}
        message={t("course_completion_not_found")}
      />
    )
  }

  const { course } = completion
  const availability = completion.certificate_availability
  const certificateId =
    createdCertificateId ?? availability?.existing_certificate

  const renderRetry = (label: string) => (
    <CallToActionButton
      variant="outlined"
      color="primary"
      size="medium"
      disabled={isRefetching}
      onClick={refetchFresh}
    >
      {isRefetching ? t("certificateChecking") : label}
    </CallToActionButton>
  )

  const renderCertificate = () => {
    if (!course.has_certificate) {
      return (
        <InstructionsSection>
          <Prose>{t("certificateFallbackBody")}</Prose>
          {course.link && (
            <CallToActionButton
              variant="contained"
              color="primary"
              size="medium"
              href={course.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("goToCourseMaterials")}
              <VisuallyHidden> ({t("opensInNewTab")})</VisuallyHidden>
            </CallToActionButton>
          )}
        </InstructionsSection>
      )
    }
    if (certificateId) {
      return (
        <InstructionsSection>
          <Prose>{t("certificateReadyBody")}</Prose>
          <CallToActionButton
            variant="contained"
            color="primary"
            size="medium"
            href={`${CERTIFICATES_URL}/validate/${certificateId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("certificateShow")}
            <VisuallyHidden> ({t("opensInNewTab")})</VisuallyHidden>
          </CallToActionButton>
        </InstructionsSection>
      )
    }
    if (!availability || availability.service_unavailable) {
      return (
        <InstructionsSection aria-live="polite">
          <Alert severity="warning">{t("certificateServiceUnavailable")}</Alert>
          {renderRetry(t("certificateTryAgain"))}
        </InstructionsSection>
      )
    }
    if (!availability.completed_course) {
      return (
        <InstructionsSection aria-live="polite">
          <Prose>{t("certificateNotCompletedBody")}</Prose>
          {renderRetry(t("certificateCheckAgain"))}
        </InstructionsSection>
      )
    }
    // The form takes the saved name only when it mounts.
    if (!currentUser) {
      return <Spinner />
    }
    return (
      <CertificateForm certificateSlug={course.slug} onCreated={onCreated} />
    )
  }

  return (
    <RegisterCompletion pageTitle={title}>
      <Card>
        <Header>
          <PageTitle>{t("certificatePageTitle")}</PageTitle>
          <CourseName>{t("course", { course: course.name })}</CourseName>
        </Header>
        {renderCertificate()}
        {delegatedCompletion?.course && (
          <DelegatedRegistrationButton
            handoffUrl={`${BACKEND_URL}/api/credit-registration-handoff/${courseSlug}`}
            handlerCourseId={delegatedCompletion.course.id}
            description={t("certificateNeedCreditsBody")}
          />
        )}
      </Card>
    </RegisterCompletion>
  )
}

export default withSignedIn(CertificatePage)

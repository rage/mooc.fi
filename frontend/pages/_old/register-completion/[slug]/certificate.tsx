import { useCallback, useState } from "react"

import { NetworkStatus } from "@apollo/client"
import { useQuery } from "@apollo/client/react"
import { Alert, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"

import RegisterCompletion from "/components/Home/RegisterCompletion"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
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
import { CERTIFICATES_URL } from "/lib/certificates"
import withSignedIn from "/lib/with-signed-in"
import CommonTranslations from "/translations/common"
import RegisterCompletionTranslations from "/translations/register-completion"

import {
  CourseFromSlugDocument,
  CurrentUserCertificateCompletionsDocument,
  CurrentUserCertificateCompletionsQuery,
} from "/graphql/generated"

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

type CertificateCompletion = NonNullable<
  NonNullable<
    CurrentUserCertificateCompletionsQuery["currentUser"]
  >["completions"]
>[number]

interface CertificateSectionProps {
  course: NonNullable<CertificateCompletion["course"]>
  availability: CertificateCompletion["certificate_availability"]
  certificateId: string | null | undefined
  isRefetching: boolean
  onRetry: () => void
  onCreated: (certificateId: string) => void
}

/** The certificate, or what the student needs to do or wait for to get one. */
function CertificateSection({
  course,
  availability,
  certificateId,
  isRefetching,
  onRetry,
  onCreated,
}: CertificateSectionProps) {
  const t = useTranslator(RegisterCompletionTranslations, CommonTranslations)
  const { currentUser } = useLoginStateContext()

  const renderRetry = (label: string) => (
    <CallToActionButton
      variant="outlined"
      color="primary"
      size="medium"
      disabled={isRefetching}
      onClick={onRetry}
    >
      {isRefetching ? t("certificateChecking") : label}
    </CallToActionButton>
  )

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
  return <CertificateForm certificateSlug={course.slug} onCreated={onCreated} />
}

/** One that already has a certificate, else the latest eligible one. */
const pickCertificateCompletion = (
  completions: CertificateCompletion[] | null | undefined,
) => {
  const eligible = (completions ?? []).filter((c) => c.eligible_for_ects)
  return (
    eligible.find((c) => c.certificate_availability?.existing_certificate) ??
    eligible[eligible.length - 1]
  )
}

/** The course and the student's completion to offer a certificate for. */
function useCertificateCompletion(courseSlug: string) {
  const courseQuery = useQuery(CourseFromSlugDocument, {
    variables: { slug: courseSlug },
  })
  const course = courseQuery.data?.course
  const completionsQuery = useQuery(CurrentUserCertificateCompletionsDocument, {
    variables: { course_slug: courseSlug, fresh: false },
    skip: !course?.id,
    notifyOnNetworkStatusChange: true,
    errorPolicy: "all",
  })
  const { refetch } = completionsQuery
  const currentUser = completionsQuery.data?.currentUser

  // The server caches availability for minutes, so "unavailable" or "no certificate yet" would stick.
  const refetchFresh = useCallback(() => {
    refetch({ fresh: true })
  }, [refetch])

  return {
    course,
    isCourseLoading: courseQuery.loading,
    isLoading:
      courseQuery.loading ||
      (Boolean(course?.id) &&
        !completionsQuery.data &&
        !completionsQuery.error),
    error:
      courseQuery.error ?? (currentUser ? undefined : completionsQuery.error),
    completion: pickCertificateCompletion(currentUser?.completions),
    isRefetching: completionsQuery.networkStatus === NetworkStatus.refetch,
    refetchFresh,
  }
}

function CertificatePage({ courseSlug }: { courseSlug: string }) {
  const t = useTranslator(RegisterCompletionTranslations, CommonTranslations)
  const [createdCertificateId, setCreatedCertificateId] = useState<string>()
  const {
    course: slugCourse,
    isCourseLoading,
    isLoading,
    error,
    completion,
    isRefetching,
    refetchFresh,
  } = useCertificateCompletion(courseSlug)
  const course_exists = Boolean(slugCourse?.id)

  const onCreated = useCallback(
    (certificateId: string) => {
      setCreatedCertificateId(certificateId)
      refetchFresh()
    },
    [refetchFresh],
  )

  useBreadcrumbs([
    { translation: "registerCompletion" },
    {
      label:
        slugCourse?.name ??
        (!isCourseLoading && !course_exists ? courseSlug : undefined),
      href: `/register-completion/${courseSlug}`,
    },
  ])
  const title = slugCourse?.name ?? "..."

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(error, undefined, 2)}
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

  return (
    <RegisterCompletion pageTitle={title}>
      <Card>
        <Header>
          <PageTitle>{t("certificatePageTitle")}</PageTitle>
          <CourseName>{t("course", { course: course.name })}</CourseName>
        </Header>
        <CertificateSection
          course={course}
          availability={availability}
          certificateId={certificateId}
          isRefetching={isRefetching}
          onRetry={refetchFresh}
          onCreated={onCreated}
        />
      </Card>
    </RegisterCompletion>
  )
}

function CertificatePageForSlug() {
  const courseSlug = encodeURIComponent(
    useQueryParameter("slug") ?? "",
  ).replace(/\./g, "")

  // Next.js keeps the page mounted across slugs, and a created certificate belongs to one course.
  return <CertificatePage key={courseSlug} courseSlug={courseSlug} />
}

export default withSignedIn(CertificatePageForSlug)

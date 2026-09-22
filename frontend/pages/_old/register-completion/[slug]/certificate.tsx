import dynamic from "next/dynamic"

import { useQuery } from "@apollo/client"
import { Skeleton } from "@mui/material"
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
} from "/components/RegisterCompletion/styles"
import Spinner from "/components/Spinner"
import VisuallyHidden from "/components/VisuallyHidden"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withSignedIn from "/lib/with-signed-in"
import CommonTranslations from "/translations/common"
import RegisterCompletionTranslations from "/translations/register-completion"

import {
  CourseFromSlugDocument,
  CurrentUserOverviewDocument,
} from "/graphql/generated"

const CertificateButton = dynamic(
  () => import("/components/CertificateButton"),
  { ssr: false, loading: () => <Skeleton /> },
)

// CertificateButton caps itself at 20vw for the profile page's card, which is unreadable here.
const CertificateButtonRow = styled("div")`
  & .MuiButtonBase-root {
    max-width: none;
  }
`

function CertificatePage() {
  const { currentUser } = useLoginStateContext()

  const courseSlug = encodeURIComponent(
    useQueryParameter("slug") ?? "",
  ).replace(/\./g, "")

  const t = useTranslator(RegisterCompletionTranslations, CommonTranslations)
  const {
    loading: courseLoading,
    error: courseError,
    data: courseData,
  } = useQuery(CourseFromSlugDocument, {
    variables: { slug: courseSlug },
  })
  // errorPolicy "all": a certificates.mooc.fi hiccup should degrade this one page to the
  // course-materials fallback, not take down registration entirely.
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(CurrentUserOverviewDocument, { errorPolicy: "all" })

  const course_exists = Boolean(courseData?.course?.id)

  const completion =
    userData?.currentUser?.completions
      ?.filter((c) => c.course?.slug === courseSlug)
      ?.sort((a, b) => {
        if (a.completion_link && !b.completion_link) {
          return -1
        }
        if (!a.completion_link && b.completion_link) {
          return 1
        }
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0
        return bDate - aDate
      })[0] ?? undefined

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

  if (courseLoading || userLoading) {
    return <Spinner />
  }

  if ((userError && !userData?.currentUser) || courseError) {
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

  return (
    <RegisterCompletion pageTitle={title}>
      <Card>
        <Header>
          <PageTitle>{t("certificatePageTitle")}</PageTitle>
          <CourseName>
            {t("course", { course: completion.course?.name })}
          </CourseName>
        </Header>
        <InstructionsSection>
          {completion.course?.has_certificate ? (
            <>
              <Prose>{t("certificatePageIntroBody")}</Prose>
              {completion.course && (
                <CertificateButtonRow>
                  <CertificateButton
                    course={completion.course}
                    completion={completion}
                  />
                </CertificateButtonRow>
              )}
            </>
          ) : (
            <>
              <Prose>{t("certificateFallbackBody")}</Prose>
              {completion.course?.link && (
                <CallToActionButton
                  variant="contained"
                  color="primary"
                  size="medium"
                  href={completion.course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("goToCourseMaterials")}
                  <VisuallyHidden> ({t("opensInNewTab")})</VisuallyHidden>
                </CallToActionButton>
              )}
            </>
          )}
        </InstructionsSection>
      </Card>
    </RegisterCompletion>
  )
}

export default withSignedIn(CertificatePage)

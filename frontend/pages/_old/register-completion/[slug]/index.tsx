import { useEffect, useState } from "react"

import fetch from "isomorphic-unfetch"
import { useRouter } from "next/router"

import { useMutation, useQuery } from "@apollo/client/react"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import RegisterCompletion from "/components/Home/RegisterCompletion"
import ImportantNotice, {
  Notice,
  NoticeText,
} from "/components/ImportantNotice"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import OutboundLink from "/components/OutboundLink"
import AnswerButtonGroup, {
  AnswerOption,
} from "/components/RegisterCompletion/AnswerButtonGroup"
import DelegatedRegistrationButton from "/components/RegisterCompletion/DelegatedRegistrationButton"
import OpenUniversityDetour from "/components/RegisterCompletion/OpenUniversityDetour"
import {
  CallToActionButton,
  Card,
  CourseName,
  Credits,
  DividedSection,
  Header,
  InstructionsSection,
  PageTitle,
  Prose,
  QuestionHint,
  QuestionText,
  Section,
} from "/components/RegisterCompletion/styles"
import RegisterCompletionText from "/components/RegisterCompletionText"
import Spinner from "/components/Spinner"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import { BACKEND_URL } from "/lib/backendUrl"
import { escapeHtml } from "/lib/escapeHtml"
import withSignedIn from "/lib/with-signed-in"
import RegisterCompletionTranslations from "/translations/register-completion"
import { getCookie } from "/util/cookie"
import {
  hasRegisteredEquivalent,
  isCompletedAfterCutoff,
} from "/util/creditRegistrationDelegation"

import {
  CourseFromSlugDocument,
  CreateRegistrationAttemptDateDocument,
  CurrentUserOverviewDocument,
  CurrentUserOverviewQuery,
} from "/graphql/generated"

const SISU_URL = "https://sisu.helsinki.fi/student/frontpage"

type StudentTypeAnswer = "yes" | "no" | null

const StyledPaper = styled(Paper)`
  padding: 1em;
  margin: 1em;
`

const Disclosure = styled(Accordion)`
  border-top: 1px solid #ebedee;
  background-color: transparent;
  box-shadow: none;

  &::before {
    display: none;
  }

  & .MuiAccordionSummary-root {
    padding: 0.5rem 2.25rem;
  }

  & .MuiAccordionDetails-root {
    padding: 0 2.25rem 1.5rem;
  }

  @media (max-width: 40rem) {
    & .MuiAccordionSummary-root {
      padding: 0.5rem 1.25rem;
    }

    & .MuiAccordionDetails-root {
      padding: 0 1.25rem 1.25rem;
    }
  }
`

const DisclosureTitle = styled("span")`
  font-size: 1rem;
  font-weight: 600;
  color: #313947;
`

const CompletionLinkBlock = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

function CompletionLinkColumn() {
  const t = useTranslator(RegisterCompletionTranslations)

  return (
    <CompletionLinkBlock>
      <Prose>
        {t("see_completion_link")}{" "}
        <OutboundLink
          href="https://opintopolku.fi/oma-opintopolku/"
          label={t("see_completion_link")}
          rel="noopener noreferrer"
        >
          opintopolku.fi/oma-opintopolku/
        </OutboundLink>
      </Prose>
      <Notice>
        <NoticeText
          dangerouslySetInnerHTML={{ __html: t("see_completion_NB") }}
        />
      </Notice>
    </CompletionLinkBlock>
  )
}

type CourseCompletion = NonNullable<
  NonNullable<CurrentUserOverviewQuery["currentUser"]>["completions"]
>[number]

/** The completion registered here: completion link first, then the newest. */
const pickRegistrableCompletion = (completions: CourseCompletion[]) =>
  completions
    .filter((c) => !isCompletedAfterCutoff(c))
    .sort((a, b) => {
      if (a.completion_link && !b.completion_link) {
        return -1
      }
      if (!a.completion_link && b.completion_link) {
        return 1
      }
      const aDate = a.created_at ? new Date(a.created_at).getTime() : 0
      const bDate = b.created_at ? new Date(b.created_at).getTime() : 0
      return bDate - aDate
    })[0]

/** The completion courses.mooc.fi registers, if any still needs registering. */
const findDelegatedCompletion = (completions: CourseCompletion[]) =>
  // Decided per completion: one student can have completions on both sides of the cutoff.
  completions.find(
    (c) =>
      c.eligible_for_ects &&
      isCompletedAfterCutoff(c) &&
      !hasRegisteredEquivalent(c, completions),
  )

/** The course's registration instructions in the page's language, or "" until they load. */
function useCompletionInstructions(courseSlug: string) {
  const [instructions, setInstructions] = useState("")
  const { locale } = useRouter()

  useEffect(() => {
    if (!locale) {
      return
    }
    const controller = new AbortController()
    fetch(`${BACKEND_URL}/api/completionInstructions/${courseSlug}/${locale}`, {
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

  return instructions
}

/** The course's completion tiers, or [] until they load or when it has none. */
function useCompletionTiers(courseSlug: string) {
  const accessToken = getCookie("access_token")
  const [tiers, setTiers] = useState([])

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${BACKEND_URL}/api/completionTiers/${courseSlug}`, {
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

  return tiers
}

interface StudentTypeRegistrationProps {
  completion: CourseCompletion
  link: string
  instructions: string
  tiers: never[]
  delegatedRegistration: React.ReactNode
}

/** Asks whether the student studies at the University of Helsinki and shows how they register. */
function StudentTypeRegistration({
  completion,
  link,
  instructions,
  tiers,
  delegatedRegistration,
}: StudentTypeRegistrationProps) {
  const t = useTranslator(RegisterCompletionTranslations)
  const [studentTypeAnswer, setStudentTypeAnswer] =
    useState<StudentTypeAnswer>(null)
  const [createRegistrationAttemptDate] = useMutation(
    CreateRegistrationAttemptDateDocument,
  )

  const onRegistrationClick = () => {
    createRegistrationAttemptDate({
      variables: {
        id: completion.id,
        completion_registration_attempt_date: new Date(),
      },
    })
  }

  const studentTypeOptions: AnswerOption<"yes" | "no">[] = [
    { value: "yes", label: t("yes") },
    { value: "no", label: t("no") },
  ]

  const renderOpenUniversityInstructions = () => (
    <InstructionsSection>
      <QuestionText as="h2">
        {t("openUniversityInstructionsHeading")}
      </QuestionText>
      <ImportantNotice email={completion.email} />
      <RegisterCompletionText
        email={completion.email}
        link={link}
        tiers={tiers}
        onRegistrationClick={onRegistrationClick}
      />
      <CompletionLinkColumn />
    </InstructionsSection>
  )

  return (
    <>
      {/* aria-live from first paint, before there's anything to reveal: a live region only
          reliably announces content added *after* it's already in the DOM, not content that
          arrives in the same paint as the region itself. */}
      <Card aria-live="polite">
        <Header>
          <PageTitle>{t("title")}</PageTitle>
          <CourseName>
            {t("course", { course: completion.course?.name })}
          </CourseName>
          {completion.course?.ects && (
            <Credits>{t("credits", { ects: completion.course?.ects })}</Credits>
          )}
        </Header>
        {instructions && (
          <DividedSection>
            <Prose>{instructions}</Prose>
          </DividedSection>
        )}
        <DividedSection>
          <QuestionText>{t("studentTypeQuestion")}</QuestionText>
          <QuestionHint>{t("studentTypeQuestionHint")}</QuestionHint>
          <AnswerButtonGroup
            options={studentTypeOptions}
            value={studentTypeAnswer}
            onChange={setStudentTypeAnswer}
          />
        </DividedSection>
        {studentTypeAnswer === "yes" && (
          <InstructionsSection>
            <QuestionText as="h2">{t("sisuInstructionsHeading")}</QuestionText>
            <Prose>{t("sisuInstructions")}</Prose>
            <ImportantNotice
              email={completion.email}
              translationKey="sisuEmailNotice"
            />
            <CallToActionButton
              variant="contained"
              color="primary"
              size="medium"
              href={SISU_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("sisuLink")}
            </CallToActionButton>
          </InstructionsSection>
        )}
        {studentTypeAnswer === "no" &&
          (completion.course ? (
            <OpenUniversityDetour
              key={completion.id}
              completion={completion}
              course={completion.course}
              renderDestination={renderOpenUniversityInstructions}
            />
          ) : (
            renderOpenUniversityInstructions()
          ))}
        {studentTypeAnswer !== null && (
          <Disclosure square disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <DisclosureTitle>{t("emailChangedTitle")}</DisclosureTitle>
            </AccordionSummary>
            <AccordionDetails>
              <Prose
                dangerouslySetInnerHTML={{
                  __html: t("emailChangedBody", {
                    email: escapeHtml(completion.email),
                  }),
                }}
              />
            </AccordionDetails>
          </Disclosure>
        )}
        {delegatedRegistration}
      </Card>
    </>
  )
}

interface CompletionRegistrationProps {
  courseSlug: string
  title: string
  completion: CourseCompletion | undefined
  delegatedCompletion: CourseCompletion | undefined
  instructions: string
  tiers: never[]
}

/** Where and how the student registers their completion, given what they have completed. */
function CompletionRegistration({
  courseSlug,
  title,
  completion,
  delegatedCompletion,
  instructions,
  tiers,
}: CompletionRegistrationProps) {
  const t = useTranslator(RegisterCompletionTranslations)

  const delegatedRegistration = delegatedCompletion?.course && (
    <DelegatedRegistrationButton
      handoffUrl={`${BACKEND_URL}/api/credit-registration-handoff/${courseSlug}`}
      handlerCourseId={delegatedCompletion.course.id}
      description={
        completion?.eligible_for_ects
          ? t("delegatedRegistrationLaterCompletionBody")
          : undefined
      }
    />
  )

  if (!completion?.eligible_for_ects) {
    if (delegatedCompletion) {
      return (
        <RegisterCompletion pageTitle={title}>
          <Card>
            <Header>
              <PageTitle>{t("title")}</PageTitle>
              <CourseName>
                {t("course", { course: delegatedCompletion.course?.name })}
              </CourseName>
            </Header>
            {delegatedRegistration}
          </Card>
        </RegisterCompletion>
      )
    }
    return (
      <RegisterCompletion
        pageTitle={title}
        title={t("course_completion_not_found_title")}
        message={t("course_completion_not_found")}
      />
    )
  }

  const isRegistered = Boolean(
    completion.completions_registered?.some(
      (c) => c?.completion_id === completion.id,
    ),
  )

  if (isRegistered) {
    return (
      <RegisterCompletion
        pageTitle={title}
        title={t("course_completion_already_registered_title")}
        message={t("course_completion_already_registered")}
      >
        <Card>
          <Section>
            <CompletionLinkColumn />
          </Section>
          {delegatedRegistration}
        </Card>
      </RegisterCompletion>
    )
  }

  if (!completion.completion_link) {
    return (
      <RegisterCompletion pageTitle={title} title={t("title")}>
        <StyledPaper>
          <Typography
            sx={{
              marginBottom: "16px",
            }}
          >
            {t("open_university_registration_not_open")}{" "}
            <strong>{completion.course?.name}</strong> (
            {t(completion.completion_language as any)}).
          </Typography>
        </StyledPaper>
        {delegatedRegistration && <Card>{delegatedRegistration}</Card>}
      </RegisterCompletion>
    )
  }

  return (
    <RegisterCompletion pageTitle={title}>
      <StudentTypeRegistration
        completion={completion}
        link={completion.completion_link}
        instructions={instructions}
        tiers={tiers}
        delegatedRegistration={delegatedRegistration}
      />
    </RegisterCompletion>
  )
}

function RegisterCompletionPage() {
  const { currentUser } = useLoginStateContext()

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
  // The whole detour now depends on completion.course.has_certificate, queried alongside every
  // other completion field here; errorPolicy "all" keeps a certificates.mooc.fi hiccup from
  // taking down registration for every course instead of just degrading the certificate step.
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(CurrentUserOverviewDocument, { errorPolicy: "all" })
  const instructions = useCompletionInstructions(courseSlug)
  const tiers = useCompletionTiers(courseSlug)

  const course = courseData?.course
  const courseCompletions = (userData?.currentUser?.completions ?? []).filter(
    (c) => c.course?.slug === courseSlug,
  )

  useBreadcrumbs([
    {
      translation: "registerCompletion",
    },
    {
      label: course?.name ?? (courseLoading ? undefined : courseSlug),
      href: `/register-completion/${courseSlug}`,
    },
  ])
  const title = course?.name ?? "..."

  if (courseLoading || userLoading) {
    return <Spinner />
  }

  // With errorPolicy "all", a field-level error (e.g. certificate_availability) still comes back
  // with currentUser populated; only bail out here when there's truly nothing to show.
  const error = courseError ?? (userData?.currentUser ? undefined : userError)
  if (error) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(error, undefined, 2)}
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

  if (!course?.id) {
    return (
      <RegisterCompletion
        pageTitle={title}
        title={t("course_not_found_title")}
        message={t("course_not_found", { course: courseSlug })}
      />
    )
  }

  return (
    <CompletionRegistration
      courseSlug={courseSlug}
      title={title}
      completion={pickRegistrableCompletion(courseCompletions)}
      delegatedCompletion={findDelegatedCompletion(courseCompletions)}
      instructions={instructions}
      tiers={tiers}
    />
  )
}

export default withSignedIn(RegisterCompletionPage)

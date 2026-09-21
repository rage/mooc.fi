import { useEffect, useState } from "react"

import fetch from "isomorphic-unfetch"
import { useRouter } from "next/router"

import { useMutation, useQuery } from "@apollo/client"
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
import OpenUniversityDetour from "/components/RegisterCompletion/OpenUniversityDetour"
import {
  CallToActionButton,
  DividedSection,
  InstructionsSection,
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

const SISU_URL = "https://sisu.helsinki.fi/student/frontpage"

type StudentTypeAnswer = "yes" | "no" | null

const StyledPaper = styled(Paper)`
  padding: 1em;
  margin: 1em;
`

const Card = styled("div")`
  max-width: 46rem;
  margin: 2rem auto 4rem;
  border: 1px solid #e2e4e6;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(10, 15, 23, 0.04);
  overflow: hidden;
`

const Header = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const PageTitle = styled("h1")`
  margin: 0;
  font-family: var(--header-font);
  font-size: 2.125rem;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: #1a2333;
`

const CourseName = styled("h2")`
  margin: 0;
  font-family: var(--header-font);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.35;
  color: #313947;
`

const Credits = styled("p")`
  margin: 0;
  font-size: 0.9375rem;
  color: #535a66;
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

function RegisterCompletionPage() {
  const accessToken = getCookie("access_token")
  const { currentUser } = useLoginStateContext()
  const [instructions, setInstructions] = useState("")
  const [tiers, setTiers] = useState([])
  const [studentTypeAnswer, setStudentTypeAnswer] =
    useState<StudentTypeAnswer>(null)

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
    userData?.currentUser?.completions
      ?.filter((c) => c.course?.slug === courseSlug)
      ?.sort((a, b) => {
        // First prioritize completions with a completion_link
        if (a.completion_link && !b.completion_link) {
          return -1
        }
        if (!a.completion_link && b.completion_link) {
          return 1
        }

        // If both have or don't have completion_link, sort by created_at (newest first)
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0
        return bDate - aDate
      })[0] ?? undefined

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
        <Card>
          <Section>
            <CompletionLinkColumn />
          </Section>
        </Card>
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

  const studentTypeOptions: AnswerOption<"yes" | "no">[] = [
    { value: "yes", label: t("yes") },
    { value: "no", label: t("no") },
  ]

  // certificate_availability stays null unless the course has certificates, so this one flag
  // answers both "does this course have a certificate" and "can this student get one".
  const certificateAvailable = Boolean(
    completion.certificate_availability?.completed_course,
  )

  const renderOpenUniversityInstructions = () => (
    <InstructionsSection>
      <ImportantNotice email={completion.email} />
      <RegisterCompletionText
        email={completion.email}
        link={courseLinkWithLanguage}
        tiers={tiers}
        onRegistrationClick={onRegistrationClick}
      />
      <CompletionLinkColumn />
    </InstructionsSection>
  )

  return (
    <RegisterCompletion pageTitle={title}>
      <Card>
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
          (certificateAvailable && completion.course ? (
            <OpenUniversityDetour
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
                  __html: t("emailChangedBody", { email: completion.email }),
                }}
              />
            </AccordionDetails>
          </Disclosure>
        )}
      </Card>
    </RegisterCompletion>
  )
}

export default withSignedIn(RegisterCompletionPage)

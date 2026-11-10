import { useState } from "react"

import { useConfirm } from "material-ui-confirm"
import { generateNextSeo } from "next-seo/pages"
import Head from "next/head"

import { useApolloClient, useMutation, useQuery } from "@apollo/client/react"
import {
  Button,
  EnhancedLink,
  Link as MUILink,
  Paper,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { WideContainer } from "/components/Container"
import CreateEmailTemplateDialog from "/components/CreateEmailTemplateDialog"
import CourseDashboard from "/components/Dashboard/CourseDashboard"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import Spinner from "/components/Spinner"
import { H1NoBackground, SubtitleNoBackground } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useIsOld from "/hooks/useIsOld"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withAdminOrCourseOwner from "/lib/with-admin-or-course-owner"
import CoursesTranslations from "/translations/courses"

import {
  CourseDashboardCourseFieldsFragment,
  CourseDashboardDocument,
  CurrentUserStatsSubscriptionsDocument,
  CurrentUserStatsSubscriptionsQuery,
  PaginatedCompletionsDocument,
  PaginatedCompletionsPreviousPageDocument,
  RecheckCompletionsDocument,
  UserCourseStatsSubscribeDocument,
  UserCourseStatsUnsubscribeDocument,
} from "/graphql/generated"

const Link = MUILink as EnhancedLink

const Title = styled(Typography)`
  margin-bottom: 0.7em;
` as typeof Typography

const Row = styled(Paper)`
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`

const StyledWideContainer = styled(WideContainer)`
  display: grid;
  justify-content: center;
`

interface EmailControlProps {
  course: CourseDashboardCourseFieldsFragment
  baseUrl: string
}

const CompletionEmailControl = ({ course, baseUrl }: EmailControlProps) => {
  const t = useTranslator(CoursesTranslations)

  if (course.completion_email == null) {
    return (
      <CreateEmailTemplateDialog
        buttonText={t("createCompletionEmail")}
        course={course}
        type="completion"
      />
    )
  }
  return (
    <Link
      href={`${baseUrl}/email-templates/${course.completion_email?.id}`}
      prefetch={false}
      passHref
    >
      <Button color="info">
        {t("completionEmail")}: {course.completion_email?.name}
      </Button>
    </Link>
  )
}

type CourseStatsSubscriptions = NonNullable<
  NonNullable<
    CurrentUserStatsSubscriptionsQuery["currentUser"]
  >["course_stats_subscriptions"]
>

const CourseStatsEmailControl = ({
  course,
  baseUrl,
  subscriptions,
}: EmailControlProps & { subscriptions: CourseStatsSubscriptions }) => {
  const client = useApolloClient()
  const [subscribing, setSubscribing] = useState(false)
  const courseStatsEmailId = course.course_stats_email?.id
  const subscription = subscriptions.find(
    (sub) => sub.email_template?.id === courseStatsEmailId,
  )
  const isSubscribed = Boolean(subscription)

  const handleSubscribe = async () => {
    setSubscribing(true)

    try {
      const refetchQueries = [{ query: CurrentUserStatsSubscriptionsDocument }]
      if (isSubscribed) {
        await client.mutate({
          mutation: UserCourseStatsUnsubscribeDocument,
          variables: { id: subscription?.id ?? "" },
          refetchQueries,
        })
      } else {
        await client.mutate({
          mutation: UserCourseStatsSubscribeDocument,
          variables: { id: courseStatsEmailId ?? "" },
          refetchQueries,
        })
      }
    } catch {
      //
    } finally {
      setSubscribing(false)
    }
  }

  const t = useTranslator(CoursesTranslations)

  if (course.course_stats_email === null) {
    return (
      <CreateEmailTemplateDialog
        buttonText={t("createCourseStatsEmail")}
        course={course}
        type="course-stats"
      />
    )
  }
  return (
    <>
      <Link
        href={`${baseUrl}/email-templates/${course.course_stats_email?.id}`}
        prefetch={false}
        passHref
      >
        <Button color="info">
          {t("courseStatsEmail")}: {course.course_stats_email?.name}
        </Button>
      </Link>
      <Button onClick={handleSubscribe} disabled={subscribing}>
        {isSubscribed ? t("unsubscribe") : t("subscribe")}
      </Button>
    </>
  )
}

const RecheckCompletionsButton = ({
  onConfirmed,
  disabled,
}: {
  onConfirmed: () => Promise<void>
  disabled: boolean
}) => {
  const t = useTranslator(CoursesTranslations)
  const confirm = useConfirm()

  return (
    <div>
      <Button
        color="primary"
        onClick={() => {
          confirm({
            title: t("recheckConfirmTitle"),
            description: t("recheckConfirmDescription"),
            confirmationText: t("recheckConfirmYes"),
            cancellationText: t("recheckConfirmCancel"),
          }).then(({ confirmed }) => {
            if (confirmed) {
              return onConfirmed()
            }
          })
        }}
        disabled={disabled}
      >
        {t("recheckCompletions")}
      </Button>
    </div>
  )
}

const Course = () => {
  const isOld = useIsOld()
  const baseUrl = isOld ? "/_old" : "/admin"
  const slug = useQueryParameter("slug")
  const t = useTranslator(CoursesTranslations)

  const [checking, setChecking] = useState(false)
  const [checkMessage, setCheckMessage] = useState("")
  const { data, loading, error } = useQuery(CourseDashboardDocument, {
    variables: { slug },
  })
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(CurrentUserStatsSubscriptionsDocument)

  useBreadcrumbs([
    {
      translation: "courses",
      href: `${baseUrl}/courses`,
    },
    {
      label: data?.course?.name,
      href: `${baseUrl}/courses/${slug}`,
    },
  ])
  const title = data?.course?.name ?? "..."

  const [recheckCompletions] = useMutation(RecheckCompletionsDocument, {
    variables: {
      slug,
    },
    refetchQueries: [
      { query: PaginatedCompletionsDocument, variables: { course: slug } },
      {
        query: PaginatedCompletionsPreviousPageDocument,
        variables: { course: slug },
      }, // TODO: add more?
    ],
  })

  const handleRecheck = async () => {
    setChecking(true)
    try {
      const res = await recheckCompletions()
      setCheckMessage(res?.data?.recheckCompletions ?? "")
    } catch {
      setCheckMessage("Error while re-checking")
    } finally {
      setChecking(false)
    }
  }

  if (loading || userLoading || !data || !userData) {
    return <Spinner />
  }

  if (error || userError) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(error ?? userError)}
      />
    )
  }

  if (!data.course) {
    return (
      <>
        <p>{t("courseNotFound")}</p>
      </>
    )
  }

  return (
    <>
      <Head>{generateNextSeo({ title: title })}</Head>
      <section>
        <DashboardTabBar slug={slug} selectedValue={0} />

        <StyledWideContainer>
          <H1NoBackground component="h1" variant="h1" align="center">
            {data.course?.name}
          </H1NoBackground>
          <Title component="p" variant="subtitle2" align="center" gutterBottom>
            {data.course?.id}
          </Title>
          <SubtitleNoBackground
            component="p"
            variant="subtitle1"
            align="center"
          >
            {t("courseHome")}
          </SubtitleNoBackground>
          <Row>
            <CompletionEmailControl course={data.course} baseUrl={baseUrl} />
            <CourseStatsEmailControl
              course={data.course}
              baseUrl={baseUrl}
              subscriptions={
                userData.currentUser?.course_stats_subscriptions ?? []
              }
            />
            <RecheckCompletionsButton
              onConfirmed={handleRecheck}
              disabled={checking}
            />
            {checkMessage !== "" && <Typography>{checkMessage}</Typography>}
            <div>
              <Button href={`${baseUrl}/courses/${slug}/manual-completions`}>
                {t("manualCompletions")}
              </Button>
            </div>
          </Row>
          <CourseDashboard />
        </StyledWideContainer>
      </section>
    </>
  )
}

export default withAdminOrCourseOwner(Course)

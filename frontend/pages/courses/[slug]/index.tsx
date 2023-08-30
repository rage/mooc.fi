import { useState } from "react"

import { useConfirm } from "material-ui-confirm"
import { NextSeo } from "next-seo"

import { useApolloClient, useMutation, useQuery } from "@apollo/client"
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
import useIsNew from "/hooks/useIsNew"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withAdmin from "/lib/with-admin"
import CoursesTranslations from "/translations/courses"

import {
  CourseDashboardDocument,
  CurrentUserStatsSubscriptionsDocument,
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

const Course = () => {
  const isNew = useIsNew()
  const baseUrl = isNew ? "/_new/admin" : ""
  const slug = useQueryParameter("slug")
  const t = useTranslator(CoursesTranslations)
  const confirm = useConfirm()

  const [checking, setChecking] = useState(false)
  const [checkMessage, setCheckMessage] = useState("")
  const [subscribing, setSubscribing] = useState(false)
  const { data, loading, error } = useQuery(CourseDashboardDocument, {
    variables: { slug },
  })
  const client = useApolloClient()

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

  const subscription = userData?.currentUser?.course_stats_subscriptions?.find(
    (sub) => sub.email_template?.id === data?.course?.course_stats_email?.id,
  )
  const isSubscribed = Boolean(subscription)

  const handleSubscribe = async () => {
    setSubscribing(true)

    try {
      await client.mutate({
        mutation: !isSubscribed
          ? UserCourseStatsSubscribeDocument
          : UserCourseStatsUnsubscribeDocument,
        variables: {
          id:
            (!isSubscribed
              ? data?.course?.course_stats_email?.id
              : subscription?.id) ?? "",
        },
        refetchQueries: [{ query: CurrentUserStatsSubscriptionsDocument }],
      })
    } catch {
      //
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <>
      <NextSeo title={title} />
      <section>
        <DashboardTabBar slug={slug} selectedValue={0} />

        <WideContainer>
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
            {data.course?.completion_email != null ? (
              <Link
                href={`${baseUrl}/email-templates/${data.course.completion_email?.id}`}
                prefetch={false}
                passHref
              >
                <Button color="info">
                  Completion email: {data.course.completion_email?.name}
                </Button>
              </Link>
            ) : (
              <CreateEmailTemplateDialog
                buttonText="Create completion email"
                course={data.course}
                type="completion"
              />
            )}
            {data.course?.course_stats_email !== null ? (
              <>
                <Link
                  href={`${baseUrl}/email-templates/${data.course.course_stats_email?.id}`}
                  prefetch={false}
                  passHref
                >
                  <Button color="info">
                    Course stats email: {data.course.course_stats_email?.name}
                  </Button>
                </Link>
                <Button onClick={handleSubscribe} disabled={subscribing}>
                  {isSubscribed ? "Unsubscribe" : "Subscribe"}
                </Button>
              </>
            ) : (
              <CreateEmailTemplateDialog
                buttonText="Create course stats email"
                course={data.course}
                type="course-stats"
              />
            )}
            <div>
              <Button
                color="primary"
                onClick={() => {
                  confirm({
                    title: "Are you sure?",
                    description:
                      "Don't do this unless you really know what you're doing. This might mess things up!",
                    confirmationText: "Yes, I'm sure",
                    cancellationText: "Cancel",
                  }).then(handleRecheck)
                }}
                disabled={checking}
              >
                Re-check completions
              </Button>
            </div>
            {checkMessage !== "" && <Typography>{checkMessage}</Typography>}
          </Row>
          <CourseDashboard />
        </WideContainer>
      </section>
    </>
  )
}

export default withAdmin(Course)

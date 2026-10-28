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
import useIsOld from "/hooks/useIsOld"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withAdminOrCourseOwner from "/lib/with-admin-or-course-owner"
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

const StyledWideContainer = styled(WideContainer)`
  display: grid;
  justify-content: center;
`

const Course = () => {
  const isOld = useIsOld()
  const baseUrl = isOld ? "/_old" : "/admin"
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
            {data.course?.completion_email != null ? (
              <Link
                href={`${baseUrl}/email-templates/${data.course.completion_email?.id}`}
                prefetch={false}
                passHref
              >
                <Button color="info">
                  {t("completionEmail")}: {data.course.completion_email?.name}
                </Button>
              </Link>
            ) : (
              <CreateEmailTemplateDialog
                buttonText={t("createCompletionEmail")}
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
                    {t("courseStatsEmail")}:{" "}
                    {data.course.course_stats_email?.name}
                  </Button>
                </Link>
                <Button onClick={handleSubscribe} disabled={subscribing}>
                  {isSubscribed ? t("unsubscribe") : t("subscribe")}
                </Button>
              </>
            ) : (
              <CreateEmailTemplateDialog
                buttonText={t("createCourseStatsEmail")}
                course={data.course}
                type="course-stats"
              />
            )}
            <div>
              <Button
                color="primary"
                onClick={() => {
                  confirm({
                    title: t("recheckConfirmTitle"),
                    description: t("recheckConfirmDescription"),
                    confirmationText: t("recheckConfirmYes"),
                    cancellationText: t("recheckConfirmCancel"),
                  }).then(handleRecheck)
                }}
                disabled={checking}
              >
                {t("recheckCompletions")}
              </Button>
            </div>
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

import { useState } from "react"

import { WideContainer } from "/components/Container"
import CreateEmailTemplateDialog from "/components/CreateEmailTemplateDialog"
import {
  AllCompletionsQuery,
  PreviousPageCompletionsQuery,
} from "/components/Dashboard/CompletionsList"
import CourseDashboard from "/components/Dashboard/CourseDashboard"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import LangLink from "/components/LangLink"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import Spinner from "/components/Spinner"
import { H1NoBackground, SubtitleNoBackground } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withAdmin from "/lib/with-admin"
import { CourseDetailsFromSlugQuery as CourseDetailsData } from "/static/types/generated/CourseDetailsFromSlugQuery"
import { UserCourseStatsSubscriptions } from "/static/types/generated/UserCourseStatsSubscriptions"
import CoursesTranslations from "/translations/courses"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"
import { useConfirm } from "material-ui-confirm"

import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client"
import styled from "@emotion/styled"
import { Button, Card, Paper, Typography } from "@mui/material"

const Title = styled(Typography)<any>`
  margin-bottom: 0.7em;
`

export const CourseDetailsFromSlugQuery = gql`
  query CourseDetailsFromSlugQuery($slug: String) {
    course(slug: $slug) {
      id
      slug
      name
      teacher_in_charge_name
      teacher_in_charge_email
      start_date
      completion_email {
        name
        id
      }
      course_stats_email {
        id
        name
      }
    }
  }
`

const UserCourseStatsSubscriptionsQuery = gql`
  query UserCourseStatsSubscriptions {
    currentUser {
      id
      course_stats_subscriptions {
        id
        email_template {
          id
        }
      }
    }
  }
`

const UserCourseStatsSubscribeMutation = gql`
  mutation UserCourseStatsSubscribe($id: ID!) {
    createCourseStatsSubscription(id: $id) {
      id
    }
  }
`

const UserCourseStatsUnsubscribeMutation = gql`
  mutation UserCourseStatsUnsubscribe($id: ID!) {
    deleteCourseStatsSubscription(id: $id) {
      id
    }
  }
`

const recheckCompletionsMutation = gql`
  mutation RecheckCompletionMutation($slug: String) {
    recheckCompletions(slug: $slug)
  }
`

const Row = styled(Paper)`
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`

const Course = () => {
  const slug = useQueryParameter("slug")
  const t = useTranslator(CoursesTranslations)
  const confirm = useConfirm()

  const [checking, setChecking] = useState(false)
  const [checkMessage, setCheckMessage] = useState("")
  const [subscribing, setSubscribing] = useState(false)
  const { data, loading, error } = useQuery<CourseDetailsData>(
    CourseDetailsFromSlugQuery,
    {
      variables: { slug },
    },
  )
  const client = useApolloClient()

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery<UserCourseStatsSubscriptions>(UserCourseStatsSubscriptionsQuery)

  useBreadcrumbs([
    {
      translation: "courses",
      href: `/courses`,
    },
    {
      label: data?.course?.name,
      href: `/courses/${slug}`,
    },
  ])

  const [recheckCompletions] = useMutation(recheckCompletionsMutation, {
    variables: {
      slug,
    },
    refetchQueries: [
      { query: AllCompletionsQuery, variables: { course: slug } },
      { query: PreviousPageCompletionsQuery, variables: { course: slug } }, // TODO: add more?
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
        errorMessage={JSON.stringify(error || userError)}
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
          ? UserCourseStatsSubscribeMutation
          : UserCourseStatsUnsubscribeMutation,
        variables: {
          id: !isSubscribed
            ? data?.course?.course_stats_email?.id
            : subscription!.id,
        },
        refetchQueries: [{ query: UserCourseStatsSubscriptionsQuery }],
      })
    } catch {
      //
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <section>
      <DashboardTabBar slug={slug} selectedValue={0} />

      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          {data.course?.name}
        </H1NoBackground>
        <Title
          component="p"
          variant="subtitle2"
          align="center"
          gutterBottom={true}
        >
          {data.course?.id}
        </Title>
        <SubtitleNoBackground component="p" variant="subtitle1" align="center">
          {t("courseHome")}
        </SubtitleNoBackground>
        <Row>
          {data.course?.completion_email != null ? (
            <LangLink
              href={`/email-templates/${data.course.completion_email?.id}`}
              prefetch={false}
              passHref
            >
              <Card style={{ width: "300px", minHeight: "50px" }}>
                Completion Email: {data.course.completion_email?.name}
              </Card>
            </LangLink>
          ) : (
            <CreateEmailTemplateDialog
              buttonText="Create completion email"
              course={data.course}
              type="completion"
            />
          )}
          {data.course?.course_stats_email !== null ? (
            <>
              <LangLink
                href={`/email-templates/${data.course.course_stats_email?.id}`}
                prefetch={false}
                passHref
              >
                <Card style={{ width: "300px", minHeight: "50px" }}>
                  Course stats email: {data.course.course_stats_email?.name}
                </Card>
              </LangLink>
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
          {checkMessage !== "" && <Typography>{checkMessage}</Typography>}
        </Row>
        <CourseDashboard />
      </WideContainer>
    </section>
  )
}

export default withAdmin(Course)

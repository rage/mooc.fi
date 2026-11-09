import { gql } from "graphql-request"

import {
  FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  setupTMCWithDefaultFakeUsers,
} from "../../../tests"
import { seed } from "../../../tests/data/seed"

jest.mock("../../../services/kafkaProducer")

const ctx = getTestContext()

const coursesRelationsQuery = gql`
  {
    courses {
      completion_email {
        email_deliveries {
          user {
            email
          }
        }
      }
      services {
        user_course_service_progresses {
          id
        }
      }
    }
  }
`

const courseCompletionEmailQuery = gql`
  query CourseCompletionEmail($slug: String!) {
    course(slug: $slug) {
      completion_email {
        id
        name
      }
    }
  }
`

const courseCompletionEmailDeliveriesQuery = gql`
  query CourseCompletionEmailDeliveries($slug: String!) {
    course(slug: $slug) {
      completion_email {
        email_deliveries {
          id
        }
      }
    }
  }
`

const coursesServicesQuery = gql`
  {
    courses {
      services {
        id
      }
    }
  }
`

describe("Course relation authorization", () => {
  setupTMCWithDefaultFakeUsers()

  beforeEach(async () => {
    await seed(ctx.prisma)
    for (const slug of ["course1", "course2"]) {
      const template = await ctx.prisma.emailTemplate.create({
        data: { name: `${slug} completion` },
      })
      await ctx.prisma.course.update({
        where: { slug },
        data: { completion_email: { connect: { id: template.id } } },
      })
      await ctx.prisma.emailDelivery.create({
        data: {
          email_template: { connect: { id: template.id } },
          user: { connect: { id: "20000000000000000000000000000102" } },
          email: "e@mail.com",
        },
      })
    }
  })

  it("refuses anonymous callers", async () => {
    await expect(ctx.client.request(coursesRelationsQuery)).rejects.toThrow(
      /Not authorized/,
    )
  })

  it("refuses anonymous callers reading services", async () => {
    await expect(ctx.client.request(coursesServicesQuery)).rejects.toThrow(
      /Not authorized/,
    )
  })

  it("refuses a course owner reading email deliveries", async () => {
    await expect(
      ctx.client.request(
        courseCompletionEmailDeliveriesQuery,
        { slug: "course2" },
        FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
      ),
    ).rejects.toThrow(/Not authorized/)
  })

  it("lets admins read the relations", async () => {
    const res = await ctx.client.request<any>(
      coursesRelationsQuery,
      {},
      FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
    )

    const deliveries = res.courses.flatMap(
      (c: any) => c.completion_email?.email_deliveries ?? [],
    )
    expect(deliveries).toHaveLength(2)
    expect(deliveries[0].user.email).toBeDefined()
  })

  it("lets a course owner read their own course's completion_email", async () => {
    const res = await ctx.client.request<any>(
      courseCompletionEmailQuery,
      { slug: "course2" },
      FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
    )

    expect(res.course.completion_email).toMatchObject({
      name: "course2 completion",
    })
  })

  it("refuses a normal user reading another course's completion_email", async () => {
    await expect(
      ctx.client.request(
        courseCompletionEmailQuery,
        { slug: "course1" },
        FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
      ),
    ).rejects.toThrow(/Not authorized/)
  })

  it("loads a course owner's ownerships once for a list of courses", async () => {
    const findOwnerships = jest.spyOn(ctx.prisma.courseOwnership, "findMany")

    const res = await ctx.client
      .rawRequest<any>(
        gql`
          {
            courses {
              slug
              completion_email {
                name
              }
              course_stats_email {
                id
              }
            }
          }
        `,
        {},
        FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
      )
      .catch((e) => e.response)

    const completionEmails = Object.fromEntries(
      res.data.courses.map((c: any) => [c.slug, c.completion_email?.name]),
    )
    expect(completionEmails).toMatchObject({
      course1: undefined,
      course2: "course2 completion",
    })
    expect(findOwnerships).toHaveBeenCalledTimes(1)
    findOwnerships.mockRestore()
  })
})

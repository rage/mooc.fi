import { orderBy } from "lodash"

import {
  createRequestHelpers,
  FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  ID_REGEX,
  RequestGet,
  RequestPost,
  setupTMCWithDefaultFakeUsers,
} from "../../../tests"
import { seed } from "../../../tests/data"

jest.mock("../../../config", () => ({
  ...jest.requireActual("../../../config"),
  CREDIT_REGISTRATION_DELEGATE_ORG_SLUG: "test",
}))

const ctx = getTestContext()

const COURSE1_ID = "00000000-0000-0000-0000-000000000002"
// Equal to the completion_date of every seeded course1 completion.
const CUTOFF = new Date("1900-01-01T08:00:00.000Z")

const delegateCourse = (id: string, cutoff = CUTOFF) =>
  ctx.prisma.course.update({
    where: { id },
    data: { credit_registration_delegated_at: cutoff },
  })

const createCompletion = (
  id: string,
  completion_date: Date | null,
  created_at: Date,
) =>
  ctx.prisma.completion.create({
    data: {
      id,
      course: { connect: { id: COURSE1_ID } },
      user: { connect: { id: "20000000000000000000000000000102" } },
      user_upstream_id: 1,
      email: "e@mail.com",
      eligible_for_ects: true,
      completion_date,
      created_at,
    },
  })

describe("API", () => {
  describe("/api/completions", () => {
    setupTMCWithDefaultFakeUsers()

    let getCompletions: (slug: string, registered?: boolean) => RequestGet
    let getCompletionInstructions: RequestGet
    let getCompletionTiers: RequestGet

    beforeEach(async () => {
      await seed(ctx.prisma)
      const { get } = createRequestHelpers(ctx.port)
      getCompletions = (slug: string, registered = false) =>
        get(
          `/api/completions/${slug}${
            registered ? `?registered=${registered}` : ""
          }`,
          {},
        )
      getCompletionInstructions = get(
        "/api/completionInstructions/course1/en",
        {},
      )
      getCompletionTiers = get("/api/completionTiers/course1", {})
    })

    it("errors on no auth", async () => {
      return getCompletions("course1")({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("errors on non-existent organization", async () => {
      return getCompletions("course1")({
        headers: { Authorization: "Basic bogus" },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("errors on non-basic authorization", async () => {
      return getCompletions("course1")({
        headers: FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("errors on non-existent course", async () => {
      return getCompletions("bogus")({
        headers: { Authorization: "Basic kissa" },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(404)
          expect(response.data.message).toContain("Course not found")
        })
    })

    it("returns correctly on course, skipping registered and showing duplicate completions", async () => {
      // Showing duplicate completions is important because students take exams multiple times and get multiple completions that way.
      const res = await getCompletions("course1")({
        headers: { Authorization: "Basic kissa" },
      })

      expect((res.data as any[]).map((c) => c.id).sort()).toEqual([
        "12400000-0000-0000-0000-000000000001",
        "30000000-0000-0000-0000-000000000102",
        "30000000-0000-0000-0000-000000000104",
        "30000000-0000-0000-0000-000000000105",
      ])
    })

    it("returns correctly on course alias, skipping registered and showing duplicate completions", async () => {
      // Showing duplicate completions is important because students take exams multiple times and get multiple completions that way.
      const res = await getCompletions("alias")({
        headers: { Authorization: "Basic kissa" },
      })

      expect((res.data as any[]).map((c) => c.id).sort()).toEqual([
        "12400000-0000-0000-0000-000000000001",
        "30000000-0000-0000-0000-000000000102",
        "30000000-0000-0000-0000-000000000104",
        "30000000-0000-0000-0000-000000000105",
      ])
    })

    it("returns correctly on course when registered query parameter is set, not skipping duplicate completions", async () => {
      const res = await getCompletions(
        "course1",
        true,
      )({
        headers: { Authorization: "Basic kissa" },
      })

      expect((res.data as any[]).map((c) => c.id).sort()).toEqual([
        "12400000-0000-0000-0000-000000000001",
        "30000000-0000-0000-0000-000000000102",
        "30000000-0000-0000-0000-000000000104",
        "30000000-0000-0000-0000-000000000105",
        "30000000-0000-0000-0000-000000000106",
      ])
    })

    it("returns correctly on course with a completion handler", async () => {
      const res = await getCompletions("handled")({
        headers: { Authorization: "Basic kissa" },
      })

      expect((res.data as any[]).map((c) => c.id).sort()).toEqual([
        "30000000-0000-0000-0000-000000000107",
      ])
    })

    it("returns only completions dated before the cutoff of a delegated course", async () => {
      await delegateCourse(COURSE1_ID)
      await createCompletion(
        "30000000-0000-0000-0000-000000000201",
        new Date("1899-12-31T00:00:00.000Z"),
        new Date("1900-01-02T00:00:00.000Z"),
      )
      await createCompletion(
        "30000000-0000-0000-0000-000000000202",
        null,
        new Date("1899-12-31T00:00:00.000Z"),
      )
      await createCompletion(
        "30000000-0000-0000-0000-000000000203",
        null,
        new Date("1900-01-02T00:00:00.000Z"),
      )

      for (const registered of [false, true]) {
        const res = await getCompletions(
          "course1",
          registered,
        )({
          headers: { Authorization: "Basic kissa" },
        })

        expect((res.data as any[]).map((c) => c.id).sort()).toEqual([
          "30000000-0000-0000-0000-000000000201",
          "30000000-0000-0000-0000-000000000202",
        ])
      }
    })

    it("reads the cutoff from the completion handler", async () => {
      await delegateCourse("00000000-0000-0000-0000-000000000666")

      const res = await getCompletions("handled")({
        headers: { Authorization: "Basic kissa" },
      })

      expect(res.data).toEqual([])
    })

    it("returns course instructions", async () => {
      const res = await getCompletionInstructions({})

      expect(res.status).toBe(200)
    })

    it("returns course with multiple tiered registration links", async () => {
      const res = await getCompletionTiers({
        headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
      })

      expect(res.status).toBe(200)
    })
  })

  describe("/api/delegated-completions", () => {
    let getDelegatedCompletions: (
      courseId: string,
      upstreamId: number | string,
    ) => RequestGet

    beforeEach(async () => {
      await seed(ctx.prisma)
      const { get } = createRequestHelpers(ctx.port)
      getDelegatedCompletions = (courseId, upstreamId) =>
        get(`/api/delegated-completions/${courseId}/users/${upstreamId}`, {
          Authorization: "Basic kissa",
        })
    })

    it("errors on no auth", async () => {
      await delegateCourse(COURSE1_ID)
      return getDelegatedCompletions(
        COURSE1_ID,
        1,
      )({ headers: {} })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("errors on an organization other than the delegate", async () => {
      await delegateCourse(COURSE1_ID)
      return getDelegatedCompletions(
        COURSE1_ID,
        1,
      )({ headers: { Authorization: "Basic koira" } })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("errors on a course that is not delegated", async () => {
      return getDelegatedCompletions(
        COURSE1_ID,
        1,
      )({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(404)
        })
    })

    it("errors on a malformed course id", async () => {
      return getDelegatedCompletions(
        "course1",
        1,
      )({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(400)
        })
    })

    it("returns the user's completions with every registration", async () => {
      await delegateCourse(COURSE1_ID)
      await ctx.prisma.completionRegistered.create({
        data: {
          completion: {
            connect: { id: "30000000-0000-0000-0000-000000000102" },
          },
          course: { connect: { id: COURSE1_ID } },
          user: { connect: { id: "20000000000000000000000000000102" } },
          organization: { connect: { id: "10000000000000000000000000000102" } },
          real_student_number: "12345",
          registration_date: new Date("2026-10-01T00:00:00.000Z"),
        },
      })

      const res = await getDelegatedCompletions(COURSE1_ID, 1)({})

      expect(res.status).toBe(200)
      expect(res.data).toEqual([
        {
          id: "30000000-0000-0000-0000-000000000102",
          course_id: COURSE1_ID,
          completion_date: "1900-01-01T08:00:00.000Z",
          created_at: "1900-01-01T08:00:00.000Z",
          updated_at: "1900-01-01T08:00:00.000Z",
          completion_language: "en",
          grade: null,
          tier: 2,
          eligible_for_ects: true,
          registrations: [
            {
              organization_slug: "test",
              registration_date: "2026-10-01T00:00:00.000Z",
              created_at: expect.any(String),
            },
          ],
        },
      ])
    })

    it("returns an empty list for a user without completions", async () => {
      await delegateCourse(COURSE1_ID)

      const res = await getDelegatedCompletions(COURSE1_ID, 3)({})

      expect(res.data).toEqual([])
    })
  })

  describe("/api/register-completions", () => {
    const defaultHeaders = {
      Authorization: "Basic kissa",
    }

    let postCompletions: RequestPost

    beforeEach(async () => {
      await seed(ctx.prisma)
      const { post } = createRequestHelpers(ctx.port)
      postCompletions = post("/api/register-completions", defaultHeaders)
    })

    it("errors on wrong authorization", async () => {
      return postCompletions({
        data: { foo: 1 },
        headers: { Authorization: "foo" },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("errors on non-existent secret", async () => {
      return postCompletions({
        data: { foo: 1 },
        headers: { Authorization: "Basic ronsu" },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("errors on no completions", async () => {
      return postCompletions({ data: { foo: 1 } })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(400)
        })
    })

    it("errors on malformed completion", async () => {
      return postCompletions({
        data: {
          completions: [
            {
              foo: 1,
            },
          ],
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(400)
        })
    })

    it("creates registered completions", async () => {
      const res = await postCompletions({
        data: {
          completions: [
            {
              completion_id: "30000000-0000-0000-0000-000000000102",
              student_number: "12345",
            },
            {
              completion_id: "30000000-0000-0000-0000-000000000103",
              student_number: "12345",
            },
          ],
        },
      })

      expect(res.status).toBe(200)

      const addedCompletions = await ctx.prisma.completionRegistered.findMany({
        where: {
          user_id: "20000000000000000000000000000102",
        },
      })

      expect({
        addedCompletions: orderBy(addedCompletions, "completion_id"),
      }).toMatchSnapshot({
        addedCompletions: [
          {
            id: expect.stringMatching(ID_REGEX),
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
          },
          {
            id: expect.stringMatching(ID_REGEX),
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
          },
        ],
      })
    })

    it("skips a completion the organization already registered", async () => {
      const data = {
        completions: [
          {
            completion_id: "30000000-0000-0000-0000-000000000102",
            student_number: "12345",
          },
        ],
      }

      await postCompletions({ data })
      await postCompletions({ data })

      expect(
        await ctx.prisma.completionRegistered.count({
          where: { completion_id: "30000000-0000-0000-0000-000000000102" },
        }),
      ).toBe(1)
    })
  })
})

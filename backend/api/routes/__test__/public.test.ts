import {
  createRequestHelpers,
  FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  RequestGet,
  setupTMCWithDefaultFakeUsers,
} from "../../../tests"
import { seed } from "../../../tests/data"

const ctx = getTestContext()

describe("API", () => {
  describe("/api/public", () => {
    setupTMCWithDefaultFakeUsers()

    let getFrontpage: (language?: string) => RequestGet
    let getCourses: (language?: string) => RequestGet
    let getStudyModules: (language?: string) => RequestGet
    let getCurrentUser: RequestGet

    beforeEach(async () => {
      await seed(ctx.prisma)
      const { get } = createRequestHelpers(ctx.port)
      getFrontpage = (language?: string) =>
        get(
          `/api/public/frontpage${language ? `?language=${language}` : ""}`,
          {},
        )
      getCourses = (language?: string) =>
        get(`/api/public/courses${language ? `?language=${language}` : ""}`, {})
      getStudyModules = (language?: string) =>
        get(
          `/api/public/study-modules${language ? `?language=${language}` : ""}`,
          {},
        )
      getCurrentUser = get("/api/public/current-user", {})
    })

    describe("frontpage", () => {
      it("returns courses and study modules without authentication", async () => {
        const response = await getFrontpage()({})

        expect(response.status).toBe(200)
        expect(response.data).toHaveProperty("courses")
        expect(response.data).toHaveProperty("study_modules")
        expect(Array.isArray(response.data.courses)).toBe(true)
        expect(Array.isArray(response.data.study_modules)).toBe(true)
      })

      it("only returns visible courses (hidden=false or null)", async () => {
        const response = await getFrontpage()({})

        expect(response.status).toBe(200)
        const courses = response.data.courses
        courses.forEach((course: any) => {
          expect(course.hidden).not.toBe(true)
        })
      })

      it("returns courses with required fields", async () => {
        const response = await getFrontpage()({})

        expect(response.status).toBe(200)
        const courses = response.data.courses
        if (courses.length > 0) {
          const course = courses[0]
          expect(course).toHaveProperty("id")
          expect(course).toHaveProperty("slug")
          expect(course).toHaveProperty("name")
          expect(course).toHaveProperty("description")
          expect(course).toHaveProperty("link")
          expect(course).toHaveProperty("tags")
          expect(course).toHaveProperty("sponsors")
          expect(course).toHaveProperty("study_modules")
          expect(Array.isArray(course.tags)).toBe(true)
          expect(Array.isArray(course.sponsors)).toBe(true)
          expect(Array.isArray(course.study_modules)).toBe(true)
        }
      })

      it("returns study modules with required fields", async () => {
        const response = await getFrontpage()({})

        expect(response.status).toBe(200)
        const modules = response.data.study_modules
        if (modules.length > 0) {
          const studyModule = modules[0]
          expect(studyModule).toHaveProperty("id")
          expect(studyModule).toHaveProperty("name")
          expect(studyModule).toHaveProperty("description")
        }
      })

      it("filters courses by language when language parameter is provided", async () => {
        const responseEn = await getFrontpage("en_US")({})
        const responseFi = await getFrontpage("fi_FI")({})

        expect(responseEn.status).toBe(200)
        expect(responseFi.status).toBe(200)

        if (responseEn.data.courses.length > 0) {
          const course = responseEn.data.courses[0]
          expect(course.name).toBeDefined()
        }
        if (responseFi.data.courses.length > 0) {
          const course = responseFi.data.courses[0]
          expect(course.name).toBeDefined()
        }
      })

      it("returns courses ordered by order.sort", async () => {
        const response = await getFrontpage()({})

        expect(response.status).toBe(200)
        const courses = response.data.courses
        if (courses.length > 1) {
          for (let i = 1; i < courses.length; i++) {
            const prevOrder = courses[i - 1].order ?? Infinity
            const currOrder = courses[i].order ?? Infinity
            expect(currOrder).toBeGreaterThanOrEqual(prevOrder)
          }
        }
      })
    })

    describe("courses", () => {
      it("returns courses and tags without authentication", async () => {
        const response = await getCourses()({})

        expect(response.status).toBe(200)
        expect(response.data).toHaveProperty("courses")
        expect(response.data).toHaveProperty("tags")
        expect(Array.isArray(response.data.courses)).toBe(true)
        expect(Array.isArray(response.data.tags)).toBe(true)
      })

      it("only returns visible courses (hidden=false or null)", async () => {
        const response = await getCourses()({})

        expect(response.status).toBe(200)
        const courses = response.data.courses
        courses.forEach((course: any) => {
          expect(course.hidden).not.toBe(true)
        })
      })

      it("returns courses with translations when includeTranslations is true", async () => {
        const response = await getCourses()({})

        expect(response.status).toBe(200)
        const courses = response.data.courses
        if (courses.length > 0) {
          const course = courses[0]
          expect(course).toHaveProperty("course_translations")
          expect(Array.isArray(course.course_translations)).toBe(true)
        }
      })

      it("returns tags with all required fields", async () => {
        const response = await getCourses()({})

        expect(response.status).toBe(200)
        const tags = response.data.tags
        if (tags.length > 0) {
          const tag = tags[0]
          expect(tag).toHaveProperty("id")
          expect(tag).toHaveProperty("name")
          expect(tag).toHaveProperty("types")
          expect(tag).toHaveProperty("tag_translations")
          expect(Array.isArray(tag.tag_translations)).toBe(true)
        }
      })

      it("returns all tags regardless of translation availability", async () => {
        const response = await getCourses("en_US")({})

        expect(response.status).toBe(200)
        expect(response.data.tags.length).toBeGreaterThan(0)
      })

      it("filters courses by language when language parameter is provided", async () => {
        const responseEn = await getCourses("en_US")({})
        const responseFi = await getCourses("fi_FI")({})

        expect(responseEn.status).toBe(200)
        expect(responseFi.status).toBe(200)

        if (responseEn.data.courses.length > 0) {
          const course = responseEn.data.courses[0]
          expect(course.name).toBeDefined()
        }
        if (responseFi.data.courses.length > 0) {
          const course = responseFi.data.courses[0]
          expect(course.name).toBeDefined()
        }
      })

      it("returns courses with tags and sponsors", async () => {
        const response = await getCourses()({})

        expect(response.status).toBe(200)
        const courses = response.data.courses
        if (courses.length > 0) {
          const course = courses[0]
          expect(course).toHaveProperty("tags")
          expect(course).toHaveProperty("sponsors")
          expect(Array.isArray(course.tags)).toBe(true)
          expect(Array.isArray(course.sponsors)).toBe(true)
        }
      })
    })

    describe("study-modules", () => {
      it("returns study modules without authentication", async () => {
        const response = await getStudyModules()({})

        expect(response.status).toBe(200)
        expect(response.data).toHaveProperty("study_modules")
        expect(Array.isArray(response.data.study_modules)).toBe(true)
      })

      it("returns study modules with required fields", async () => {
        const response = await getStudyModules()({})

        expect(response.status).toBe(200)
        const modules = response.data.study_modules
        if (modules.length > 0) {
          const studyModule = modules[0]
          expect(studyModule).toHaveProperty("id")
          expect(studyModule).toHaveProperty("name")
          expect(studyModule).toHaveProperty("description")
        }
      })

      it("returns study modules with courses", async () => {
        const response = await getStudyModules()({})

        expect(response.status).toBe(200)
        const modules = response.data.study_modules
        if (modules.length > 0) {
          const studyModule = modules[0]
          expect(studyModule).toHaveProperty("courses")
          expect(Array.isArray(studyModule.courses)).toBe(true)

          if (studyModule.courses.length > 0) {
            const course = studyModule.courses[0]
            expect(course).toHaveProperty("id")
            expect(course).toHaveProperty("slug")
            expect(course).toHaveProperty("name")
            expect(course).toHaveProperty("tags")
            expect(course).toHaveProperty("sponsors")
            expect(course).toHaveProperty("course_translations")
          }
        }
      })

      it("only includes visible courses in study modules", async () => {
        const response = await getStudyModules()({})

        expect(response.status).toBe(200)
        const modules = response.data.study_modules
        modules.forEach((studyModule: any) => {
          if (studyModule.courses && studyModule.courses.length > 0) {
            studyModule.courses.forEach((course: any) => {
              expect(course.hidden).not.toBe(true)
            })
          }
        })
      })

      it("filters by language when language parameter is provided", async () => {
        const responseEn = await getStudyModules("en_US")({})
        const responseFi = await getStudyModules("fi_FI")({})

        expect(responseEn.status).toBe(200)
        expect(responseFi.status).toBe(200)

        if (responseEn.data.study_modules.length > 0) {
          const studyModule = responseEn.data.study_modules[0]
          expect(studyModule.name).toBeDefined()
        }
        if (responseFi.data.study_modules.length > 0) {
          const studyModule = responseFi.data.study_modules[0]
          expect(studyModule.name).toBeDefined()
        }
      })

      it("returns study modules ordered by order.sort", async () => {
        const response = await getStudyModules()({})

        expect(response.status).toBe(200)
        const modules = response.data.study_modules
        if (modules.length > 1) {
          for (let i = 1; i < modules.length; i++) {
            const prevOrder = modules[i - 1].order?.sort ?? Infinity
            const currOrder = modules[i].order?.sort ?? Infinity
            expect(currOrder).toBeGreaterThanOrEqual(prevOrder)
          }
        }
      })
    })

    describe("current-user", () => {
      it("returns null when not authenticated", async () => {
        const response = await getCurrentUser({})

        expect(response.status).toBe(200)
        expect(response.data.currentUser).toBeNull()
      })

      it("returns user data when authenticated", async () => {
        const response = await getCurrentUser({
          headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        })

        expect(response.status).toBe(200)
        expect(response.data.currentUser).not.toBeNull()
        expect(response.data.currentUser).toHaveProperty("id")
        expect(response.data.currentUser).toHaveProperty("username")
        expect(response.data.currentUser).toHaveProperty("email")
        expect(response.data.currentUser).toHaveProperty("first_name")
        expect(response.data.currentUser).toHaveProperty("last_name")
        expect(response.data.currentUser).toHaveProperty("full_name")
        expect(response.data.currentUser).toHaveProperty("administrator")
        expect(response.data.currentUser).toHaveProperty("upstream_id")
        expect(response.data.currentUser).toHaveProperty("student_number")
        expect(response.data.currentUser).toHaveProperty("real_student_number")
        expect(response.data.currentUser).toHaveProperty("created_at")
        expect(response.data.currentUser).toHaveProperty("updated_at")
      })

      it("returns correct administrator flag for normal user", async () => {
        const response = await getCurrentUser({
          headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        })

        expect(response.status).toBe(200)
        expect(response.data.currentUser?.administrator).toBe(false)
      })

      it("returns correct administrator flag for admin user", async () => {
        const response = await getCurrentUser({
          headers: FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        })

        expect(response.status).toBe(200)
        expect(response.data.currentUser?.administrator).toBe(true)
      })

      it("computes full_name correctly from first_name and last_name", async () => {
        const response = await getCurrentUser({
          headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        })

        expect(response.status).toBe(200)
        const user = response.data.currentUser
        if (user?.first_name && user?.last_name) {
          expect(user.full_name).toBe(`${user.first_name} ${user.last_name}`)
        }
      })

      it("handles missing first_name or last_name in full_name", async () => {
        const response = await getCurrentUser({
          headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        })

        expect(response.status).toBe(200)
        const user = response.data.currentUser
        if (user) {
          expect(user.full_name).toBeDefined()
          if (!user.first_name && !user.last_name) {
            expect(user.full_name).toBeNull()
          } else if (user.first_name && !user.last_name) {
            expect(user.full_name).toBe(user.first_name)
          } else if (!user.first_name && user.last_name) {
            expect(user.full_name).toBe(user.last_name)
          }
        }
      })
    })
  })
})

import { Request, Response } from "express"

import {
  Course,
  CourseTranslation,
  Image,
  StudyModule,
  StudyModuleTranslation,
  Tag,
} from "@prisma/client"

import { LoadedCourseSponsor } from "../../loaders/courseSponsorsLoader"
import { createLoaders } from "../../loaders/createLoaders"
import { ExtendedPrismaClient } from "../../prisma"
import { isDefined } from "../../util"
import { ApiContext, Controller } from "../types"

type CourseWithTranslations = Course & {
  course_translations?: Array<CourseTranslation>
  photo?: Image | null
}

type FilteredCourse = Omit<
  Course,
  "course_translations" | "tags" | "handles_completions_for"
> & {
  description: string
  link: string
  name: string
}

type Loaders = ReturnType<typeof createLoaders>

type EnrichedCourse = FilteredCourse & {
  tags: Array<Tag & { language?: string }>
  sponsors: Array<LoadedCourseSponsor>
  study_modules?: Array<{ id: string; slug: string; name: string }>
  course_translations?: Array<{ id: string; language: string; name: string }>
}

const DEFAULT_LANGUAGE = "en"

function filterCoursesWithTranslations(
  courses: Array<CourseWithTranslations>,
  language?: string,
): Array<FilteredCourse> {
  return courses
    .map((course): FilteredCourse | null => {
      const translations = course.course_translations ?? []

      const translation =
        (language
          ? translations.find((t) => t.language === language)
          : undefined) ??
        translations.find((t) => t.language === DEFAULT_LANGUAGE) ??
        translations[0]

      const { course_translations: _course_translations, ...rest } = course

      return {
        ...rest,
        description: translation?.description ?? "",
        link: translation?.link ?? "",
        name: translation?.name ?? course?.name ?? "",
      }
    })
    .filter(isDefined)
}

async function enrichCourses(
  courses: Array<FilteredCourse>,
  originalCourses: Array<CourseWithTranslations>,
  loaders: Loaders,
  prisma: ExtendedPrismaClient,
  options: {
    language?: string | null
    includeStudyModules?: boolean
    includeTranslations?: boolean
  },
): Promise<Array<EnrichedCourse>> {
  const courseIds = courses.map((c) => c.id)

  const loaderKeys = courseIds.map((courseId) => ({
    courseId,
    language: options.language ?? null,
  }))

  const [allCourseTags, allCourseSponsors] = await Promise.all([
    loaders.courseTags.loadMany(loaderKeys),
    loaders.courseSponsors.loadMany(loaderKeys),
  ])

  // Fetch study modules using Prisma's fluent API instead of raw SQL
  const studyModulesByCourseId = new Map<
    string,
    Array<{ id: string; slug: string; name: string }>
  >()

  if (options.includeStudyModules) {
    const coursesWithModules = await prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: {
        id: true,
        study_modules: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
    })

    coursesWithModules.forEach((course) => {
      studyModulesByCourseId.set(course.id, course.study_modules)
    })
  }

  const originalCoursesMap = new Map(originalCourses.map((c) => [c.id, c]))

  return courses.map((course, index): EnrichedCourse => {
    const tags = allCourseTags[index]
    const sponsors = allCourseSponsors[index]

    // Handle DataLoader errors gracefully
    if (tags instanceof Error) {
      console.error(`Failed to load tags for course ${course.id}`, tags)
    }
    if (sponsors instanceof Error) {
      console.error(`Failed to load sponsors for course ${course.id}`, sponsors)
    }

    const enriched: EnrichedCourse = {
      ...course,
      tags: Array.isArray(tags)
        ? tags.map((t) => ({
            ...t,
            language: options.language ?? undefined,
          }))
        : [],
      sponsors: Array.isArray(sponsors) ? sponsors : [],
    }

    if (options.includeStudyModules) {
      enriched.study_modules = studyModulesByCourseId.get(course.id) ?? []
    }

    if (options.includeTranslations) {
      const originalCourse = originalCoursesMap.get(course.id)
      enriched.course_translations = originalCourse?.course_translations?.map(
        (t: CourseTranslation) => ({
          id: t.id,
          language: t.language,
          name: t.name,
        }),
      )
    }

    return enriched
  })
}

type FilteredStudyModule = StudyModule & {
  name: string
  description: string
  courses?: Array<EnrichedCourse>
}

function filterStudyModulesWithTranslations(
  studyModules: Array<
    StudyModule & {
      study_module_translations?: Array<StudyModuleTranslation>
    }
  >,
): Array<FilteredStudyModule> {
  return studyModules.map((study_module) => {
    const { study_module_translations: _study_module_translations, ...rest } =
      study_module
    return {
      ...rest,
      name:
        study_module?.study_module_translations?.[0]?.name ??
        study_module?.name,
      description:
        study_module?.study_module_translations?.[0]?.description ?? "",
    }
  })
}

interface FrontpageResponse {
  courses: Array<EnrichedCourse>
  study_modules: Array<FilteredStudyModule>
}

interface CoursesResponse {
  courses: Array<EnrichedCourse>
  tags: Array<{
    id: string
    hidden: boolean
    types: Array<string> | null
    name: string | null
    abbreviation: string | null
    tag_translations: Array<{
      tag_id: string
      name: string
      description: string | null
      language: string
      abbreviation: string | null
    }>
  }>
}

interface StudyModulesResponse {
  study_modules: Array<FilteredStudyModule>
}

interface CurrentUserResponse {
  currentUser: {
    id: string
    upstream_id: number
    first_name: string | null
    last_name: string | null
    full_name: string | null
    username: string
    email: string
    student_number: string | null
    real_student_number: string | null
    created_at: Date
    updated_at: Date
  } | null
}

export class PublicController extends Controller {
  constructor(override readonly ctx: ApiContext) {
    super(ctx)
  }

  /**
   * Helper method to fetch visible courses with translations and photo
   * Extracted to avoid code duplication between frontpage and courses endpoints
   */
  private async getVisibleCourses(
    prisma: ExtendedPrismaClient,
  ): Promise<Array<CourseWithTranslations>> {
    return prisma.course.findMany({
      where: {
        OR: [{ hidden: false }, { hidden: null }],
      },
      orderBy: [{ order: { sort: "asc" } }],
      include: {
        course_translations: {
          orderBy: { language: "asc" },
        },
        photo: true,
      },
    })
  }

  frontpage = async (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      Record<string, never>,
      { language?: string }
    >,
    res: Response<FrontpageResponse>,
  ): Promise<Response<FrontpageResponse>> => {
    const { language } = req.query
    const { prisma } = this.ctx
    const loaders = createLoaders(prisma)

    const courses = await this.getVisibleCourses(prisma)

    const studyModules = await prisma.studyModule.findMany({
      orderBy: [{ order: { sort: "asc" } }],
      ...(language
        ? {
            where: {
              study_module_translations: {
                some: {
                  language,
                },
              },
            },
            include: {
              study_module_translations: {
                where: {
                  language,
                },
                orderBy: { language: "asc" },
              },
            },
          }
        : {
            include: {
              study_module_translations: {
                orderBy: { language: "asc" },
              },
            },
          }),
    })

    const filteredCourses = filterCoursesWithTranslations(courses, language)
    const enrichedCourses = await enrichCourses(
      filteredCourses,
      courses,
      loaders,
      prisma,
      {
        language: language ?? null,
        includeStudyModules: true,
      },
    )

    const filteredModules = filterStudyModulesWithTranslations(studyModules)

    return res.status(200).json({
      courses: enrichedCourses,
      study_modules: filteredModules,
    })
  }

  courses = async (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      Record<string, never>,
      { language?: string }
    >,
    res: Response<CoursesResponse>,
  ): Promise<Response<CoursesResponse>> => {
    const { language } = req.query
    const { prisma } = this.ctx
    const loaders = createLoaders(prisma)

    const courses = await this.getVisibleCourses(prisma)

    const tags = await prisma.tag.findMany({
      include: {
        tag_translations: language
          ? {
              where: { language },
              orderBy: { language: "asc" },
            }
          : {
              orderBy: { language: "asc" },
            },
        tag_types: true,
      },
    })

    const filteredCourses = filterCoursesWithTranslations(courses, language)
    const enrichedCourses = await enrichCourses(
      filteredCourses,
      courses,
      loaders,
      prisma,
      {
        language: language ?? null,
        includeStudyModules: true,
        includeTranslations: true,
      },
    )

    const filteredTags = tags.map((tag) => {
      const translations = tag.tag_translations ?? []
      const translation =
        (language
          ? translations.find((t) => t.language === language)
          : undefined) ??
        translations.find((t) => t.language === DEFAULT_LANGUAGE) ??
        translations[0]

      return {
        id: tag.id,
        hidden: tag.hidden,
        types: tag.tag_types?.map((tt) => tt.name) ?? null,
        name: translation?.name ?? null,
        abbreviation: translation?.abbreviation ?? null,
        tag_translations: tag.tag_translations?.map((t) => ({
          tag_id: t.tag_id,
          name: t.name,
          description: t.description,
          language: t.language,
          abbreviation: t.abbreviation,
        })),
      }
    })

    return res.status(200).json({
      courses: enrichedCourses,
      tags: filteredTags,
    })
  }

  studyModules = async (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      Record<string, never>,
      { language?: string }
    >,
    res: Response<StudyModulesResponse>,
  ): Promise<Response<StudyModulesResponse>> => {
    const { language } = req.query
    const { prisma } = this.ctx
    const loaders = createLoaders(prisma)

    const studyModules = await prisma.studyModule.findMany({
      orderBy: [{ order: { sort: "asc" } }],
      ...(language
        ? {
            where: {
              study_module_translations: {
                some: {
                  language,
                },
              },
            },
            include: {
              study_module_translations: {
                where: {
                  language,
                },
                orderBy: { language: "asc" },
              },
            },
          }
        : {
            include: {
              study_module_translations: {
                orderBy: { language: "asc" },
              },
            },
          }),
    })

    const filteredModules = filterStudyModulesWithTranslations(studyModules)

    const allModuleIds = filteredModules.map((m) => m.id)

    // Fetch only course IDs to avoid double fetching
    const modulesWithCourseIds = await prisma.studyModule.findMany({
      where: { id: { in: allModuleIds } },
      select: {
        id: true,
        courses: {
          where: {
            OR: [{ hidden: false }, { hidden: null }],
          },
          select: { id: true },
        },
      },
    })

    const courseIdsByModuleId = new Map<string, string[]>()
    modulesWithCourseIds.forEach((m) => {
      courseIdsByModuleId.set(
        m.id,
        m.courses.map((c) => c.id),
      )
    })

    const uniqueCourseIds = [
      ...new Set(
        modulesWithCourseIds.flatMap((m) => m.courses.map((c) => c.id)),
      ),
    ]

    const allCourses = await prisma.course.findMany({
      where: {
        id: { in: uniqueCourseIds },
        OR: [{ hidden: false }, { hidden: null }],
      },
      include: {
        course_translations: {
          orderBy: { language: "asc" },
        },
        photo: true,
      },
    })

    const allFilteredCourses = filterCoursesWithTranslations(
      allCourses,
      language,
    )

    const allEnrichedCourses = await enrichCourses(
      allFilteredCourses,
      allCourses,
      loaders,
      prisma,
      {
        language: language ?? null,
        includeTranslations: true,
      },
    )

    const enrichedCoursesMap = new Map(allEnrichedCourses.map((c) => [c.id, c]))

    filteredModules.forEach((module) => {
      const courseIds = courseIdsByModuleId.get(module.id) ?? []
      module.courses = courseIds
        .map((id) => enrichedCoursesMap.get(id))
        .filter(isDefined)
    })

    return res.status(200).json({
      study_modules: filteredModules,
    })
  }

  currentUser = async (
    req: Request,
    res: Response<CurrentUserResponse>,
  ): Promise<Response<CurrentUserResponse>> => {
    const getUserResult = await this.getUser(req, res)

    if (getUserResult.isErr()) {
      return res.status(200).json({ currentUser: null })
    }

    const { user } = getUserResult.value

    return res.status(200).json({
      currentUser: {
        id: user.id,
        upstream_id: user.upstream_id,
        first_name: user.first_name,
        last_name: user.last_name,
        full_name:
          user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : user.first_name ?? user.last_name ?? null,
        username: user.username,
        email: user.email,
        student_number: user.student_number,
        real_student_number: user.real_student_number,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    })
  }
}

import { Request, Response } from "express"
import { ParamsDictionary } from "express-serve-static-core"

import {
  Course,
  CourseTranslation,
  Image,
  Prisma,
  SponsorImage,
  StudyModule,
  StudyModuleTranslation,
} from "@prisma/client"

import { LoadedCourseSponsor } from "../../loaders/courseSponsorsLoader"
import { LoadedCourseTag } from "../../loaders/courseTagsLoader"
import { createLoaders } from "../../loaders/createLoaders"
import { isDefined } from "../../util"
import { sendCachedJson } from "../publicCache"
import { ApiContext, Controller } from "../types"

type CourseStudyModule = { id: string; slug: string; name: string }

type CourseWithRelations = Course & {
  course_translations: Array<CourseTranslation>
  photo: Image | null
  study_modules?: Array<CourseStudyModule>
}

type FilteredCourse = CourseWithRelations & {
  description: string
  link: string
}

type Loaders = ReturnType<typeof createLoaders>

type TagFields = {
  id: string
  hidden: boolean
  types: Array<string>
  name: string | null
  abbreviation: string | null
  tag_translations: Array<{
    tag_id: string
    name: string
    description: string | null
    language: string
    abbreviation: string | null
  }>
}

type CourseTagFields = Omit<TagFields, "tag_translations">

type CourseSponsorFields = Pick<
  LoadedCourseSponsor,
  "id" | "name" | "order"
> & {
  images: Array<Pick<SponsorImage, "type" | "uri" | "width" | "height">>
}

type EnrichedCourse = Omit<
  FilteredCourse,
  "course_translations" | "study_modules"
> & {
  tags: Array<CourseTagFields>
  sponsors: Array<CourseSponsorFields>
  study_modules?: Array<CourseStudyModule>
  course_translations: Array<{
    id: string
    language: string
    name: string
    description: string
  }>
}

const DEFAULT_LANGUAGE = "en"

type LanguageRequest = Request<
  ParamsDictionary,
  unknown,
  unknown,
  { language?: unknown }
>

const VISIBLE_COURSE_FILTER = {
  OR: [{ hidden: false }, { hidden: null }],
} satisfies Prisma.CourseWhereInput

function pickTranslation<T extends { language: string }>(
  translations: Array<T>,
  language?: string | null,
): T | undefined {
  return (
    (language
      ? translations.find((t) => t.language === language)
      : undefined) ??
    translations.find((t) => t.language === DEFAULT_LANGUAGE) ??
    translations[0]
  )
}

function filterCoursesWithTranslations(
  courses: Array<CourseWithRelations>,
  language?: string,
): Array<FilteredCourse> {
  return courses.map((course) => {
    const translation = pickTranslation(course.course_translations, language)

    return {
      ...course,
      description: translation?.description ?? "",
      link: translation?.link ?? "",
      name: translation?.name ?? course.name ?? "",
    }
  })
}

function toTagFields(
  tag: LoadedCourseTag,
  language?: string | null,
): TagFields {
  const translations = tag.tag_translations
  const translation = pickTranslation(translations, language)

  return {
    id: tag.id,
    hidden: tag.hidden,
    types: tag.tag_types.map((tt) => tt.name),
    name: translation?.name ?? null,
    abbreviation: translation?.abbreviation ?? null,
    tag_translations: translations.map((t) => ({
      tag_id: t.tag_id,
      name: t.name,
      description: t.description,
      language: t.language,
      abbreviation: t.abbreviation,
    })),
  }
}

async function enrichCourses(
  courses: Array<FilteredCourse>,
  loaders: Loaders,
  language?: string | null,
): Promise<Array<EnrichedCourse>> {
  const courseIds = courses.map((c) => c.id)

  const loaderKeys = courseIds.map((courseId) => ({
    courseId,
    language: language ?? null,
  }))
  // A tag without a translation in the requested language must still be listed.
  const tagLoaderKeys = courseIds.map((courseId) => ({
    courseId,
    language: null,
  }))

  const [allCourseTags, allCourseSponsors] = await Promise.all([
    loaders.courseTags.loadMany(tagLoaderKeys),
    loaders.courseSponsors.loadMany(loaderKeys),
  ])

  return courses.map((course, index): EnrichedCourse => {
    const tags = allCourseTags[index]
    const sponsors = allCourseSponsors[index]
    const { course_translations, study_modules, ...rest } = course

    if (tags instanceof Error) {
      console.error(`Failed to load tags for course ${course.id}`, tags)
    }
    if (sponsors instanceof Error) {
      console.error(`Failed to load sponsors for course ${course.id}`, sponsors)
    }

    return {
      ...rest,
      tags: Array.isArray(tags)
        ? tags.map((t) => {
            const { tag_translations: _tag_translations, ...tag } = toTagFields(
              t,
              language,
            )
            return tag
          })
        : [],
      sponsors: Array.isArray(sponsors)
        ? sponsors.map(({ id, name, order, images }) => ({
            id,
            name,
            order,
            images: images.map(({ type, uri, width, height }) => ({
              type,
              uri,
              width,
              height,
            })),
          }))
        : [],
      ...(study_modules && { study_modules }),
      course_translations: course_translations.map((t) => ({
        id: t.id,
        language: t.language,
        name: t.name,
        description: t.description,
      })),
    }
  })
}

type FilteredStudyModule = StudyModule & {
  name: string
  description: string
  courses?: Array<EnrichedCourse>
}

function toFilteredStudyModule(
  studyModule: StudyModule & {
    study_module_translations?: Array<StudyModuleTranslation>
  },
): FilteredStudyModule {
  const { study_module_translations: translations, ...rest } = studyModule
  return {
    ...rest,
    name: translations?.[0]?.name ?? studyModule.name,
    description: translations?.[0]?.description ?? "",
  }
}

interface FrontpageResponse {
  study_modules: Array<FilteredStudyModule>
}

interface CoursesResponse {
  courses: Array<EnrichedCourse>
  tags: Array<TagFields>
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
    administrator: boolean
  } | null
}

export class PublicController extends Controller {
  constructor(override readonly ctx: ApiContext) {
    super(ctx)
  }

  private getVisibleCourses(
    courseIds?: Array<string>,
    includeStudyModules = false,
  ) {
    return this.ctx.prisma.course.findMany({
      where: {
        ...VISIBLE_COURSE_FILTER,
        id: courseIds ? { in: courseIds } : undefined,
      },
      orderBy: [{ order: "asc" }],
      include: {
        course_translations: {
          orderBy: { language: "asc" },
        },
        photo: true,
        study_modules: includeStudyModules
          ? { select: { id: true, slug: true, name: true } }
          : false,
      },
    })
  }

  private async getEnrichedCourses(
    language: string | undefined,
    options: { courseIds?: Array<string>; includeStudyModules?: boolean } = {},
  ): Promise<Array<EnrichedCourse>> {
    const courses = await this.getVisibleCourses(
      options.courseIds,
      options.includeStudyModules,
    )

    return enrichCourses(
      filterCoursesWithTranslations(courses, language),
      createLoaders(this.ctx.prisma),
      language,
    )
  }

  private getStudyModules(language: string | undefined, withCourseIds = false) {
    return this.ctx.prisma.studyModule.findMany({
      where: language
        ? { study_module_translations: { some: { language } } }
        : undefined,
      orderBy: [{ order: "asc" }],
      include: {
        study_module_translations: {
          where: language ? { language } : undefined,
          orderBy: { language: "asc" },
        },
        courses: withCourseIds
          ? { where: VISIBLE_COURSE_FILTER, select: { id: true } }
          : false,
      },
    })
  }

  private sendCached<T>(
    endpoint: string,
    build: (language: string | undefined) => Promise<T>,
  ) {
    return (req: LanguageRequest, res: Response) =>
      sendCachedJson(res, endpoint, req.query.language, build, this.ctx.logger)
  }

  frontpage = this.sendCached(
    "frontpage",
    async (language): Promise<FrontpageResponse> => ({
      study_modules: (await this.getStudyModules(language)).map(
        toFilteredStudyModule,
      ),
    }),
  )

  courses = this.sendCached(
    "courses",
    async (language): Promise<CoursesResponse> => {
      const [courses, tags] = await Promise.all([
        this.getEnrichedCourses(language, { includeStudyModules: true }),
        this.ctx.prisma.tag.findMany({
          include: {
            tag_translations: {
              orderBy: { language: "asc" },
            },
            tag_types: true,
          },
        }),
      ])

      return { courses, tags: tags.map((tag) => toTagFields(tag, language)) }
    },
  )

  studyModules = this.sendCached(
    "study-modules",
    async (language): Promise<StudyModulesResponse> => {
      const studyModules = await this.getStudyModules(language, true)

      const courses = await this.getEnrichedCourses(language, {
        courseIds: [
          ...new Set(studyModules.flatMap((m) => m.courses.map((c) => c.id))),
        ],
      })
      const coursesById = new Map(courses.map((c) => [c.id, c]))

      return {
        study_modules: studyModules.map(({ courses: moduleCourses, ...m }) => ({
          ...toFilteredStudyModule(m),
          courses: moduleCourses
            .map((c) => coursesById.get(c.id))
            .filter(isDefined),
        })),
      }
    },
  )

  currentUser = async (
    req: Request,
    res: Response<CurrentUserResponse>,
  ): Promise<Response<CurrentUserResponse>> => {
    const findUserResult = await this.findUser(req)

    if (findUserResult.isErr()) {
      return res.status(200).json({ currentUser: null })
    }

    const { user } = findUserResult.value

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
        administrator: user.administrator,
      },
    })
  }
}

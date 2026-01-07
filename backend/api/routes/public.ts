import { Request, Response } from "express"
import { omit } from "lodash"

import {
  Course,
  CourseTranslation,
  StudyModule,
  StudyModuleTranslation,
  Tag,
  TagTranslation,
  TagType,
  User,
} from "@prisma/client"

import { createLoaders } from "../../loaders/createLoaders"
import { filterNullRecursive, isDefined } from "../../util"
import { ApiContext, Controller } from "../types"

export class PublicController extends Controller {
  constructor(override readonly ctx: ApiContext) {
    super(ctx)
  }

  frontpage = async (
    req: Request<{}, {}, {}, { language?: string }>,
    res: Response,
  ) => {
    const { language } = req.query
    const { prisma } = this.ctx
    const loaders = createLoaders(prisma)

    const courses = await prisma.course.findMany({
      where: {
        OR: [{ hidden: false }, { hidden: null }],
      },
      orderBy: [{ order: { sort: "asc" } }],
      include: {
        course_translations: true,
        photo: true,
      },
    })

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
              },
            },
          }
        : {}),
    })

    const filteredCourses = courses
      .map((course) => {
        const translationForLanguage = language
          ? course.course_translations?.find((t) => t.language === language)
          : undefined
        const translation =
          translationForLanguage ?? course.course_translations?.[0]

        return {
          ...omit(course, [
            "course_translations",
            "tags",
            "handles_completions_for",
          ]),
          description: translation?.description ?? "",
          link: translation?.link ?? "",
          name: translation?.name ?? course?.name ?? "",
        }
      })
      .filter(isDefined)

    const filteredModules = studyModules.map((study_module) => ({
      ...omit(study_module, "study_module_translations"),
      name:
        study_module?.study_module_translations?.[0]?.name ??
        study_module?.name,
      description:
        study_module?.study_module_translations?.[0]?.description ?? "",
    }))

    for (const course of filteredCourses) {
      const courseTags = await loaders.courseTags.load({
        courseId: course.id,
        language: language ?? null,
      })
      course.tags = courseTags.map((t) => ({
        ...t,
        language: language ?? undefined,
      }))

      const courseSponsors = await loaders.courseSponsors.load({
        courseId: course.id,
        language: language ?? null,
      })
      course.sponsors = courseSponsors

      const studyModuleIds = await prisma.courseStudyModule.findMany({
        where: { course_id: course.id },
        select: { study_module_id: true },
      })
      const modules = await prisma.studyModule.findMany({
        where: {
          id: { in: studyModuleIds.map((m) => m.study_module_id) },
        },
        select: {
          id: true,
          slug: true,
          name: true,
        },
      })
      course.study_modules = modules
    }

    return res.status(200).json({
      courses: filteredCourses,
      study_modules: filteredModules,
    })
  }

  courses = async (
    req: Request<{}, {}, {}, { language?: string }>,
    res: Response,
  ) => {
    const { language } = req.query
    const { prisma } = this.ctx
    const loaders = createLoaders(prisma)

    const courses = await prisma.course.findMany({
      where: {
        OR: [{ hidden: false }, { hidden: null }],
      },
      orderBy: [{ order: { sort: "asc" } }],
      include: {
        course_translations: true,
        photo: true,
      },
    })

    const tags = await prisma.tag.findMany({
      where: {
        ...(language
          ? {
              tag_translations: {
                some: { language },
              },
            }
          : {}),
      },
      include: {
        tag_translations: language
          ? {
              where: { language },
            }
          : true,
        tag_types: true,
      },
    })

    const filteredCourses = courses
      .map((course) => {
        const translationForLanguage = language
          ? course.course_translations?.find((t) => t.language === language)
          : undefined
        const translation =
          translationForLanguage ?? course.course_translations?.[0]

        return {
          ...omit(course, [
            "course_translations",
            "tags",
            "handles_completions_for",
          ]),
          description: translation?.description ?? "",
          link: translation?.link ?? "",
          name: translation?.name ?? course?.name ?? "",
        }
      })
      .filter(isDefined)

    for (const course of filteredCourses) {
      const courseTags = await loaders.courseTags.load({
        courseId: course.id,
        language: language ?? null,
      })
      course.tags = courseTags.map((t) => ({
        ...t,
        language: language ?? undefined,
      }))

      const courseSponsors = await loaders.courseSponsors.load({
        courseId: course.id,
        language: language ?? null,
      })
      course.sponsors = courseSponsors

      const studyModuleIds = await prisma.courseStudyModule.findMany({
        where: { course_id: course.id },
        select: { study_module_id: true },
      })
      const modules = await prisma.studyModule.findMany({
        where: {
          id: { in: studyModuleIds.map((m) => m.study_module_id) },
        },
        select: {
          id: true,
          slug: true,
          name: true,
        },
      })
      course.study_modules = modules

      course.course_translations = course.course_translations?.map((t) => ({
        id: t.id,
        language: t.language,
        name: t.name,
      }))
    }

    const filteredTags = tags.map((tag) => {
      const translation = language
        ? tag.tag_translations?.find((t) => t.language === language)
        : tag.tag_translations?.[0]

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
      courses: filteredCourses,
      tags: filteredTags,
    })
  }

  studyModules = async (
    req: Request<{}, {}, {}, { language?: string }>,
    res: Response,
  ) => {
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
              },
            },
          }
        : {}),
    })

    const filteredModules = studyModules.map((study_module) => ({
      ...omit(study_module, "study_module_translations"),
      name:
        study_module?.study_module_translations?.[0]?.name ??
        study_module?.name,
      description:
        study_module?.study_module_translations?.[0]?.description ?? "",
    }))

    for (const module of filteredModules) {
      const courseIds = await prisma.courseStudyModule.findMany({
        where: { study_module_id: module.id },
        select: { course_id: true },
      })

      const courses = await prisma.course.findMany({
        where: {
          id: { in: courseIds.map((c) => c.course_id) },
          OR: [{ hidden: false }, { hidden: null }],
        },
        include: {
          course_translations: true,
        },
      })

      const filteredCourses = courses
        .map((course) => {
          const translationForLanguage = language
            ? course.course_translations?.find((t) => t.language === language)
            : undefined
          const translation =
            translationForLanguage ?? course.course_translations?.[0]

          return {
            ...omit(course, [
              "course_translations",
              "tags",
              "handles_completions_for",
            ]),
            description: translation?.description ?? "",
            link: translation?.link ?? "",
            name: translation?.name ?? course?.name ?? "",
          }
        })
        .filter(isDefined)

      for (const course of filteredCourses) {
        const courseTags = await loaders.courseTags.load({
          courseId: course.id,
          language: language ?? null,
        })
        course.tags = courseTags.map((t) => ({
          ...t,
          language: language ?? undefined,
        }))

        const courseSponsors = await loaders.courseSponsors.load({
          courseId: course.id,
          language: language ?? null,
        })
        course.sponsors = courseSponsors

        course.course_translations = course.course_translations?.map((t) => ({
          id: t.id,
          language: t.language,
          name: t.name,
        }))
      }

      module.courses = filteredCourses
    }

    return res.status(200).json({
      study_modules: filteredModules,
    })
  }

  currentUser = async (req: Request, res: Response) => {
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
        full_name: user.full_name,
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

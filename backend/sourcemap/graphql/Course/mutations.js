"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var kafkaProducer_1 = tslib_1.__importDefault(
  require("../../services/kafkaProducer"),
)
var Image_1 = require("../Image")
var lodash_1 = require("lodash")
var redis_1 = require("../../services/redis")
var nexus_1 = require("nexus")
var apollo_server_core_1 = require("apollo-server-core")
var accessControl_1 = require("../../accessControl")
// for debug
/* const shallowCompare = (obj1: object, obj2: object) =>
  Object.keys(obj1).length === Object.keys(obj2).length &&
  Object.keys(obj1).every(
    key => obj2.hasOwnProperty(key) && obj1[key] === obj2[key],
  ) */
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    var _this = this
    t.field("addCourse", {
      type: "Course",
      args: {
        course: nexus_1.schema.arg({
          type: "CourseCreateArg",
          required: true,
        }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, _a, ctx) {
        var course = _a.course
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var // slug,
            new_photo,
            base64,
            course_translations,
            open_university_registration_links,
            course_variants,
            course_aliases,
            study_modules,
            inherit_settings_from,
            completions_handled_by,
            user_course_settings_visibilities,
            completion_email,
            photo,
            newImage,
            newCourse,
            kafkaProducer,
            producerMessage
          var _b
          return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
              case 0:
                ;(new_photo = course.new_photo),
                  (base64 = course.base64),
                  (course_translations = course.course_translations),
                  (open_university_registration_links =
                    course.open_university_registration_links),
                  (course_variants = course.course_variants),
                  (course_aliases = course.course_aliases),
                  (study_modules = course.study_modules),
                  (inherit_settings_from = course.inherit_settings_from),
                  (completions_handled_by = course.completions_handled_by),
                  (user_course_settings_visibilities =
                    course.user_course_settings_visibilities),
                  (completion_email = course.completion_email)
                photo = null
                if (!new_photo) return [3 /*break*/, 2]
                return [
                  4 /*yield*/,
                  Image_1.uploadImage({
                    ctx: ctx,
                    file: new_photo,
                    base64:
                      base64 !== null && base64 !== void 0 ? base64 : false,
                  }),
                ]
              case 1:
                newImage = _c.sent()
                photo = newImage.id
                _c.label = 2
              case 2:
                if (
                  study_modules === null || study_modules === void 0
                    ? void 0
                    : study_modules.some(function (s) {
                        return !s.id && !s.slug
                      })
                ) {
                  throw new apollo_server_core_1.UserInputError(
                    "study modules must have id or slug",
                  )
                }
                return [
                  4 /*yield*/,
                  ctx.db.course.create({
                    data: tslib_1.__assign(
                      tslib_1.__assign(
                        {},
                        lodash_1.omit(course, ["base64", "new_photo"]),
                      ),
                      {
                        name:
                          (_b = course.name) !== null && _b !== void 0
                            ? _b
                            : "",
                        photo: !!photo ? { connect: { id: photo } } : undefined,
                        course_translations: !!course_translations
                          ? { create: course_translations }
                          : undefined,
                        study_modules: !!study_modules
                          ? {
                              connect: study_modules.map(function (s) {
                                var _a
                                return {
                                  id:
                                    (_a = s.id) !== null && _a !== void 0
                                      ? _a
                                      : undefined,
                                }
                              }),
                            }
                          : undefined,
                        open_university_registration_links: !!open_university_registration_links
                          ? { create: open_university_registration_links }
                          : undefined,
                        course_variants: !!course_variants
                          ? { create: course_variants }
                          : undefined,
                        course_aliases: !!course_aliases
                          ? { create: course_aliases }
                          : undefined,
                        inherit_settings_from: !!inherit_settings_from
                          ? { connect: { id: inherit_settings_from } }
                          : undefined,
                        completions_handled_by: !!completions_handled_by
                          ? { connect: { id: completions_handled_by } }
                          : undefined,
                        user_course_settings_visibilities: !!user_course_settings_visibilities
                          ? { create: user_course_settings_visibilities }
                          : undefined,
                        // don't think this will be passed by parameter, but let's be sure
                        completion_email: !!completion_email
                          ? { connect: { id: completion_email } }
                          : undefined,
                      },
                    ),
                  }),
                ]
              case 3:
                newCourse = _c.sent()
                return [4 /*yield*/, new kafkaProducer_1["default"]()]
              case 4:
                kafkaProducer = _c.sent()
                producerMessage = {
                  message: JSON.stringify(newCourse),
                  partition: null,
                  topic: "new-course",
                }
                return [
                  4 /*yield*/,
                  kafkaProducer.queueProducerMessage(producerMessage),
                ]
              case 5:
                _c.sent()
                return [4 /*yield*/, kafkaProducer.disconnect()]
              case 6:
                _c.sent()
                return [2 /*return*/, newCourse]
            }
          })
        })
      },
    })
    t.field("updateCourse", {
      type: "Course",
      args: {
        course: nexus_1.schema.arg({
          type: "CourseUpsertArg",
          required: true,
        }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, _a, ctx) {
        var course = _a.course
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var id,
            new_photo,
            slug,
            new_slug,
            base64,
            course_translations,
            open_university_registration_links,
            course_variants,
            course_aliases,
            study_modules,
            completion_email,
            status,
            delete_photo,
            inherit_settings_from,
            completions_handled_by,
            user_course_settings_visibilities,
            end_date,
            photo,
            newImage,
            existingCourse,
            translationMutation,
            registrationLinkMutation,
            courseVariantMutation,
            courseAliasMutation,
            userCourseSettingsVisibilityMutation,
            existingVisibilities,
            existingStudyModules,
            removedModuleIds,
            connectModules,
            studyModuleMutation,
            existingInherit,
            inheritMutation,
            existingHandled,
            handledMutation,
            updatedCourse
          var _b
          return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
              case 0:
                ;(id = course.id),
                  (new_photo = course.new_photo),
                  (slug = course.slug),
                  (new_slug = course.new_slug),
                  (base64 = course.base64),
                  (course_translations = course.course_translations),
                  (open_university_registration_links =
                    course.open_university_registration_links),
                  (course_variants = course.course_variants),
                  (course_aliases = course.course_aliases),
                  (study_modules = course.study_modules),
                  (completion_email = course.completion_email),
                  (status = course.status),
                  (delete_photo = course.delete_photo),
                  (inherit_settings_from = course.inherit_settings_from),
                  (completions_handled_by = course.completions_handled_by),
                  (user_course_settings_visibilities =
                    course.user_course_settings_visibilities)
                end_date = course.end_date
                if (!slug) {
                  throw new Error("slug required for update course")
                }
                photo = course.photo
                if (!new_photo) return [3 /*break*/, 4]
                return [
                  4 /*yield*/,
                  Image_1.uploadImage({
                    ctx: ctx,
                    file: new_photo,
                    base64:
                      base64 !== null && base64 !== void 0 ? base64 : false,
                  }),
                ]
              case 1:
                newImage = _c.sent()
                if (!(photo && photo !== newImage.id)) return [3 /*break*/, 3]
                // TODO: do something with return value
                return [
                  4 /*yield*/,
                  Image_1.deleteImage({ ctx: ctx, id: photo }),
                ]
              case 2:
                // TODO: do something with return value
                _c.sent()
                _c.label = 3
              case 3:
                photo = newImage.id
                _c.label = 4
              case 4:
                return [
                  4 /*yield*/,
                  ctx.db.course.findOne({ where: { slug: slug } }),
                ]
              case 5:
                existingCourse = _c.sent()
                if (
                  (existingCourse === null || existingCourse === void 0
                    ? void 0
                    : existingCourse.status) != status &&
                  status === "Ended" &&
                  end_date === ""
                ) {
                  end_date = new Date().toLocaleDateString()
                }
                if (!(photo && delete_photo)) return [3 /*break*/, 7]
                return [
                  4 /*yield*/,
                  Image_1.deleteImage({ ctx: ctx, id: photo }),
                ]
              case 6:
                _c.sent()
                photo = null
                _c.label = 7
              case 7:
                return [
                  4 /*yield*/,
                  createMutation({
                    ctx: ctx,
                    slug: slug,
                    data: course_translations,
                    field: "course_translations",
                  }),
                ]
              case 8:
                translationMutation = _c.sent()
                return [
                  4 /*yield*/,
                  createMutation({
                    ctx: ctx,
                    slug: slug,
                    data: open_university_registration_links,
                    field: "open_university_registration_links",
                  }),
                ]
              case 9:
                registrationLinkMutation = _c.sent()
                return [
                  4 /*yield*/,
                  createMutation({
                    ctx: ctx,
                    slug: slug,
                    data: course_variants,
                    field: "course_variants",
                  }),
                ]
              case 10:
                courseVariantMutation = _c.sent()
                return [
                  4 /*yield*/,
                  createMutation({
                    ctx: ctx,
                    slug: slug,
                    data: course_aliases,
                    field: "course_aliases",
                  }),
                ]
              case 11:
                courseAliasMutation = _c.sent()
                return [
                  4 /*yield*/,
                  createMutation({
                    ctx: ctx,
                    slug: slug,
                    data: user_course_settings_visibilities,
                    field: "user_course_settings_visibilities",
                  }),
                ]
              case 12:
                userCourseSettingsVisibilityMutation = _c.sent()
                return [
                  4 /*yield*/,
                  ctx.db.course
                    .findOne({ where: { slug: slug } })
                    .user_course_settings_visibilities(),
                ]
              case 13:
                existingVisibilities = _c.sent()
                existingVisibilities === null || existingVisibilities === void 0
                  ? void 0
                  : existingVisibilities.forEach(function (visibility) {
                      return redis_1.invalidate(
                        "usercoursesettingscount",
                        slug + "-" + visibility.language,
                      )
                    })
                return [
                  4 /*yield*/,
                  ctx.db.course
                    .findOne({ where: { slug: slug } })
                    .study_modules(),
                  //const addedModules: StudyModuleWhereUniqueInput[] = pullAll(study_modules, existingStudyModules.map(module => module.id))
                ]
              case 14:
                existingStudyModules = _c.sent()
                removedModuleIds = (existingStudyModules || [])
                  .filter(function (module) {
                    return !getIds(
                      study_modules !== null && study_modules !== void 0
                        ? study_modules
                        : [],
                    ).includes(module.id)
                  })
                  .map(function (module) {
                    return { id: module.id }
                  })
                connectModules =
                  (_b =
                    study_modules === null || study_modules === void 0
                      ? void 0
                      : study_modules.map(function (s) {
                          var _a, _b
                          return tslib_1.__assign(tslib_1.__assign({}, s), {
                            id:
                              (_a = s.id) !== null && _a !== void 0
                                ? _a
                                : undefined,
                            slug:
                              (_b = s.slug) !== null && _b !== void 0
                                ? _b
                                : undefined,
                          })
                        })) !== null && _b !== void 0
                    ? _b
                    : []
                studyModuleMutation = study_modules
                  ? {
                      connect: connectModules.length
                        ? connectModules
                        : undefined,
                      disconnect: removedModuleIds.length
                        ? removedModuleIds
                        : undefined,
                    }
                  : undefined
                return [
                  4 /*yield*/,
                  ctx.db.course
                    .findOne({ where: { slug: slug } })
                    .inherit_settings_from(),
                ]
              case 15:
                existingInherit = _c.sent()
                inheritMutation = inherit_settings_from
                  ? {
                      connect: { id: inherit_settings_from },
                    }
                  : existingInherit
                  ? {
                      disconnect: true,
                    }
                  : undefined
                return [
                  4 /*yield*/,
                  ctx.db.course
                    .findOne({ where: { slug: slug } })
                    .completions_handled_by(),
                ]
              case 16:
                existingHandled = _c.sent()
                handledMutation = completions_handled_by
                  ? {
                      connect: { id: completions_handled_by },
                    }
                  : existingHandled
                  ? {
                      disconnect: true,
                    }
                  : undefined
                return [
                  4 /*yield*/,
                  ctx.db.course.update({
                    where: {
                      id: id !== null && id !== void 0 ? id : undefined,
                      slug: slug,
                    },
                    data: tslib_1.__assign(
                      tslib_1.__assign(
                        {},
                        lodash_1.omit(course, [
                          "id",
                          "photo",
                          "base64",
                          "new_slug",
                          "new_photo",
                          "delete_photo",
                        ]),
                      ),
                      {
                        slug: new_slug ? new_slug : slug,
                        end_date: end_date,
                        // FIXME: disconnect removed photos?
                        photo: !!photo ? { connect: { id: photo } } : undefined,
                        course_translations: translationMutation,
                        study_modules: studyModuleMutation,
                        open_university_registration_links: registrationLinkMutation,
                        course_variants: courseVariantMutation,
                        course_aliases: courseAliasMutation,
                        completion_email: completion_email
                          ? { connect: { id: completion_email } }
                          : undefined,
                        inherit_settings_from: inheritMutation,
                        completions_handled_by: handledMutation,
                        user_course_settings_visibilities: userCourseSettingsVisibilityMutation,
                      },
                    ),
                  }),
                ]
              case 17:
                updatedCourse = _c.sent()
                return [2 /*return*/, updatedCourse]
            }
          })
        })
      },
    })
    t.field("deleteCourse", {
      type: "Course",
      args: {
        id: nexus_1.schema.idArg(),
        slug: nexus_1.schema.stringArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var id, slug, photo, deletedCourse
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(id = args.id), (slug = args.slug)
                if (!id && !slug) {
                  throw new apollo_server_core_1.UserInputError(
                    "must provide id or slug",
                  )
                }
                return [
                  4 /*yield*/,
                  ctx.db.course
                    .findOne({
                      where: {
                        id: id !== null && id !== void 0 ? id : undefined,
                        slug:
                          slug !== null && slug !== void 0 ? slug : undefined,
                      },
                    })
                    .photo(),
                ]
              case 1:
                photo = _a.sent()
                if (!photo) return [3 /*break*/, 3]
                return [
                  4 /*yield*/,
                  Image_1.deleteImage({ ctx: ctx, id: photo.id }),
                ]
              case 2:
                _a.sent()
                _a.label = 3
              case 3:
                return [
                  4 /*yield*/,
                  ctx.db.course["delete"]({
                    where: {
                      id: id !== null && id !== void 0 ? id : undefined,
                      slug: slug !== null && slug !== void 0 ? slug : undefined,
                    },
                  }),
                ]
              case 4:
                deletedCourse = _a.sent()
                return [2 /*return*/, deletedCourse]
            }
          })
        })
      },
    })
  },
})
var getIds = function (arr) {
  return (arr || []).map(function (t) {
    return t.id
  })
}
var filterNotIncluded = function (arr1, arr2, mapToId) {
  if (mapToId === void 0) {
    mapToId = true
  }
  var ids1 = getIds(arr1)
  var ids2 = getIds(arr2)
  var filtered = ids1.filter(function (id) {
    return !ids2.includes(id)
  })
  if (mapToId) {
    return filtered.map(function (id) {
      return { id: id }
    })
  }
  return filtered
}
var createMutation = function (_a) {
  var ctx = _a.ctx,
    slug = _a.slug,
    data = _a.data,
    field = _a.field
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var existing, e_1, newOnes, updated, removed
    return tslib_1.__generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (!data) {
            return [2 /*return*/, undefined]
          }
          _b.label = 1
        case 1:
          _b.trys.push([1, 3, , 4])
          return [
            4 /*yield*/,
            ctx.db.course.findOne({ where: { slug: slug } })[field](),
          ]
        case 2:
          // @ts-ignore: can't be arsed to do the typing, works
          existing = _b.sent()
          return [3 /*break*/, 4]
        case 3:
          e_1 = _b.sent()
          throw new Error(
            "error creating mutation " +
              field +
              " for course " +
              slug +
              ": " +
              e_1,
          )
        case 4:
          newOnes = (data || [])
            .filter(function (t) {
              return !t.id
            })
            .map(function (t) {
              return tslib_1.__assign(tslib_1.__assign({}, t), {
                id: undefined,
              })
            })
          updated = (data || [])
            .filter(function (t) {
              return !!t.id
            })
            .map(function (t) {
              return {
                where: { id: t.id },
                data: tslib_1.__assign(tslib_1.__assign({}, t), {
                  id: undefined,
                }),
              }
            })
          removed = filterNotIncluded(existing, data)
          return [
            2 /*return*/,
            {
              create: newOnes.length ? newOnes : undefined,
              updateMany: updated.length ? updated : undefined,
              deleteMany: removed.length ? removed : undefined,
            },
          ]
      }
    })
  })
}
//# sourceMappingURL=mutations.js.map

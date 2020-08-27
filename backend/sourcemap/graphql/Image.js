"use strict"
exports.__esModule = true
exports.deleteImage = exports.uploadImage = void 0
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var google_cloud_1 = require("../services/google-cloud")
var accessControl_1 = require("../accessControl")
var sharp = require("sharp")
nexus_1.schema.objectType({
  name: "Image",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.compressed()
    t.model.compressed_mimetype()
    t.model["default"]()
    t.model.encoding()
    t.model.name()
    t.model.original()
    t.model.original_mimetype()
    t.model.uncompressed()
    t.model.uncompressed_mimetype()
    t.model.courses()
  },
})
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    var _this = this
    t.field("addImage", {
      type: "Image",
      args: {
        file: nexus_1.schema.arg({ type: "Upload", required: true }),
        base64: nexus_1.schema.booleanArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var file, base64
          return tslib_1.__generator(this, function (_a) {
            ;(file = args.file), (base64 = args.base64)
            return [
              2 /*return*/,
              exports.uploadImage({
                ctx: ctx,
                file: file,
                base64: base64 !== null && base64 !== void 0 ? base64 : false,
              }),
            ]
          })
        })
      },
    })
    t.field("deleteImage", {
      type: "Boolean",
      args: {
        id: nexus_1.schema.idArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, _a, ctx) {
        var id = _a.id
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          return tslib_1.__generator(this, function (_b) {
            return [2 /*return*/, exports.deleteImage({ ctx: ctx, id: id })]
          })
        })
      },
    })
  },
})
// FIXME: not used anywhere
/* const getImageBuffer = (image: string) => {
  const base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, "")

  return new Buffer(base64EncodedImageString, "base64")
} */
var readFS = function (stream) {
  var chunkList = []
  return new Promise(function (resolve, reject) {
    return stream
      .on("data", function (data) {
        return chunkList.push(data)
      })
      .on("error", function (err) {
        return reject(err)
      })
      .on("end", function () {
        return resolve(Buffer.concat(chunkList))
      })
  })
}
exports.uploadImage = function (_a) {
  var ctx = _a.ctx,
    file = _a.file,
    _b = _a.base64,
    base64 = _b === void 0 ? false : _b
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _c,
      createReadStream,
      mimetype,
      filename,
      image,
      filenameWithoutExtension,
      uncompressedImage,
      compressedImage,
      original,
      originalMimetype,
      uncompressed,
      compressed,
      newImage
    var _d
    return tslib_1.__generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          return [4 /*yield*/, file]
        case 1:
          ;(_c = _e.sent()),
            (createReadStream = _c.createReadStream),
            (mimetype = _c.mimetype),
            (filename = _c.filename)
          return [4 /*yield*/, readFS(createReadStream())]
        case 2:
          image = _e.sent()
          filenameWithoutExtension =
            (_d = /(.+?)(\.[^.]*$|$)$/.exec(filename)) === null || _d === void 0
              ? void 0
              : _d[1]
          return [4 /*yield*/, sharp(image).jpeg().toBuffer()]
        case 3:
          uncompressedImage = _e.sent()
          return [
            4 /*yield*/,
            sharp(image).resize({ height: 250 }).webp().toBuffer(),
          ]
        case 4:
          compressedImage = _e.sent()
          return [
            4 /*yield*/,
            google_cloud_1.uploadImage({
              imageBuffer: image,
              mimeType: mimetype,
              name: filenameWithoutExtension,
              directory: "original",
              base64: base64,
            }),
          ]
        case 5:
          original = _e.sent()
          originalMimetype = mimetype
          return [
            4 /*yield*/,
            google_cloud_1.uploadImage({
              imageBuffer: uncompressedImage,
              mimeType: "image/jpeg",
              name: filenameWithoutExtension,
              directory: "jpeg",
              base64: base64,
            }),
          ]
        case 6:
          uncompressed = _e.sent()
          return [
            4 /*yield*/,
            google_cloud_1.uploadImage({
              imageBuffer: compressedImage,
              mimeType: "image/webp",
              name: filenameWithoutExtension,
              directory: "webp",
              base64: base64,
            }),
          ]
        case 7:
          compressed = _e.sent()
          if (base64 && original.length > 262144) {
            // Image upload fails if the original pic is too big converted to base64.
            // Since we're only base64'ing in dev, this is not a production problem
            original = uncompressed
            originalMimetype = "image/jpeg"
          }
          return [
            4 /*yield*/,
            ctx.db.image.create({
              data: {
                name: filename,
                original: original,
                original_mimetype: originalMimetype,
                uncompressed: uncompressed,
                uncompressed_mimetype: "image/jpeg",
                compressed: compressed,
                compressed_mimetype: "image/webp",
              },
            }),
          ]
        case 8:
          newImage = _e.sent()
          return [2 /*return*/, newImage]
      }
    })
  })
}
exports.deleteImage = function (_a) {
  var ctx = _a.ctx,
    id = _a.id
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var image, compressed, _b, uncompressed, original
    return tslib_1.__generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [4 /*yield*/, ctx.db.image.findOne({ where: { id: id } })]
        case 1:
          image = _c.sent()
          if (!image) {
            return [2 /*return*/, false]
          }
          if (!image.compressed) return [3 /*break*/, 3]
          return [4 /*yield*/, google_cloud_1.deleteImage(image.compressed)]
        case 2:
          _b = _c.sent()
          return [3 /*break*/, 4]
        case 3:
          _b = false
          _c.label = 4
        case 4:
          compressed = _b
          return [4 /*yield*/, google_cloud_1.deleteImage(image.uncompressed)]
        case 5:
          uncompressed = _c.sent()
          return [4 /*yield*/, google_cloud_1.deleteImage(image.original)]
        case 6:
          original = _c.sent()
          if (!compressed || !uncompressed || !original) {
            console.warn(
              "There was some problem with image deletion. Statuses: compressed " +
                compressed +
                " uncompressed " +
                uncompressed +
                " original " +
                original,
            )
          }
          return [4 /*yield*/, ctx.db.image["delete"]({ where: { id: id } })]
        case 7:
          _c.sent()
          return [2 /*return*/, true]
      }
    })
  })
}
//# sourceMappingURL=Image.js.map

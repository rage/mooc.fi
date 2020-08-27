"use strict"
exports.__esModule = true
exports.deleteImage = exports.uploadImage = void 0
var tslib_1 = require("tslib")
var storage_1 = require("@google-cloud/storage")
var shortid = tslib_1.__importStar(require("shortid"))
var mime = tslib_1.__importStar(require("mime-types"))
var isProduction = process.env.NODE_ENV === "production"
var bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET
// const isReflection = process.env.NEXUS_REFLECTION
if (!bucketName && isProduction) {
  console.error("no bucket name defined in GOOGLE_CLOUD_STORAGE_BUCKET")
  process.exit(1)
}
var storage = isProduction
  ? new storage_1.Storage({
      projectId: process.env.GOOGLE_CLOUD_STORAGE_PROJECT,
      keyFilename: process.env.GOOGLE_CLOUD_STORAGE_KEYFILE,
    })
  : {
      bucket: function () {
        return {
          file: function () {
            return {
              save: function (
                _, // buffer
                __, // options
                cb,
              ) {
                return cb()
              },
              delete: function () {
                return Promise.resolve(true)
              },
            }
          },
        }
      },
    }
// FIXME: doesn't actually upload in dev even with base64 set to false unless isproduction is true
var bucket = storage.bucket(
  bucketName !== null && bucketName !== void 0 ? bucketName : "",
) // this shouldn't ever happen in production
exports.uploadImage = function (_a) {
  var imageBuffer = _a.imageBuffer,
    mimeType = _a.mimeType,
    _b = _a.name,
    name = _b === void 0 ? "" : _b,
    _c = _a.directory,
    directory = _c === void 0 ? "" : _c,
    _d = _a.base64,
    base64 = _d === void 0 ? false : _d
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var filename, base64_1, file
    return tslib_1.__generator(this, function (_e) {
      filename =
        "" +
        (directory ? directory + "/" : "") +
        shortid.generate() +
        (name && name !== "" ? "-" + name : "") +
        "." +
        mime.extension(mimeType)
      if (base64) {
        base64_1 =
          "data:" + mimeType + ";base64," + imageBuffer.toString("base64")
        return [2 /*return*/, Promise.resolve(base64_1)]
      }
      file = bucket.file(filename)
      return [
        2 /*return*/,
        new Promise(function (resolve, reject) {
          file.save(
            imageBuffer,
            {
              metadata: { cacheControl: "public, max-age=2628000" },
              // can't set this with ACL disabled; images will (hopefully) be public by default
              // public: true,
              validation: "md5",
            },
            function (error) {
              if (error) {
                reject(error)
              }
              resolve(filename)
            },
          )
        }),
      ]
    })
  })
}
exports.deleteImage = function (filename) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var file
    return tslib_1.__generator(this, function (_a) {
      if (!filename || filename === "") {
        return [2 /*return*/, Promise.resolve(false)]
      }
      if (~filename.indexOf("base64")) {
        return [2 /*return*/, Promise.resolve(true)]
      }
      file = bucket.file(filename)
      return [
        2 /*return*/,
        file["delete"]()
          .then(function () {
            return true
          })
          ["catch"](function (err) {
            return console.error("image delete error", err), false
          }),
      ]
    })
  })
}
//# sourceMappingURL=google-cloud.js.map

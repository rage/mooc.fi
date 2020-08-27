"use strict"
exports.__esModule = true
exports.MessageYupSchema = void 0
var tslib_1 = require("tslib")
var yup = tslib_1.__importStar(require("yup"))
var CURRENT_MESSAGE_FORMAT_VERSION = 1
var PointsByGroupYupSchema = yup.object().shape({
  group: yup.string().required(),
  max_points: yup.number().required(),
  n_points: yup.number().required(),
  progress: yup.number().required(),
})
exports.MessageYupSchema = yup.object().shape({
  timestamp: yup.date().required(),
  course_id: yup.string().length(36).required(),
  service_id: yup.string().length(36).required(),
  user_id: yup.number(),
  progress: yup.array().of(PointsByGroupYupSchema).required(),
  message_format_version: yup
    .number()
    .min(CURRENT_MESSAGE_FORMAT_VERSION)
    .max(CURRENT_MESSAGE_FORMAT_VERSION)
    .required(),
})
//# sourceMappingURL=validate.js.map

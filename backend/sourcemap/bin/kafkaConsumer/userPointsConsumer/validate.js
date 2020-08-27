"use strict"
exports.__esModule = true
exports.MessageYupSchema = void 0
var tslib_1 = require("tslib")
var yup = tslib_1.__importStar(require("yup"))
var CURRENT_MESSAGE_FORMAT_VERSION = 1
exports.MessageYupSchema = yup.object().shape({
  timestamp: yup.date().required(),
  exercise_id: yup.string().required(),
  n_points: yup.number().nullable(),
  completed: yup.boolean().required(),
  user_id: yup.number().required(),
  course_id: yup.string().length(36).required(),
  service_id: yup.string().length(36).required(),
  required_actions: yup.array(yup.string()),
  message_format_version: yup
    .number()
    .min(CURRENT_MESSAGE_FORMAT_VERSION)
    .max(CURRENT_MESSAGE_FORMAT_VERSION)
    .required(),
})
//# sourceMappingURL=validate.js.map

"use strict"
exports.__esModule = true
var nexus_1 = require("nexus")
nexus_1.schema.objectType({
  name: "ExerciseCompletionRequiredAction",
  definition: function (t) {
    t.model.id()
    t.model.exercise_completion_id()
    t.model.exercise_completion()
    t.model.value()
  },
})
//# sourceMappingURL=ExerciseCompletionRequiredAction.js.map

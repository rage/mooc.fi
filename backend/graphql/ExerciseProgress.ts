import { objectType } from "nexus"

export const ExerciseProgress = objectType({
  name: "ExerciseProgress",
  definition(t) {
    t.float("total", {
      description: "User course progress n_points divided by max_points",
    })
    t.float("exercises", {
      description:
        "Completed exercises divided by number of exercises on the course",
    })
    t.int("exercise_count", {
      description: "Number of exercises on the course",
    })
    t.int("exercises_completed_count", {
      description: "Number of completed exercises",
    })
    t.int("exercises_attempted_count", {
      description: "Number of attempted exercises",
    })
  },
})

import { ValidationError } from "yup"

import { ExerciseData } from "../interfaces"
import { ExerciseDataYupSchema } from "../validate"

describe("exercise data validation", () => {
  it("ok on correct part string format", async () => {
    const data: ExerciseData = {
      name: "test",
      id: "test",
      part: "osa01",
      section: 1,
      max_points: 1,
    }

    await ExerciseDataYupSchema.validate(data)
  })

  it("ok on correct part number format", async () => {
    const data: ExerciseData = {
      name: "test",
      id: "test",
      part: 1,
      section: 1,
      max_points: 1,
    }

    await ExerciseDataYupSchema.validate(data)
  })

  it("errors on incorrect part format", async () => {
    const data: ExerciseData = {
      name: "foo",
      id: "foo",
      part: "foo",
      section: 0,
      max_points: 0,
    }

    try {
      await ExerciseDataYupSchema.validate(data)
      fail()
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
    }
  })
})

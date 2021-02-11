import * as faker from "faker"
import { Exercise } from "@prisma/client"
import prisma from "./lib/prisma"

const createExercise = () => ({
  name: faker.random.words(),
  max_points: Math.round(Math.random() * 10),
  part: Math.round(Math.random() * 3 + 1),
  section: Math.round(Math.random() * 3 + 1),
  timestamp: new Date(),
  custom_id: faker.random.uuid(),
})

const createExerciseCompletion = (exercise: Exercise) => ({
  n_points: Math.round(Math.random() * exercise.max_points!),
  timestamp: new Date(),
  completed: Math.random() * 5 < 2 ? false : true,
})

const addExercises = async () => {
  const courses = await prisma.course.findMany()

  for (const course of courses) {
    Array.from({ length: Math.random() * 10 }).forEach(async (_) => {
      await prisma.exercise.create({
        data: {
          ...createExercise(),
          course: { connect: { id: course.id } },
        },
      })
    })
  }
}

const choice = <T>(a: T[]): T => a[Math.round(Math.random() * a.length)]

const addExerciseCompletions = async () => {
  const users = await prisma.user.findMany()
  const exercises = await prisma.exercise.findMany()

  for (const user of users) {
    Array.from({ length: Math.random() * 50 }).forEach(async (_) => {
      const exercise = choice(exercises)

      const data = {
        ...createExerciseCompletion(exercise),
        user: { connect: { id: user.id } },
        exercise: { connect: { id: exercise.id } },
      }
      console.log("would create", data)

      await prisma.exerciseCompletion.create({
        data,
      })
    })
  }
}

const seed = async () => {
  await addExercises()
  await addExerciseCompletions()
}

seed().then(() => process.exit(0))

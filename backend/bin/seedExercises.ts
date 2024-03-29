// eslint-disable-next-line import/no-extraneous-dependencies
import * as faker from "faker"
import { sample } from "lodash"

import { Exercise } from "@prisma/client"

import prisma from "../prisma"

const createExercise = () => ({
  name: faker.random.words(),
  max_points: Math.round(Math.random() * 10),
  part: Math.round(Math.random() * 3 + 1),
  section: Math.round(Math.random() * 3 + 1),
  timestamp: new Date(),
  custom_id: faker.random.uuid(),
})

const createExerciseCompletion = (exercise: Exercise) => ({
  n_points: Math.round(Math.random() * (exercise.max_points ?? 0)),
  timestamp: new Date(),
  completed: Math.random() * 5 < 2 ? false : true,
  attempted: true,
})

const addExercises = async () => {
  const courses = await prisma.course.findMany()

  for (const course of courses) {
    await Promise.all(
      Array.from({ length: Math.random() * 10 }).map(async (_) => {
        return prisma.exercise.create({
          data: {
            ...createExercise(),
            course: { connect: { id: course.id } },
          },
        })
      }),
    )
  }
}

const addExerciseCompletions = async () => {
  const users = await prisma.user.findMany()
  const exercises = await prisma.exercise.findMany()

  if (exercises.length === 0) {
    throw new Error("Exercises not seeded")
  }

  for (const user of users) {
    await Promise.all(
      Array.from({ length: Math.random() * 50 }).map(async (_) => {
        const exercise = sample(exercises)

        if (!exercise) {
          return
        }
        const data = {
          ...createExerciseCompletion(exercise),
          user: { connect: { id: user.id } },
          exercise: { connect: { id: exercise.id } },
        }

        return prisma.exerciseCompletion.create({
          data,
        })
      }),
    )
  }
}

const seed = async () => {
  await addExercises()
  await addExerciseCompletions()
}

seed().then(() => process.exit(0))

import { Message } from "../userPointsConsumer/interfaces"
import { Logger } from "winston"
import { Message as KafkaMessage } from "node-rdkafka"
import { KafkaMessageError, ValidationError } from "../../lib/errors"
import { MessageYupSchema } from "../userPointsConsumer/validate"
import { groupBy, uniq, compact, difference } from "lodash"
import { getBatchUsersFromTMC } from "../common/getUserFromTMC"
import { Course } from "/generated/prisma-client"
import { Exercise, ExerciseCompletion } from "nexus-plugin-prisma/client"
import knex from "../../../util/knex"

const handleMessages = async (messages: KafkaMessage[], logger: Logger) => {
  logger.info(`Handling ${messages.length} messages.`)
  const validMessages = compact(
    await Promise.all(
      messages.map(async (kafkaMessage) => {
        const message = kafkaMessageToMessage(kafkaMessage, logger)
        if (!message) {
          return null
        }

        try {
          await MessageYupSchema.validate(message)
        } catch (error) {
          logger.error(
            new ValidationError("JSON validation failed", message, error),
          )
          return null
        }

        return message
      }),
    ),
  )
  logger.info(`Validated messages, ${validMessages.length} were valid.`)

  if (validMessages.length === 0) {
    logger.info("No messages were valid. Aborting..")
    return
  }

  const userIds = compact(uniq(validMessages.map((o) => o?.user_id)))
  logger.info(
    `Messages contain ${userIds.length} unique users. Making sure they exist...`,
  )
  const usersInDb: { upstream_id: number }[] = await knex("user")
    .select("upstream_id")
    .whereIn("upstream_id", userIds)

  const newUsers = difference(
    userIds,
    usersInDb.map((o) => o.upstream_id),
  )
  logger.info(`New users that need to be imported: ${newUsers.length}`)
  const users = await getBatchUsersFromTMC(newUsers)
  const userDataBaseIds = compact(uniq(users.map((o) => o?.id)))
  logger.info(`Import done. ${users.length} imported.`)

  logger.info("Getting courses, exercises and exercise completions")
  const courseIds = compact(uniq(validMessages.map((o) => o?.course_id)))
  const courses: Course[] = await knex("course").whereIn("id", courseIds)
  const exerciseIds = compact(uniq(validMessages.map((o) => o?.exercise_id)))
  const exercises: Exercise[] = await knex("exercise").whereIn(
    "custom_id",
    exerciseIds,
  )

  // This may select more rows than necessary but let's hope the overhead isn't
  // too much.
  const exerciseCompletions: ExerciseCompletion[] = await knex(
    "exercise_completion",
  )
    .join("exercise", "exercise.id", "=", "exercise_completion.exercise_id")
    .whereIn("exercise.custom_id", exerciseIds)
    .whereIn("user_id", userDataBaseIds)

  logger.info("Grouping")
  const courseById = groupBy(courses, "id")
  const exerciseById = groupBy(exercises, "custom_id")
  const usersById = groupBy(users, "upstream_id")
  const exerciseCompletionsByExerciseId = groupBy(
    exerciseCompletions,
    "exercises.custom_id",
  )
  return 1
}

// const saveExerciseCompletion = async (message: Message, course: Course, exercise: Exercise, user: User, exerciseCompletion: ExerciseCompletion, logger: Logger) => {
//   const timestamp: DateTime = DateTime.fromISO(message.timestamp)
//   if (!exerciseCompletion) {
//     logger.info("No previous completion, creating a new one")
//     const data = {
//       exercise: {
//         connect: { id: exercise.id },
//       },
//       user: {
//         connect: { upstream_id: Number(message.user_id) },
//       },
//       n_points: message.n_points,
//       completed: message.completed,
//       exercise_completion_required_actions: {
//         create: message.required_actions.map((ra) => {
//           return {
//             value: ra,
//           }
//         }),
//       },
//       timestamp: timestamp.toJSDate(),
//     }
//     logger.info(`Inserting ${JSON.stringify(data)}`)
//     try {
//       await prisma.exerciseCompletion.create({
//         data,
//       })
//     } catch (e) {
//       if (e instanceof Error) {
//         logger.warn(
//           `Inserting exercise completion failed ${e.name}: ${e.message}`,
//         )
//       }
//     }
//   } else {
//     logger.info("Updating previous completion")
//     const oldTimestamp = DateTime.fromISO(
//       exerciseCompleted?.timestamp?.toISOString() ?? "",
//     )
//     if (timestamp <= oldTimestamp) {
//       return ok("Timestamp older than in DB, aborting")
//     }
//     await prisma.exerciseCompletion.update({
//       where: { id: exerciseCompleted.id },
//       data: {
//         n_points: Number(message.n_points),
//         completed: message.completed,
//         exercise_completion_required_actions: {
//           create: message.required_actions.map((ra) => {
//             return {
//               value: ra,
//             }
//           }),
//         },
//         timestamp: timestamp.toJSDate(),
//       },
//     })
//   }
//   await CheckCompletion(user, course)
// }

const kafkaMessageToMessage = (
  kafkaMessage: KafkaMessage,
  logger: Logger,
): Message | null => {
  let message: Message
  try {
    message = JSON.parse(kafkaMessage?.value?.toString("utf8") ?? "")
  } catch (error) {
    logger.error(new KafkaMessageError("invalid message", kafkaMessage, error))
    return null
  }
  return message
}

export default handleMessages

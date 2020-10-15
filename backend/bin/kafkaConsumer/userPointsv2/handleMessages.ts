import { Message } from "../userPointsConsumer/interfaces"
import { Logger } from "winston"
import { Message as KafkaMessage } from "node-rdkafka"
import { KafkaMessageError, ValidationError } from "../../lib/errors"
import { MessageYupSchema } from "../userPointsConsumer/validate"
import { groupBy, uniq, compact, difference, partition } from "lodash"
import { getBatchUsersFromTMC } from "../common/getUserFromTMC"
import { Course } from "/generated/prisma-client"
import { Exercise, ExerciseCompletion } from "nexus-plugin-prisma/client"
import knex from "../../../util/knex"
import { DateTime } from "luxon"

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
  const exerciseCompletionsByUserDatabaseId = groupBy(
    exerciseCompletions,
    "user_id",
  )

  // handle new completions
  logger.info("Figuring out new exercise completions")
  const [newCompletionMessages, existingCompletionMessages] = partition(
    validMessages,
    (m) => {
      const user = (usersById[m.user_id] || [])[0]
      if (!user) {
        logger.error("User not found", { message: m })
        return false
      }
      const userExerciseCompletions = (exerciseCompletionsByUserDatabaseId[
        user.id
      ] || []).filter((c) => c.exercise_id === m.exercise_id)
      return userExerciseCompletions.length === 0
    },
  )

  logger.info(
    `${newCompletionMessages.length} messages require a new exercise completion`,
  )

  const insertableObject = constructInsertableObjects(newCompletionMessages)
  logger.info("Inserting...")
  await knex("exercise_completion").insert(insertableObject)

  logger.info(
    `${existingCompletionMessages.length} reference an existing completion. Comparing timestamps with db.`,
  )

  const messagesNewerThanDb = existingCompletionMessages.filter((m) => {
    const user = (usersById[m.user_id] || [])[0]
    if (!user) {
      console.error("User not found", { message: m })
      return false
    }
    const userExerciseCompletion = (exerciseCompletionsByUserDatabaseId[
      user.id
    ] || []).filter((c) => c.exercise_id === m.exercise_id)[0]
    if (!userExerciseCompletion) {
      logger.error("Exercise completion disappeared.")
      return false
    }
    const timestamp: DateTime = DateTime.fromISO(m.timestamp)
    const oldTimestamp = DateTime.fromISO(
      userExerciseCompletion?.timestamp?.toISOString() ?? "",
    )
    if (timestamp <= oldTimestamp) {
      return false
    }
    return true
  })

  const updateObjects = constructInsertableObjects(messagesNewerThanDb)
  // We have to add existing database ids to the update objects so that we
  // can do the update.
  for (const u of updateObjects) {

  }

  return 1
}

// Constructs objects to be inserted. Makes sure that newer timestamps are respected.
function constructInsertableObjects(messages: Message[]) {
  const dict: Map<String, any> = new Map()
  // Put the newest entry for (exercise, user) combination to the dict
  for (const message of messages) {
    const key = `${message.exercise_id}-${message.user_id}}`
    const existingValue = dict.get(key)
    const timestamp: DateTime = DateTime.fromISO(message.timestamp)
    const insertableObject = {
      n_points: Number(message.n_points),
      completed: message.completed,
      // TODO: figure out whether to keep required actions
      // exercise_completion_required_actions: message.required_actions.map(
      //   (ra) => {
      //     return {
      //       value: ra,
      //     }
      //   },
      // ),
      timestamp: timestamp.toJSDate(),
    }
    if (!existingValue) {
      dict.set(key, insertableObject)
    } else {
      // We want to accept the value with a newer timestamp

      const oldTimestamp = DateTime.fromISO(existingValue.timestamp)
      if (timestamp <= oldTimestamp) {
        // Older messages can be discarded
        continue
      }
      dict.set(key, insertableObject)
    }
  }
  return Object.values(dict)
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

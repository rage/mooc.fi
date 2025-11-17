import { createServer } from "http"

import parseJSON from "json-parse-even-better-errors"
import * as WebSocketServer from "websocket"
import * as winston from "winston"

import { isTest, NEXUS_REFLECTION } from "./config"
import { UserInfo } from "./domain/UserInfo"
import getRedisClient, { getRedisSubscriberClient } from "./services/redis"
import { getCurrentUserDetails } from "./services/tmc"

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "wsServer" },
  transports: [new winston.transports.Console()],
})

const webSocketsServerPort = 9000

const server = createServer()

export const wsListen = () => server.listen(webSocketsServerPort)

const wsServer = new WebSocketServer.server({
  httpServer: server,
})

const connectionByUserCourse = new Map()
const userCourseByConnection = new Map()

let subscriber: ReturnType<typeof getRedisClient> | undefined

export enum MessageType {
  PROGRESS_UPDATED = "PROGRESS_UPDATED",
  PEER_REVIEW_RECEIVED = "PEER_REVIEW_RECEIVED",
  QUIZ_CONFIRMED = "QUIZ_CONFIRMED",
  QUIZ_REJECTED = "QUIZ_REJECTED",
  COURSE_CONFIRMED = "COURSE_CONFIRMED",
}

export const pushMessageToClient = async (
  userId: number,
  courseId: string,
  type: MessageType,
  payload?: string,
) => {
  const userCourseObjectString = JSON.stringify({ userId, courseId })
  const connection = connectionByUserCourse.get(userCourseObjectString)

  if (connection) {
    if (connection.connected) {
      connection.sendUTF(
        JSON.stringify({
          type,
          message: payload,
        }),
      )
    } else {
      connectionByUserCourse.delete(userCourseObjectString)
      await getRedisClient()?.publish(
        "websocket",
        JSON.stringify({ userId, courseId, type, message: payload }),
      )
    }
  } else {
    await getRedisClient()?.publish(
      "websocket",
      JSON.stringify({ userId, courseId, type, message: payload }),
    )
  }
}

wsServer.on("request", (request: any) => {
  logger.info("Request", request.origin)
  const connection = request.accept("echo-protocol", request.origin)

  connection.on("message", async (message: any) => {
    let data
    try {
      data = parseJSON(message.utf8Data)
    } catch (error) {
      logger.error("Error parsing message", error)
      return
    }

    if (
      data instanceof Object &&
      !Array.isArray(data) &&
      data.accessToken &&
      data.courseId
    ) {
      const accessToken = data.accessToken as string
      const courseId = data.courseId as string
      try {
        let user = parseJSON(
          (await getRedisClient()?.get(accessToken)) ?? "",
        ) as UserInfo | null
        if (!user) {
          user = await getCurrentUserDetails(accessToken)
          await getRedisClient()?.set(accessToken, JSON.stringify(user), {
            EX: 3600,
          })
        }
        const userCourseObject = {
          userId: user.id,
          courseId,
        }
        connectionByUserCourse.set(JSON.stringify(userCourseObject), connection)
        userCourseByConnection.set(connection, userCourseObject)
        logger.info("Connection verified")
      } catch (error) {
        connection.drop()
        logger.info("Connection rejected")
      }
    } else {
      connection.drop()
    }
  })

  connection.on("close", () => {
    const userCourseObjectString = JSON.stringify(
      userCourseByConnection.get(connection),
    )
    userCourseByConnection.delete(connection)
    connectionByUserCourse.delete(userCourseObjectString)
  })
})

const createSubscriber = async () => {
  if (NEXUS_REFLECTION || isTest) {
    return
  }

  while (!getRedisSubscriberClient()?.isOpen) {
    logger.info("Waiting on Redis subscriber client to be created...")
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  subscriber = getRedisSubscriberClient()

  subscriber?.on("error", (err: any) => {
    logger.error("Redis subscriber error", err)
  })
  subscriber?.on("ready", () => {
    logger.info(`Redis subscriber connected`)
  })

  if (subscriber && !subscriber.isOpen) {
    await subscriber.connect()
  }

  await subscriber?.subscribe("websocket", (message: any) => {
    let data
    try {
      data = parseJSON(message)
    } catch (error) {
      logger.error("Error parsing message", error)
      return
    }

    if (
      data instanceof Object &&
      !Array.isArray(data) &&
      data.userId &&
      data.courseId &&
      data.type
    ) {
      const userId = data.userId as string
      const courseId = data.courseId as string
      const userCourseObjectString = JSON.stringify({ userId, courseId })
      const connection = connectionByUserCourse.get(userCourseObjectString)
      if (connection) {
        if (connection.connected) {
          connection.sendUTF(
            JSON.stringify({
              type: data.type,
              message: data.message,
            }),
          )
        } else {
          connectionByUserCourse.delete(userCourseObjectString)
        }
      }
    }
  })
}

createSubscriber()

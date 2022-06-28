import { UserInfo } from "./domain/UserInfo"
import redisClient from "./services/redis"
import { getCurrentUserDetails } from "./services/tmc"
import { createServer } from "http"
import * as WebSocketServer from "websocket"

const webSocketsServerPort = 9000

const server = createServer()

export const wsListen = () => server.listen(webSocketsServerPort)

const wsServer = new WebSocketServer.server({
  httpServer: server,
})

const connectionByUserCourse = new Map()
const userCourseByConnection = new Map()

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
      redisClient?.publish(
        "websocket",
        JSON.stringify({ userId, courseId, type, message: payload }),
      )
    }
  } else {
    redisClient?.publish(
      "websocket",
      JSON.stringify({ userId, courseId, type, message: payload }),
    )
  }
}

wsServer.on("request", (request: any) => {
  console.log("request ", request.origin)
  const connection = request.accept("echo-protocol", request.origin)

  connection.on("message", async (message: any) => {
    const data = JSON.parse(message.utf8Data)
    if (data instanceof Object && data.accessToken && data.courseId) {
      const accessToken = data.accessToken
      const courseId = data.courseId
      try {
        let user: UserInfo = JSON.parse(
          (await redisClient?.get(accessToken)) ?? "",
        )
        if (!user) {
          user = await getCurrentUserDetails(accessToken)
          redisClient?.set(accessToken, JSON.stringify(user), {
            EX: 3600,
          })
        }
        const userCourseObject = {
          userId: user.id,
          courseId,
        }
        connectionByUserCourse.set(JSON.stringify(userCourseObject), connection)
        userCourseByConnection.set(connection, userCourseObject)
        console.log("connection verified")
      } catch (error) {
        connection.drop()
        console.log("connection rejected")
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
  const subscriber = redisClient?.duplicate()
  await subscriber?.connect()

  subscriber?.subscribe("websocket", (message: any) => {
    const data = JSON.parse(message)
    if (data instanceof Object && data.userId && data.courseId && data.type) {
      const userId = data.userId
      const courseId = data.courseId
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

import * as http from "http"
import * as WebSocketServer from "websocket"
import redisClient, * as redis from "./services/redis"
import { getCurrentUserDetails } from "./services/tmc"
import { UserInfo } from "./domain/UserInfo"

const webSocketsServerPort = 9000
const server = http.createServer()

export const wsListen = () => server.listen(webSocketsServerPort)

const wsServer = new WebSocketServer.server({
  httpServer: server,
})

const originAccepted: { [origin: string]: boolean } = {
  "http://localhost:1234": true,
  "http://localhost:8000": true,
  "https://40f60d95.ngrok.io": true,
}

const clients: { [userId: number]: any } = {}

type MessageType =
  | "PROGRESS_UPDATED"
  | "PEER_REVIEW_REVEIVED"
  | "QUIZ_CONFIRMED"

export const messageClient = (
  userId: number,
  courseId: string,
  type: MessageType,
  message?: string,
) => {
  if (clients[userId] && clients[userId][courseId]) {
    const connection = clients[userId][courseId]
    if (connection.connected) {
      connection.sendUTF(
        JSON.stringify({
          type,
          message,
        }),
      )
    } else {
      delete clients[userId][courseId]
      redis.publisher.publish(
        "websocket",
        JSON.stringify({ userId, courseId, type, message }),
      )
    }
  } else {
    redis.publisher.publish(
      "websocket",
      JSON.stringify({ userId, courseId, type, message }),
    )
  }
}

wsServer.on("request", (request: any) => {
  console.log("request ", request.origin)
  let connection: any
  if (originAccepted[request.origin]) {
    connection = request.accept("echo-protocol", request.origin)
  } else {
    request.reject()
    console.log("connection rejected")
    return
  }

  connection.on("message", async (message: any) => {
    const data = JSON.parse(message.utf8Data)
    if (data instanceof Object && data.accessToken && data.courseId) {
      const accessToken = data.accessToken
      const courseId = data.courseId
      try {
        let user: UserInfo = JSON.parse(await redis.getAsync(accessToken))
        if (!user) {
          user = await getCurrentUserDetails(accessToken)
          redisClient.set(accessToken, JSON.stringify(user), "EX", 3600)
        }
        clients[user.id] = {
          ...clients[user.id],
          [courseId]: connection,
        }
        console.log("connection verified")
      } catch (error) {
        connection.drop()
        console.log("unauthorized websocket connection")
      }
    } else {
      connection.drop()
    }
  })
})

redis.subscriber.on("message", (channel: any, message: any) => {
  const data = JSON.parse(message)
  if (data instanceof Object && data.userId && data.courseId && data.type) {
    const userId = data.userId
    const courseId = data.courseId
    if (clients[userId] && clients[userId][courseId]) {
      const connection = clients[userId][courseId]
      if (connection.connected) {
        connection.sendUTF(
          JSON.stringify({
            type: data.type,
            message: data.message,
          }),
        )
      } else {
        delete clients[userId][courseId]
      }
    }
  }
})

redis.subscriber.subscribe("websocket")

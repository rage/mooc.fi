import winston from "winston"
import { Message } from "../userPointsConsumer/interfaces"
import handleMessages from "./handleMessages"
import { Message as KafkaMessage } from "node-rdkafka"
import knex from "../../../util/knex"

const knexCleaner = require("knex-cleaner")

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "backend" },
  transports: [new winston.transports.Console()],
})

const safeClean = () => {
  if (process.env.NODE_ENV === "test") {
    return knexCleaner.clean(knex)
  }
}

const safeSeed = (config?: any) => {
  if (process.env.NODE_ENV === "test") {
    return knex.seed.run(config)
  }
}

beforeAll(() => {
  return safeSeed({
    directory: "./seeds",
    specific: "test_seed.ts",
  })
})

afterAll(() => {
  //nock.cleanAll()
  return safeClean()
})

test("Handles one message", async () => {
  const testMessage = {
    timestamp: "2020-09-25T15:10:45.173Z",
    exercise_id: "2",
    n_points: 1,
    completed: true,
    user_id: 14581,
    course_id: "dafb3e3d-ebcc-455d-be04-55939e8d598a",
    service_id: "0062b956-022d-41ff-b5d2-63cf307e42d0",
    required_actions: [],
    message_format_version: 1,
    attempted: true,
  } as Message
  const res = await handleMessages(
    [messageToFakeKafkaMessage(testMessage)],
    logger,
  )
  expect(res).toBe(1)
  const users = await knex("user")
  expect(users.map((o) => o.upstream_id)).toContain(14581)
})

function messageToFakeKafkaMessage(message: Message): KafkaMessage {
  const buffer = Buffer.from(JSON.stringify(message), "utf8")
  return {
    value: buffer,
    size: buffer.length,
    offset: 1,
    topic: "fake-topic",
    partition: 1,
  }
}

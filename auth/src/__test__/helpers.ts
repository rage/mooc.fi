import passport from "passport"

import { handlers as defaultHandlers, Handlers } from "../handlers"
import { createRouter, TestStrategy } from "../saml"
import createApp from "../server"

interface TestConfig {
  handlers?: Handlers
}

export const createTestApp = async ({
  handlers = defaultHandlers,
}: TestConfig = {}): Promise<ReturnType<typeof createApp>> => {
  const { app, server } = await createApp()

  const testStrategyBuilder = await TestStrategy.initialize()
  const testStrategy = testStrategyBuilder.instance

  passport.use("test", testStrategy)

  const testRouter = createRouter({
    strategyName: "test",
    strategy: testStrategy,
    handlers,
  })
  app.use(testRouter)

  return { app, server }
}

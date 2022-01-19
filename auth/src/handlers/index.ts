import { AuthenticationHandlerCallback } from "./callback"
import { connectHandler } from "./connect"
import { metadataHandler } from "./metadata"
import { signInHandler } from "./signIn"
import { signUpHandler } from "./signUp"

export type HandlerAction = "sign-in" | "sign-up" | "connect"
export type Handlers = Record<HandlerAction, AuthenticationHandlerCallback>

export const handlers: Handlers = {
  "sign-in": signInHandler,
  "sign-up": signUpHandler,
  connect: connectHandler,
}

export * from "./callback"
export { connectHandler, metadataHandler, signInHandler, signUpHandler }

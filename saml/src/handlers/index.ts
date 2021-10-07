import { AuthenticationHandlerCallback } from "./callback"
import { connectHandler } from "./connect"
import { signInHandler } from "./signIn"
import { signUpHandler } from "./signUp"

export const handlers: Record<string, AuthenticationHandlerCallback> = {
  "sign-in": signInHandler,
  "sign-up": signUpHandler,
  connect: connectHandler,
}

export * from "./callback"
export { connectHandler, signInHandler, signUpHandler }

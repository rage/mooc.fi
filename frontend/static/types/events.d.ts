declare module "events" {
  import * as originalEvents from "events"

  export function once<T>(
    emitter: originalEvents.EventEmitter,
    name: string | symbol,
  ): T | Promise<T>
}

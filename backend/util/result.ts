import { Warning } from "../lib/errors"

export type Result<T, E> = Ok<T, never> | Err<never, E>
export const ok = <T>(value: T): Ok<T, never> => new Ok(value)
export const err = <E>(err: E): Err<never, E> => new Err(err)

export class Ok<T, E> {
  constructor(readonly value: T) {}

  isOk(): this is Ok<T extends Warning ? never : T, never> {
    return !(this.value instanceof Warning)
  }
  isErr(): this is Err<never, E> {
    return !this.isOk() && !this.isWarning()
  }
  isWarning(): this is Ok<T extends Warning ? T : never, never> {
    return this.value instanceof Warning
  }
  hasValue() {
    return !!this.value
  }

  hasError() {
    return false
  }
}

export class Err<T, E> {
  constructor(readonly error: E) {}

  isOk(): this is Ok<T extends Warning ? never : T, never> {
    return false
  }
  isErr(): this is Err<never, E> {
    return !this.isOk()
  }
  isWarning(): this is Ok<T extends Warning ? T : never, never> {
    return false
  }
  hasError(): this is Err<never, E> {
    return !!this.error
  }
  hasValue() {
    return false
  }
}

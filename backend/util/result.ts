export type Result<T, E> = Ok<T, never> | Err<never, E>
export const ok = <T>(value: T): Ok<T, never> => new Ok(value)
export const err = <E>(err: E): Err<never, E> => new Err(err)

export class Ok<T, E> {
  constructor(readonly value: T) {}

  isOk(): this is Ok<T, E> {
    return true
  }
  isErr(): this is Err<never, E> {
    return !this.isOk()
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

  isOk(): this is Ok<T, never> {
    return false
  }
  isErr(): this is Err<never, E> {
    return !this.isOk()
  }

  hasError() {
    return !!this.error
  }

  hasValue() {
    return false
  }
}

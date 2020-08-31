export type Result<T, E> = Ok<T, E> | Err<T, E>
export const ok = <T, E>(value: T): Ok<T, E> => new Ok(value)
export const err = <T, E>(err: E): Err<T, E> => new Err(err)

export class Ok<T, E> {
  constructor(readonly value: T) {}

  isOk(): this is Ok<T, E> {
    return true
  }
  isErr(): this is Err<T, E> {
    return !this.isOk()
  }

  hasValue() {
    return !!this.value
  }
}

export class Err<T, E> {
  constructor(readonly error: E) {}

  isOk(): this is Ok<T, E> {
    return false
  }
  isErr(): this is Err<T, E> {
    return !this.isOk()
  }

  hasError() {
    return !!this.error
  }
}

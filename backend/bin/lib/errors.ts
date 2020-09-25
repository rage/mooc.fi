class CustomError extends Error {
  constructor(message: string) {
    super(message)

    this.name = this.constructor.name

    Error.captureStackTrace(this, this.constructor)
  }
}

export class TMCError extends CustomError {
  name = "TMCError"

  constructor(message: string, readonly error?: any) {
    super(message)
  }
}

export class DatabaseInputError extends CustomError {
  name = "DatabaseInputError"

  constructor(message: string, data?: object)
  constructor(message: string, data?: object, error?: Error)
  constructor(message: string, readonly data?: object, readonly error?: Error) {
    super(message)
  }
}

export class KafkaMessageError extends CustomError {
  name = "KafkaMessageError"

  constructor(message: string, kafkaMessage?: object)
  constructor(message: string, kafkaMessage?: object, error?: Error)
  constructor(
    message: string,
    readonly kafkaMessage?: object,
    readonly error?: Error,
  ) {
    super(message)
  }
}

export class KafkaError extends CustomError {
  name = "KafkaError"

  constructor(message: string, readonly error: any) {
    super(`${message}; original message: ${error?.message}`)
  }
}

export class ValidationError extends CustomError {
  name = "ValidationError"

  constructor(message: string, readonly data: object, readonly error?: Error) {
    super(message)
  }
}

export class SlackPosterError extends CustomError {
  name = "SlackPosterError"

  constructor(message: string, readonly error: Error) {
    super(message)
  }
}

export class EmailTemplaterError extends CustomError {
  name = "EmailTemplaterError"

  constructor(message: string, readonly error?: Error) {
    super(message)
  }
}

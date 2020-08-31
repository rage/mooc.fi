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

  constructor(message: string, readonly data?: object) {
    super(message)
  }
}

export class KafkaMessageError extends CustomError {
  name = "KafkaMessageError"

  constructor(message: string, readonly kafkaMessage?: object) {
    super(message)
  }
}

export class KafkaError extends CustomError {
  name = "KafkaError"

  constructor(message: string, readonly kafkaError: any) {
    super(`${message}; original message: ${kafkaError?.message}`)
  }
}

export class ValidationError extends CustomError {
  name = "ValidationError"

  constructor(message: string, readonly data?: object) {
    super(message)
  }
}
